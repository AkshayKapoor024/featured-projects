# 🎉 MeetEase – Your Smart Event Scheduling & RSVP Platform  
### *Plan. Invite. Connect. Seamlessly.*  

**Built by:** Akshay Kapoor  
📧 `your.email@example.com`  
📞 `+91-XXXXXXXXXX`  
🔗 [LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/yourusername)

---

## 🧩 Problem Statement  
In a digital world where remote collaboration and physical events are booming, there's a **need for a centralized, intelligent platform** to:
- Effortlessly create and manage events
- RSVP and collaborate in groups
- Track participation and feedback
- Provide modern utilities like QR check-ins, AI-based discovery, and friend-linked group management

---

## 💡 Idea & Project Summary  
**MeetEase** is a **full-stack MERN-based intelligent event platform** that combines clean UI, feature-rich UX, and AI-powered tools for a top-tier event management experience.

> ✅ Whether it’s a small meetup or a large conference, MeetEase handles the entire flow: Event creation ➝ Invitations ➝ RSVPs ➝ Group participation ➝ Feedback ➝ Smart filters ➝ QR check-ins

---

## 🌟 Features (with UI Visuals & Explanation)

### 🗓️ Event Creation & Listing  
Users can create public/private events with:
- Title, description, category
- Date & Time (with countdown)
- Location, host name, and banner image

`![Event Creation UI](# "Path: ./screenshots/event-creation.png")`

---

### 📥 RSVP System  
- Users can RSVP to events with `Going / Interested / Not Going`
- Only authenticated users can RSVP
- Auto-filled form with status update & cancellation support
- Organizer can view attendees in real-time

`![RSVP Form](# "Path: ./screenshots/rsvp-form.png")`

---

### 🔍 AI-Powered Search & Filter  
- Natural language search: “show me hackathons this weekend”
- Filters by category, location, status
- Built using OpenAI/Gemini API (can toggle off for fallback)

`![AI Search](# "Path: ./screenshots/ai-search.png")`

---

### 🧑‍🤝‍🧑 Group RSVP Mode  
- User can create & share RSVP group links with friends
- Requires user-to-user friend system
- Group RSVP status visible to all members
- Admin-only control over group size and restrictions

`![Group RSVP](# "Path: ./screenshots/group-rsvp.png")`

---

### 📲 Contactless QR Ticket Generation  
- RSVP’d users get downloadable ticket with unique QR
- Organizer can scan at check-in to mark attendance
- Security hash prevents reuse or tampering

`![QR Ticket](# "Path: ./screenshots/qr-ticket.png")`

---

### ⭐ Feedback & Ratings  
- After event ends, attendees can:
  - Leave feedback text
  - Submit star rating (1–5)
- Feedback is visible on event page (public/private based on host choice)

`![Feedback UI](# "Path: ./screenshots/feedback.png")`

---

## 🛠️ Tech Stack

### 🧾 Frontend (React + Tailwind + DaisyUI)
- `react-router-dom`
- `axios`
- `framer-motion`
- `react-toastify`
- `@headlessui/react`
- `react-icons`
- `date-fns`

### ⚙️ Backend (Node + Express + MongoDB Atlas)
- `mongoose`
- `jsonwebtoken`, `bcryptjs` – Auth
- `passport`, `passport-google-oauth20`
- `joi` – Validations
- `multer` – File handling
- `cloudinary` – Media storage
- `nodemailer` – Email notifications

### 📦 Tools & External Services
- **Render.com** – Deployment
- **Cloudinary** – Image & ticket storage
- **OpenAI/Gemini** – AI-based search/filter
- **QRCode** – QR code generation
- **Google OAuth** – Social auth
- **GitHub Actions** (optional) – CI/CD

---

## 🧾 Feature Summary Table

| 🔢 # | 🌟 Feature                           | ✅ Status | 📷 Screenshot Tag                     |
|-----|-------------------------------------|----------|--------------------------------------|
| 1   | Event Creation + Edit/Delete        | ✅        | `event-creation.png`                 |
| 2   | RSVP System (auth-based)            | ✅        | `rsvp-form.png`                      |
| 3   | View & Manage Attendees             | ✅        | `attendees.png`                      |
| 4   | AI-Powered Search & Filters         | ✅        | `ai-search.png`                      |
| 5   | QR Code Ticket Generator            | ✅        | `qr-ticket.png`                      |
| 6   | Feedback & Rating System            | ✅        | `feedback.png`                       |
| 7   | Group RSVP with Link Sharing        | ✅        | `group-rsvp.png`                     |
| 8   | Authentication (Local + Google)     | ✅        | `auth.png`                           |
| 9   | Admin View for Events & RSVP Stats  | ✅        | `admin-stats.png`                    |

---

## 🎯 Final Thoughts  

MeetEase was designed not just to solve a functional problem—but to **showcase full-stack ability, system thinking, and feature innovation**.  

From **AI tools** to **real-time RSVP tracking**, from **responsive design** to **cloud integration**, this project aims to deliver a **production-grade application** that will **impress recruiters and stakeholders alike**.

---

## 🧠 Made with Code, Coffee, and Creativity  
`— Akshay Kapoor`

> Want to check out the demo or contribute? Ping me via LinkedIn or GitHub!
