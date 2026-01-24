# ⚔️ CodeArena – The Ultimate Algorithmic Battleground
### *Code. Compete. Conquer. In Real-Time.*

**Built by:** Akshay Kapoor  
📧 `work.akshaykapoor24@gmail.com`  
📞 `+91-9818624070`  
🔗 [LinkedIn](https://linkedin.com/in/kapoorakshay24) | [GitHub](https://github.com/AkshayKapoor024) | [Live Demo](https://codearena-murex.vercel.app/)

---

## 🛰️ The Mission
In the landscape of competitive programming, most platforms are static. **CodeArena** was built to inject adrenaline into coding by providing a **head-to-head duel environment** where speed, accuracy, and big-O efficiency are the only metrics that matter. 

CodeArena solves:
- The lack of real-time 1v1 competitive coding environments.
- High barrier to entry for understanding time/space complexity.
- Need for instant, AI-driven feedback on algorithmic logic.

---

## 🚀 The Core Experience
**CodeArena** is a high-performance MERN-based ecosystem designed for developers who thrive under pressure. It transitions users from a global lobby into intense private "Duel Rooms" featuring live code editors and instant test-case validation.

> ⚡ **The Flow:** Find Match ➝ Enter Duel Room ➝ Solve Algorithmic Puzzle ➝ Real-time Evaluation ➝ Global Leaderboard Update.

---

## 💎 Elite Features

### 🎮 Head-to-Head Complexity Duels
- **Live Matchmaking:** WebSocket-powered queue system that pairs users instantly.
- **Synchronized State:** Real-time "Opponent Progress" bars and submission status.
- **Dynamic Timers:** Auto-forfeit and match termination logic to ensure fair play.

### 🧠 AI-Powered Insights (Groq AI)
- **NLP Intent Search:** Search for problems using natural language (e.g., "Give me a medium graph problem").
- **Logic Analysis:** Post-match AI feedback explaining the Big-O complexity of your specific solution.

### 💻 Pro-Grade Code Editor
- **Monaco Integration:** The same engine powering VS Code, optimized for React.
- **Multi-Language Support:** Seamlessly switch between C++, Java, and Python.
- **Instant Validation:** Run code against hidden test cases with real-time feedback on "Passed vs Failed."

### 📊 Global Leaderboard & Elo Rating
- **Dynamic Ranking:** Users gain/lose rating points based on match outcomes.
- **Match History:** Deep-dive into past duels with stored code snippets and performance metrics.
- **Profile Analytics:** Visual representation of user strengths across different data structures.

### 🛡️ Secure Infrastructure
- **Passport.js Auth:** Multi-strategy authentication (Local + Google OAuth).
- **Session Persistence:** Secure session handling via `connect-mongo` and encrypted cookies.
- **Validation:** Strict schema enforcement using `Joi` and `Mongoose`.

---

## 🛠️ The Tech Stack

### 🖥️ Frontend (The User Interface)
- **React.js & Framer Motion:** For buttery-smooth transitions and animations.
- **Tailwind CSS & DaisyUI:** Cyberpunk-themed, responsive design.
- **Socket.io-client:** Real-time event handling.
- **Monaco Editor:** Industry-standard code editing experience.

### ⚙️ Backend (The Engine)
- **Node.js & Express:** High-performance RESTful API and WebSocket server.
- **Socket.io:** Bi-directional communication for the matchmaking engine.
- **MongoDB Atlas:** Scalable NoSQL database for users and match logs.
- **Google Gemini API:** Powering the AI search and logic processing.

### 📦 Tools & Services
- **Cloudinary:** Media and asset management.
- **Passport.js:** Robust authentication middleware.
- **Render/Vercel:** Optimized deployment pipelines.

---

## 📈 Matchmaking Architecture

| 🛠️ Component | ⚡ Function |
| :--- | :--- |
| **Lobby Manager** | Handles user entry and socket registration. |
| **Matchmaker** | Uses a FIFO queue to pair available players into Room IDs. |
| **Duel Controller** | Manages the 10-minute match lifecycle and test-case injection. |
| **Result Evaluator** | Calculates rating changes and updates the MongoDB Cluster. |

---

## 🎯 Strategic Vision

CodeArena isn't just a project; it's a demonstration of **System Design** and **Real-Time Communication**. It bridges the gap between learning a language and mastering competitive logic through gamification.

---

## 🧪 Development & Setup

1. **Clone & Install**
   ```bash
   git clone [https://github.com/AkshayKapoor024/CodeArena.git](https://github.com/AkshayKapoor024/CodeArena.git)
   npm install
