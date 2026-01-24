const Match = require("../models/Match");
const User = require("../models/User");
const {
  generateRapidDuel,
  generateBugHunter,
  generateAlgorithmAnalysis,
  generateCodeDuel,
} = require("../utils/game.controller");
const { executeCode } = require("../utils/piston");

const queues = {
  rapidDuel: [],
  bughunter: [],
  codeDuel: [],
  algorithmAnalysis: [],
  complexityDuel: [],
};

const activeMatches = new Map();
const processingUsers = new Set();

/* ================== HELPER UTILITIES ================== */

function getUserId(socket) {
  return (
    socket.request.user?._id?.toString() ||
    socket.request.session?.passport?.user?.toString() ||
    null
  );
}

function createRoomId(mode) {
  return `${mode}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function difficultyRating(r1 = 1200, r2 = 1200) {
  return Math.round((Number(r1) + Number(r2)) / 2);
}

async function getQuestions(mode, avgRating = 0) {
  if (mode === "rapidDuel") return await generateRapidDuel(5, avgRating);
  if (mode === "bughunter") return await generateBugHunter(5, avgRating);
  if (mode === "complexityDuel") return await generateAlgorithmAnalysis(5, avgRating);
  if (mode === "algorithmAnalysis") return await generateAlgorithmAnalysis(5, avgRating);
  if (mode === "codeDuel") {
    const problem = await generateCodeDuel("medium");
    return [problem];
  }
  return [];
}

/**
 * 🏆 COMPUTE WINNER LOGIC
 * Handles both MCQ-style modes and codeDuel.
 */
function computeWinner(state) {
  const [p1, p2] = state.players;
  const s1 = state.score[p1] || {};
  const s2 = state.score[p2] || {};

  // If someone abandoned earlier, remaining wins
  if (state.abandoned?.leftUserId) {
    const left = state.abandoned.leftUserId;
    const remaining = state.players.find((p) => p !== left) || null;
    return remaining;
  }

  // MCQ scoring (correct / finish time)
  if (state.mode !== "codeDuel") {
    if (s1.correct > s2.correct) return p1;
    if (s2.correct > s1.correct) return p2;

    if (s1.finishedAt && s2.finishedAt) {
      if (s1.finishedAt < s2.finishedAt) return p1;
      if (s2.finishedAt < s1.finishedAt) return p2;
    }

    return null;
  }

  // --- CODE DUEL MODE --- (priority: most passed cases, then fastest submission)
  const p1Passed = s1.passedCases || 0;
  const p2Passed = s2.passedCases || 0;

  if (p1Passed > p2Passed) return p1;
  if (p2Passed > p1Passed) return p2;

  // If both submitted, earlier finishedAt wins
  if (s1.submitted && s2.submitted) {
    if (s1.finishedAt < s2.finishedAt) return p1;
    if (s2.finishedAt < s1.finishedAt) return p2;
  }

  return null;
}

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function eloDelta(ra, rb, resultA, K = 32) {
  const ea = expectedScore(ra, rb);
  return Math.round(K * (resultA - ea));
}

function pickOpponentFromQueue(queue, myRating) {
  const now = Date.now();
  const base = 100;
  const cap = 400;

  let bestIdx = -1;
  let bestDiff = Infinity;

  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (!p?.socket || p.socket.disconnected) continue;

    const waitedMs = now - p.joinedAt;
    const expand = Math.min(cap, base + Math.floor(waitedMs / 10000) * 50);

    const diff = Math.abs((p.rating ?? 1200) - (myRating ?? 1200));
    if (diff <= expand && diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  if (bestIdx === -1) return null;
  return queue.splice(bestIdx, 1)[0];
}

/**
 * Unified finalizeMatch:
 * - If state.mode === 'codeDuel' => use codeDuel finalization (your codeDuel logic preserved)
 * - Otherwise => use rating/ELO finalization (original MCQ ELO logic preserved)
 *
 * Accepts two invocation styles (keeps compatibility with both merged sources):
 * 1) finalizeMatch(io, roomId, reasonString)
 * 2) finalizeMatch(io, roomId, stateObj, winnerId, resultType)
 */
async function finalizeMatch(io, roomId, arg2, arg3, arg4) {
  // normalize inputs
  let state;
  let winnerId;
  let resultType;

  if (arg2 && typeof arg2 === "object") {
    // signature: (io, roomId, state, winnerId, resultType)
    state = arg2;
    winnerId = arg3;
    resultType = arg4 || "completed";
  } else {
    // signature: (io, roomId, reason)
    state = activeMatches.get(roomId);
    resultType = arg2 || "completed";
    if (!state) return;
    winnerId = computeWinner(state);
  }

  if (!state) return;
  if (state.finalizing) return;
  state.finalizing = true;

  // If codeDuel mode -> use the codeDuel-specific finalize flow
  if (state.mode === "codeDuel") {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime - state.startedAt) / 1000);
      const [p1, p2] = state.players;

      const matchResultData = {
        winnerId: winnerId || null,
        resultType: resultType || "ranking",
        scores: {
          [p1]: {
            passed: state.score[p1].passedCases || 0,
            total: state.totalTestCases || 0,
            timeTaken: state.score[p1].finishedAt
              ? Math.floor((state.score[p1].finishedAt - state.startedAt) / 1000)
              : "N/A",
          },
          [p2]: {
            passed: state.score[p2].passedCases || 0,
            total: state.totalTestCases || 0,
            timeTaken: state.score[p2].finishedAt
              ? Math.floor((state.score[p2].finishedAt - state.startedAt) / 1000)
              : "N/A",
          },
        },
      };

      // Update Match document
      if (state.matchId) {
        await Match.findByIdAndUpdate(state.matchId, {
          status: "completed",
          winner: winnerId || null,
          endTime,
          duration,
          resultType,
          metaData: matchResultData.scores,
        });
      }

      // Update User Stats (codeDuel uses +25 / -15 / +5 style you provided)
      for (const pId of state.players) {
        const isWinner = winnerId && pId === winnerId;
        const isDraw = !winnerId;
        const update = {
          $inc: { matchesPlayed: 1 },
          $push: { matchHistory: state.matchId },
        };

        if (isWinner) {
          update.$inc = update.$inc || {};
          update.$inc.matchesWon = 1;
          update.$inc.rating = 25;
        } else if (isDraw) {
          update.$inc = update.$inc || {};
          update.$inc.matchesDrawn = 1;
          update.$inc.rating = 5;
        } else {
          update.$inc = update.$inc || {};
          update.$inc.matchesLost = 1;
          update.$inc.rating = -15;
        }

        await User.findByIdAndUpdate(pId, update);
      }

      // Broadcast result (codeDuel uses a detailed scorecard)
      io.to(roomId).emit("match:result", matchResultData);
    } catch (err) {
      console.error("CRITICAL: Error finalizing codeDuel match:", err);
    } finally {
      activeMatches.delete(roomId);
    }

    return;
  }

  // Otherwise: MCQ/ELO finalization (original ELO flow)
  try {
    const [p1, p2] = state.players;

    // Emit result (MCQ consumer expects score objects)
    io.to(roomId).emit("match:result", {
      winnerId,
      scores: {
        [p1]: state.score[p1],
        [p2]: state.score[p2],
      },
      reason: resultType,
    });

    // Update match document
    try {
      const matchDoc = await Match.findById(state.matchId);
      if (matchDoc) {
        matchDoc.endTime = new Date();
        matchDoc.duration = Math.floor((Date.now() - state.startedAt) / 1000);

        if (resultType === "abandoned" || resultType === "disconnect") {
          matchDoc.status = "abandoned";
          matchDoc.resultType = "disconnect";
          matchDoc.winner = winnerId || undefined;
        } else {
          if (winnerId) {
            matchDoc.status = "completed";
            matchDoc.resultType = "firstCorrect";
            matchDoc.winner = winnerId;
          } else {
            matchDoc.status = "draw";
            matchDoc.resultType = "timeout";
            matchDoc.winner = undefined;
          }
        }

        await matchDoc.save();
      }
    } catch (e) {
      console.log("match save error:", e.message);
    }

    // Rating updates: compute deltas and persist
    try {
      const users = await User.find({ _id: { $in: [p1, p2] } }).select("rating");
      const uMap = new Map(users.map((u) => [u._id.toString(), u]));

      const r1 = uMap.get(p1)?.rating ?? 1200;
      const r2 = uMap.get(p2)?.rating ?? 1200;

      let result1 = 0.5,
        result2 = 0.5;
      if (winnerId === p1) {
        result1 = 1;
        result2 = 0;
      } else if (winnerId === p2) {
        result1 = 0;
        result2 = 1;
      }

      const d1 = eloDelta(r1, r2, result1, 32);
      const d2 = eloDelta(r2, r1, result2, 32);

      const updates = [];

      updates.push(
        User.updateOne(
          { _id: p1 },
          {
            $inc: { matchesPlayed: 1 },
            $push: { matchHistory: state.matchId },
            $set: { rating: Math.max(0, r1 + d1) },
          }
        )
      );

      updates.push(
        User.updateOne(
          { _id: p2 },
          {
            $inc: { matchesPlayed: 1 },
            $push: { matchHistory: state.matchId },
            $set: { rating: Math.max(0, r2 + d2) },
          }
        )
      );

      if (winnerId === p1) {
        updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesWon: 1 } }));
        updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesLost: 1 } }));
      } else if (winnerId === p2) {
        updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesWon: 1 } }));
        updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesLost: 1 } }));
      } else {
        updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesDrawn: 1 } }));
        updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesDrawn: 1 } }));
      }

      await Promise.all(updates);

      io.to(roomId).emit("match:ratingUpdate", {
        [p1]: r1 + d1,
        [p2]: r2 + d2,
        delta: { [p1]: d1, [p2]: d2 },
      });
    } catch (e) {
      console.log("rating update error:", e.message);
    }
  } catch (err) {
    console.error("finalizeMatch error:", err);
  } finally {
    activeMatches.delete(roomId);
  }
}

/* ================== MAIN SOCKET SETUP ================== */

module.exports = function setUpMatchMaking(io) {
  io.on("connection", (socket) => {
    const userId = getUserId(socket);
    console.log("New connection attempt. UserID found:", userId);
    if (!userId) {
      socket.emit("match:error", { message: "Login Required" });
      socket.disconnect();
      return;
    }

    // --- MATCH FINDING ---
    socket.on("match:find", async ({ mode }) => {
      console.log(`📡 [EVENT] match:find received for mode: ${mode} from User: ${userId}`);

      try {
        if (!queues[mode]) {
          console.error(`❌ Invalid mode requested: ${mode}`);
          return socket.emit("match:error", { message: "Invalid Mode" });
        }

        // Non-rating mode (codeDuel) uses a simpler pairing; preserve that behavior
        if (mode === "codeDuel") {
          // Remove old entries for this specific socket to avoid ghosting
          queues[mode] = queues[mode].filter((p) => p.socket && p.socket.id !== socket.id);

          // find first opponent that's not the same socket (avoid pairing a socket with itself)
          const opponentIndex = queues[mode].findIndex((p) => p.socket && p.socket.id !== socket.id);

          if (opponentIndex > -1) {
            const opponent = queues[mode].splice(opponentIndex, 1)[0];
            const roomId = createRoomId(mode);

            socket.join(roomId);
            opponent.socket.join(roomId);

            const questions = await getQuestions(mode);

            if (!Array.isArray(questions) || questions.length === 0) {
              socket.leave(roomId);
              opponent.socket.leave(roomId);
              socket.emit("match:error", { message: "Question generation failed" });
              opponent.socket.emit("match:error", { message: "Question generation failed" });
              return;
            }

            // Sanitize: do not send testCases to clients
            const sanitizedQuestions = questions.map((q) => {
              if (mode === "codeDuel") {
                const { testCases, ...publicData } = q;
                return publicData;
              }
              return q;
            });

            const matchDoc = await Match.create({
              mode,
              players: [opponent.userId, userId],
              startTime: new Date(),
              status: "ongoing",
            });

            const p1 = opponent.userId.toString();
            const p2 = userId.toString();

            activeMatches.set(roomId, {
              roomId,
              mode,
              matchId: matchDoc._id.toString(),
              players: [p1, p2],
              sockets: [opponent.socket.id, socket.id],
              questions,
              totalTestCases: questions[0]?.testCases ? questions[0].testCases.length : 0,
              startedAt: Date.now(),
              score: {
                [p1]: { correct: 0, answered: 0, passedCases: 0, finishedAt: null, submitted: false },
                [p2]: { correct: 0, answered: 0, passedCases: 0, finishedAt: null, submitted: false },
              },
              answeredMap: { [p1]: new Set(), [p2]: new Set() },
              abandoned: null,
              finalizing: false,
            });

            io.to(roomId).emit("match:found", {
              roomId,
              matchId: matchDoc._id.toString(),
              mode,
              questions: sanitizedQuestions,
              players: [p1, p2],
            });

            console.log(`✅ codeDuel match started in room: ${roomId}`);
            return;
          }

          // no opponent found -> enqueue (codeDuel entry does not keep rating/joinedAt)
          queues[mode].push({ userId, socket });
          socket.emit("match:queued", { mode });
          return;
        }

        // --- RATING-AWARE MODES (rapidDuel, bughunter, algorithmAnalysis, complexityDuel) ---
        const me = await User.findById(userId).select("rating");
        if (!me) {
          socket.emit("match:error", { message: "User not found" });
          return;
        }
        const myRating = me.rating ?? 1200;

        // Cleanup queue entries for this user across that particular mode
        queues[mode] = queues[mode].filter(
          (p) => p && p.userId !== userId && p.socket && !p.socket.disconnected
        );

        const opponent = pickOpponentFromQueue(queues[mode], myRating);

        if (opponent && opponent.userId === userId) {
          // avoid pairing with ourselves — requeue
          queues[mode].push({ userId, socket, rating: myRating, joinedAt: Date.now() });
          socket.emit("match:queued", { mode, myRating });
          return;
        }

        if (opponent) {
          const roomId = createRoomId(mode);
          socket.join(roomId);
          opponent.socket.join(roomId);

          const oppDoc = await User.findById(opponent.userId).select("rating");
          const oppRating = oppDoc?.rating ?? opponent.rating ?? 1200;

          const avgRating = difficultyRating(myRating, oppRating);
          const questions = await getQuestions(mode, avgRating);

          if (!Array.isArray(questions) || questions.length === 0) {
            socket.leave(roomId);
            opponent.socket.leave(roomId);
            socket.emit("match:error", { message: "Question generation failed" });
            opponent.socket.emit("match:error", { message: "Question generation failed" });
            return;
          }

          const sanitizedQuestions = questions.map((q) => q); // MCQ modes: full payload is fine

          const matchDoc = await Match.create({
            mode,
            players: [opponent.userId, userId],
            startTime: new Date(),
            status: "ongoing",
          });

          const p1 = opponent.userId.toString();
          const p2 = userId.toString();

          activeMatches.set(roomId, {
            roomId,
            mode,
            matchId: matchDoc._id.toString(),
            players: [p1, p2],
            sockets: [opponent.socket.id, socket.id],
            questions,
            startedAt: Date.now(),
            score: {
              [p1]: { correct: 0, answered: 0, finishedAt: null },
              [p2]: { correct: 0, answered: 0, finishedAt: null },
            },
            answeredMap: {
              [p1]: new Set(),
              [p2]: new Set(),
            },
            abandoned: null,
            finalizing: false,
          });

          io.to(roomId).emit("match:found", {
            roomId,
            matchId: matchDoc._id.toString(),
            mode,
            questions: sanitizedQuestions,
            players: [p1, p2],
            avgRating,
          });

          console.log(`✅ Match started in room: ${roomId} (mode: ${mode})`);
        } else {
          // No opponent found -> push to rating queue with rating/joinedAt
          queues[mode].push({
            userId,
            socket,
            rating: myRating,
            joinedAt: Date.now(),
          });

          socket.emit("match:queued", { mode, myRating });
        }
      } catch (e) {
        console.error("🚨 Matchmaking Error:", e);
        socket.emit("match:error", { message: e.message });
      }
    });

    // --- MCQ MODE: ANSWERING (works for rapidDuel/bughunter/algorithmAnalysis/complexityDuel) ---
    socket.on("match:answer", async ({ roomId, questionIndex, selectedIndex }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const uid = userId.toString();
      const q = state.questions[questionIndex];

      if (!q || state.answeredMap[uid]?.has(questionIndex)) return;
      state.answeredMap[uid].add(questionIndex);

      // Determine correctness (bughunter differs)
      let isCorrect = false;

      if (state.mode === "bughunter") {
        const correctBugCount =
          typeof q.bugCount === "number" ? q.bugCount : q.correctOptionIndex;
        isCorrect = Number(selectedIndex) === Number(correctBugCount);
      } else {
        isCorrect = Number(selectedIndex) === Number(q.correctOptionIndex);
      }

      // Update score
      state.score[uid].answered = (state.score[uid].answered || 0) + 1;
      if (isCorrect) state.score[uid].correct = (state.score[uid].correct || 0) + 1;

      socket.emit("match:answerResult", {
        questionIndex,
        isCorrect,
        correctAnswer:
          state.mode === "bughunter"
            ? (typeof q.bugCount === "number" ? q.bugCount : q.correctOptionIndex)
            : q.correctOptionIndex,
      });

      // Mark finishedIfAllAnswered
      if (
        state.score[uid].answered === state.questions.length &&
        !state.score[uid].finishedAt
      ) {
        state.score[uid].finishedAt = Date.now();

        io.to(roomId).emit("match:progress", {
          userId: uid,
          correct: state.score[uid].correct,
          answered: state.score[uid].answered,
        });
      }

      const [p1, p2] = state.players;

      // If someone abandoned earlier and the remaining has finished -> finalize
      if (state.abandoned?.leftUserId) {
        const remaining = state.players.find((p) => p !== state.abandoned.leftUserId);
        if (remaining && state.score[remaining].finishedAt) {
          // use unified finalize: pass reason "abandoned"
          await finalizeMatch(io, roomId, "abandoned");
        }
        return;
      }

      const done1 = state.score[p1].finishedAt;
      const done2 = state.score[p2].finishedAt;

      if (done1 && done2) {
        const winnerId = computeWinner(state);
        // use new unified finalize signature with state + winnerId + reason
        await finalizeMatch(io, roomId, state, winnerId, "firstCorrect");
      }
    });

    // --- CODE DUEL: REAL-TIME SYNC ---
    socket.on("code:sync", ({ roomId, code, language }) => {
      socket.to(roomId).emit("code:opponentUpdate", { code, language });
    });

    function wrapUserCode(language, code, input) {
      /**
       * Cleans the input to extract only the values,
       * handling both JSON objects and "label = value" strings.
       */
      const getCleanedParams = (rawInput) => {
        let params = [];

        try {
          // 1. If input is a JSON string like '{"text1": "abc", "text2": "def"}'
          if (typeof rawInput === "string" && rawInput.trim().startsWith("{")) {
            // Replace single quotes with double quotes for valid JSON parsing if necessary
            const validJson = rawInput.replace(/'/g, '"').replace(/,\s*}/, "}");
            const obj = JSON.parse(validJson);
            params = Object.values(obj);
          }
          // 2. If input is a string like 'text1 = "abc", text2 = "def"'
          else if (typeof rawInput === "string" && rawInput.includes("=")) {
            params = rawInput.split(",").map((part) => {
              const val = part.split("=")[1] ? part.split("=")[1].trim() : part.trim();
              return val;
            });
          }
          // 3. If it's already an array or a single value
          else {
            params = Array.isArray(rawInput) ? rawInput : [rawInput];
          }
        } catch (e) {
          // Fallback: If parsing fails, just use the raw input
          params = [rawInput];
        }
        return params;
      };

      const formatValue = (val, lang) => {
        if (typeof val === "string") {
          // Don't double-quote if it's already a quoted string from the cleaning step
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            return val;
          }
          return `"${val}"`;
        }
        if (typeof val === "boolean") {
          if (lang === "python") return val ? "True" : "False";
          return val.toString();
        }
        if (Array.isArray(val)) {
          const elements = val.map((v) => formatValue(v, lang)).join(", ");
          return lang === "cpp" || lang === "java" ? `{${elements}}` : `[${elements}]`;
        }
        return val;
      };

      const lang = language.toLowerCase();
      const cleanedParams = getCleanedParams(input);
      const formattedArgs = cleanedParams.map((p) => formatValue(p, lang)).join(", ");

      switch (lang) {
        case "javascript":
        case "nodejs":
          // Results in: solve("abcde", "ace")
          return `${code}\nconsole.log(solve(${formattedArgs}));`;

        case "python":
          return `${code}\nprint(solve(${formattedArgs}))`;

        case "cpp":
          return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;
${code}
int main() {
    auto result = solve(${formattedArgs.replace(/\[/g, "{").replace(/\]/g, "}")});
    cout << result << endl;
    return 0;
}`;

        case "java":
          return `
import java.util.*;
public class Main {
    ${code}
    public static void main(String[] args) {
        Main instance = new Main();
        System.out.println(instance.solve(${formattedArgs.replace(/\[/g, '{').replace(/\]/g, '}')}));
    }
}
`;
        default:
          return code;
      }
    }

    // --- CODE DUEL: RUN (EXAMPLES ONLY) ---
    socket.on("code:run", async ({ roomId, code, language }) => {
      if (processingUsers.has(userId)) return;

      const state = activeMatches.get(roomId);
      if (!state || state.mode !== "codeDuel") return;

      processingUsers.add(userId);
      const examples = state.questions[0]?.examples || [];
      const results = [];

      for (const ex of examples) {
        try {
          const wrappedCode = wrapUserCode(language, code, ex.input);
          const result = await executeCode(language, wrappedCode);

          const stdout = result.run.stdout.trim();
          const stderr = result.run.stderr.trim();

          if (stderr) {
            results.push({
              input: ex.input,
              expected: ex.output.toString().trim(),
              actual: "",
              error: stderr,
              status: "error",
            });
          } else {
            results.push({
              input: ex.input,
              expected: ex.output.toString().trim(),
              actual: stdout,
              error: "",
              status: stdout === ex.output.toString().trim() ? "passed" : "failed",
            });
          }
        } catch (err) {
          results.push({ status: "error", error: "Piston API Error" });
        }
      }

      processingUsers.delete(userId);
      socket.emit("code:runResult", { results });
    });

    // --- CODE DUEL: SUBMIT (RANKING SYSTEM) ---
    socket.on("code:submit", async ({ roomId, code, language }) => {
      const uid = userId.toString();

      const state = activeMatches.get(roomId);
      if (!state || state.mode !== "codeDuel") return;
      if (state.score[uid].submitted) return; // ignore double submissions

      if (processingUsers.has(userId)) return;
      processingUsers.add(userId);

      socket.emit("code:judging", { message: "Judging solution against all test cases..." });

      const testCases = state.questions[0]?.testCases || [];
      let passedCount = 0;
      let isCompilationError = false;

      for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        try {
          const wrappedCode = wrapUserCode(language, code, test.input);
          const result = await executeCode(language, wrappedCode);

          const userOutput = result.run.stdout.trim();
          const stderr = result.run.stderr.trim();

          if (i === 0 && stderr) {
            isCompilationError = true;
            break;
          }

          if (!stderr && userOutput === test.output.toString().trim()) {
            passedCount++;
          }
        } catch (err) {
          console.error("Executor Error:", err);
        }
      }

      state.score[uid].submitted = true;
      state.score[uid].passedCases = isCompilationError ? 0 : passedCount;
      state.score[uid].finishedAt = Date.now();

      processingUsers.delete(userId);

      socket.emit("code:submissionResult", {
        success: true,
        passed: passedCount,
        total: testCases.length,
        message: isCompilationError ? "Compilation Error (0 Passed)" : `Passed ${passedCount}/${testCases.length} cases`,
      });

      socket.to(roomId).emit("code:opponentSubmitted", {
        message: "Opponent has submitted their code!",
      });

      const [p1, p2] = state.players;
      if (state.score[p1].submitted && state.score[p2].submitted) {
        const winnerId = computeWinner(state);
        await finalizeMatch(io, roomId, state, winnerId, "ranking");
      }
    });

    // --- TIMEOUT HANDLER ---
    socket.on("match:timeout", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const winnerId = computeWinner(state);
      await finalizeMatch(io, roomId, state, winnerId, "timeout");
    });

    // --- CANCEL from queue ---
    socket.on("match:cancel", ({ mode }) => {
      if (!queues[mode]) return;
      queues[mode] = queues[mode].filter((p) => p.userId !== userId);
      socket.emit("match:cancelled", { mode });
    });

    // --- ABANDON / LEAVE (user voluntarily leaves an active match) ---
    socket.on("match:leave", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const uid = userId.toString();
      if (!state.players.includes(uid)) return;

      state.abandoned = { leftUserId: uid };

      socket.to(roomId).emit("match:opponentLeft", {
        message: "Opponent left the match. Finish remaining questions to win.",
        leftUserId: uid,
      });

      socket.leave(roomId);

      try {
        await Match.findByIdAndUpdate(state.matchId, {
          status: "abandoned",
          endTime: new Date(),
          resultType: "disconnect",
        });
      } catch (e) {
        console.log("leave update error:", e.message);
      }
    });

    // --- ABANDON (explicit abandon event) ---
    socket.on("match:abandon", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const abandonerId = userId.toString();
      const winnerId = state.players.find((id) => id !== abandonerId);

      await finalizeMatch(io, roomId, state, winnerId, "abandon");
    });

    // --- DISCONNECT ---
    socket.on("disconnect", async () => {
      // remove from all queues
      Object.keys(queues).forEach((m) => {
        queues[m] = queues[m].filter((p) => p.userId !== userId);
      });

      // If participating in any active match, finalize appropriately
      for (const [roomId, state] of activeMatches.entries()) {
        if (state.sockets && state.sockets.includes(socket.id)) {
          const uid = userId.toString();
          state.abandoned = { leftUserId: uid };

          socket.to(roomId).emit("match:opponentLeft", {
            message: "Opponent disconnected. Finish remaining questions to win.",
            leftUserId: uid,
          });

          try {
            // Pass state + opponent id so finalizeMatch can use codeDuel flow or ELO flow as needed
            const opponentId = state.players.find((p) => p !== uid);
            await finalizeMatch(io, roomId, state, opponentId, "disconnect");
          } catch (e) {
            console.log("Disconnect finalize error:", e.message);
          }
          break;
        }
      }
    });

    // --- DEBUGGING UTILS ---
    socket.on("debug:getProblem", async ({ difficulty }) => {
      try {
        console.log(`DEBUG: Generating ${difficulty} problem...`);
        const problem = await generateCodeDuel(difficulty || "medium");
        const debugRoom = "DEBUG_ROOM";
        socket.join(debugRoom);

        activeMatches.set(debugRoom, {
          roomId: debugRoom,
          mode: "codeDuel",
          players: [userId.toString()],
          questions: [problem],
          totalTestCases: problem.testCases ? problem.testCases.length : 0,
          score: { [userId.toString()]: { correct: 0, answered: 0, passedCases: 0, submitted: false } },
          sockets: [socket.id],
          finalizing: false,
        });

        socket.emit("debug:problemLoaded", { roomId: debugRoom, problem: problem });
      } catch (err) {
        socket.emit("match:error", { message: "Groq Error: " + err.message });
      }
    });
  });
};
