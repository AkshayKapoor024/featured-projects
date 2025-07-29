# 🎉 Schedulo – Your Smart Event Scheduling & RSVP Platform  
### *Plan. Invite. Connect. Seamlessly.*  

**Built by:** Akshay Kapoor  
📧 `work.akshaykapoor24@gmail.com`  
📞 `+91-9818624070`  
🔗 [LinkedIn](https://linkedin.com/in/kapoorakshay24) | [GitHub](https://github.com/AkshayKapoor024) | [Go-Schedulo](https://go-schedulo.vercel.app)

---

## 🧩 Problem Statement  
In a digital world where remote collaboration and physical events are booming, there's a **need for a centralized, intelligent platform** to:
- Effortlessly create and manage events
- RSVP and collaborate in groups
- Track participation and feedback
- Admin Dashboard for Attendee and rsvp details
- AI Based QR Ticket generation
- Email Notification system for activity tracking and ticket download feature
- Google calendar integration for event reminder
- Provide modern utilities like QR check-ins, AI-based discovery, and friend-linked group management

---

## 💡 Idea & Project Summary  
**Schedulo** is a **full-stack MERN-based intelligent event platform** that combines clean UI, feature-rich UX, and AI-powered tools for a top-tier event management experience.

> ✅ Whether it’s a small meetup or a large conference, MeetEase handles the entire flow: Event creation ➝ Invitations ➝ RSVPs ➝ Group participation ➝ Feedback ➝ Smart filters ➝ QR check-ins

---

## 🌟 Features (with UI Visuals & Explanation)

### 🗓️ Event Creation & Listing  
Users can create public/private events with:
- Title, description, category
- Date & Time (with countdown)
- Location, host name, cohosts (optional) and banner image

---

### 📥 RSVP System  
- Users can RSVP to events with `Going / Interested / Not Going`
- Only authenticated users can RSVP
- Auto-filled form with status update & cancellation support
- Organizer can view attendees in real-time


---

### 🔍 AI-Powered Search & Filter  
- Used Google Gemini generative AI API for NLP and intents classification
- Natural language search: “show me hackathons this weekend”
- Filters by category, location, status , title and time
- Built using Gemini API (can toggle off for fallback)

---

### 🧑‍🤝‍🧑Google Calendar API Integration
- User can add the event to their google calendar for reminders
- Feature asks user consent everytime for integration
- In App notifications for success or failure 

---

### 📲 Contactless QR Ticket Generation  
- RSVP’d users get downloadable ticket with unique QR
- Organizer can scan at check-in to mark attendance
- Security hash prevents reuse or tampering

---

### ⭐ Feedback & Ratings  
- After event ends, attendees can:
  - Leave feedback text
  - Submit star rating (1–5)
- Feedback is visible on event page (public/private based on host choice)
- Your feedbacks section allows users can see past feedbacks and can directly navigate to them

---

## 🛠️ Tech Stack

### 🧾 Frontend (React + Tailwind + DaisyUI)
- `React.js`
- `react-router-dom`
- `axios`
- `framer-motion`
- `react-toastify`
- `@headlessui/react`
- `react-icons`
- `date-fns`
- `Daisy-UI`
- `puppetter` - for downloading images and pdf
-  `qrcode`- for ticket generation
- `multer` - for uploading files
### ⚙️ Backend (Node + Express + MongoDB Atlas)
- `express.js`
- `mongoDB`
- `mongoose`
- `passport.js` – Auth
- `passport`, `passport-google-oauth20`
- `cookie-parser $ express-sessions` - for user sessions
- `connect-mongo` - for session storage
- `joi` – Validations
- `multer` – File handling
- `cloudinary` – Media storage
- `nodemailer` – Email notifications
- `Agenda` - for scheduling emails
- `Gemini generative AI Api` - for NLP and intent processing
- `Google calendar` - for Calendar based reminder system    
### 📦 Tools & External Services
- **Render.com** – Deployment
- **Cloudinary** – Image & ticket storage
- **OpenAI/Gemini** – AI-based search/filter
- **QRCode** – QR code generation
- **Google OAuth** – Social auth
- **GitHub Actions** (optional) – CI/CD

---

## 🧾 Feature Summary Table

| 🔢 # | 🌟 Feature                        | ✅ Status |
|-----|-------------------------------------|------------|
| 1   | Event CRUD Operations easily        | ✅        | 
| 2   | RSVP System (auth-based)            | ✅        |
| 3   | View & Manage Attendees             | ✅        |
| 4   | AI-Powered Search & Filters         | ✅        |
| 5   | QR Code Ticket Generator            | ✅        |
| 6   | Feedback & Rating System            | ✅        |
| 7   | Google Calendar reminder system     | ✅        |
| 8   | Authentication (Local + Google)     | ✅        |
| 9   | Admin View for Events & RSVP Stats  | ✅        |
| 10  | User Dashboard for own details      | ✅        |
---

## 🎯 Final Thoughts  

Schedulo was designed not just to solve a functional problem—but to **showcase full-stack ability, system thinking, and feature innovation**.  

From **AI tools** to **real-time RSVP tracking**, from **responsive design** to **cloud integration**, this project aims to deliver a **production-grade application** that will **impress recruiters and stakeholders alike**.

---

## 🧠 Made with Code, Coffee, and Creativity  
`— Akshay Kapoor`

> Want to check out the demo or contribute? Ping me via LinkedIn or GitHub!
See demo @ (https://go-schedulo.vercel.app)
