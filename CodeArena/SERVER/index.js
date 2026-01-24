require("dotenv").config();
const express = require("express");
const User = require("./models/User");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const customError = require("./utils/customError");
const ValidateUser = require("./utils/userValidate");
const wrapAsync = require("./utils/wrapAsync");
const { bugHunterQuestions, rapidDuelQuestions, algorithmAnalysisQuestions , codeDuelQuestions } = require("./utils/game.controller");
const MongoStore = require('connect-mongo').default;
const http = require("http");
const { Server } = require("socket.io");

const setUpMatchMaking = require("./socket/matchMaking");

const app = express();
const PORT = 3000;

// ================== Middleware ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== MongoDB ==================
async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
  console.log("Connected to mongodb!");
  console.log("Using DB:", mongoose.connection.name);
}
main().catch((err) => console.log(err));

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

//=================== Connect Mongo and Session storage on cloud ===============

// Use `new MongoStore` instead of `.create`
const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});
     //error handling in mongosession store
store.on('error',()=>{
    console.log(`ERROR IN MONGO SESSION STORE`)
})

// ================== Sessions ==================
app.use(cookieParser(process.env.SECRET));
app.set("trust proxy", 1);

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

// ================== Passport ==================
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log("🔐 Serializing user:", user._id);
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
  console.log("🧩 Deserializing User ID:", userId);
  User.findById(userId)
    .then((user) => {
      console.log("✅ User found:", user);
      done(null, user);
    })
    .catch((err) => {
      console.error("❌ Deserialize error:", err);
      done(err);
    });
});

passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));



// ================== HTTP server + Socket.IO ==================================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ IMPORTANT: socket must also get cookie + session + passport
const passportSocketIo = (socket, next) => {
  sessionMiddleware(socket.request, {}, (err) => {
    if (err) return next(err);

    cookieParser(process.env.SECRET)(socket.request, {}, (err2) => {
      if (err2) return next(err2);

      passport.initialize()(socket.request, {}, (err3) => {
        if (err3) return next(err3);

        passport.session()(socket.request, {}, (err4) => {
          if (err4) return next(err4);
          next();
        });
      });
    });
  });
};

io.use(passportSocketIo);

// ✅ Setup matchmaking handlers
setUpMatchMaking(io);



// ================== Routes ==================
app.get("/session-check", (req, res) => {
  if (req.isAuthenticated()) {
    req.session.touch();
    return res.send({ status: "authenticated", user: req.user });
  }
  return res.status(401).send({ status: "unauthenticated" });
});

const userValidation = (req, res, next) => {
  const response = ValidateUser.validate(req.body);
  if (response.error) {
    throw new customError(400, response.error.details[0].message);
  }
  next();
};

app.post(
  "/signup",
  userValidation,
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        res.send({ status: "signedup", user: registeredUser });
      });
    } catch (err) {
      res.status(400).send(err.message || "Error during signup");
    }
  })
);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      res.json({ status: "authenticated", user });
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.send({ status: "logged out" });
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error during logout" });
  }
});

app.get("/isAuthenticated", (req, res) => {
  if (req.isAuthenticated()) return res.send({ user: req.user });
  return res.status(401).send({ status: "unauthenticated" });
});


app.put("/update-avatar", async (req, res) => {
  // 1. Check if user is logged in
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { avatarUrl } = req.body;
    
    // 2. Update the user in the database
    // { new: true } ensures we get the updated user object back
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: avatarUrl },
      { new: true }
    );

    // 3. Send back the success response expected by Profile.jsx
    res.json({ status: 'updated', user: updatedUser });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
});

/**
 * GET /getLeaderboard
 * Fetches users sorted by rating in descending order
 * Populates match history for detailed view
 */

app.get("/getLeaderboard", wrapAsync(async (req, res) => {
    try {
        // 1. Query the User model
        // 2. Sort by 'rating' field in descending order (-1)
        // 3. Populate 'matchHistory' to get the full match objects
        const leaderboard = await User.find({})
            .sort({ rating: -1 })
            .populate("matchHistory")
            .exec();

        // Check if leaderboard exists
        if (!leaderboard) {
            return res.status(404).json({
                success: false,
                message: "No users found to generate leaderboard."
            });
        }

        // Return the sorted array of objects
        res.status(200).json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });

    } catch (error) {
        // Handle database or population errors
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard data",
            error: error.message
        });
    }
}));

app.use("/bug-hunter", bugHunterQuestions);
app.use("/rapid-duel", rapidDuelQuestions);
app.use("/algorithm-analysis", algorithmAnalysisQuestions);
app.use('/code-duel',codeDuelQuestions)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "CodeArena server running" });
});


app.put("/update-avatar", async (req, res) => {
  // 1. Check if user is logged in
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { avatarUrl } = req.body;
    
    // 2. Update the user in the database
    // { new: true } ensures we get the updated user object back
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: avatarUrl },
      { new: true }
    );

    // 3. Send back the success response expected by Profile.jsx
    res.json({ status: 'updated', user: updatedUser });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
});

// ================== LEADERBOARD ROUTE ==================
app.get("/leaderboard", async (req, res) => {
  try {
    // 1. Fetch top 50 users sorted by Rating (descending)
    const users = await User.find({})
      .select("username rating matchesWon matchesPlayed avatarUrl") // Only select needed fields
      .sort({ rating: -1 }) // Sort by highest rating
      .limit(50);

    res.json(users);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// ================== Error middleware ==================
app.use((err, req, res, next) => {
  let { status = 400, message = "Something Went wrong" } = err;
  console.error(err.stack);
  res.status(status).send(message);
});

// ================== Listen ==================
server.listen(PORT, () => console.log("✅ Server running on port", PORT));
