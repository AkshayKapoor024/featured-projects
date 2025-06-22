<!-- Optional: Project banner can go here -->
<h1 align="center"><strong>🌍 Voyagr</strong></h1>
<h3 align="center">A travel and booking platform inspired by Airbnb & Trivago</h3>

---

### 📌 Project Overview

**Voyagr** is a full-stack travel web application where users can **list their unique stays or locations across various categories**, while other users can **browse, book, and review** these destinations based on their travel needs.

The platform supports **multi-review functionality**, giving users the ability to share detailed feedback and experiences to help others make informed decisions. It's designed to be scalable, responsive, and robust with a strong focus on backend structure, cloud integrations, and user authentication.

This project served as my **kickstart into full-stack web development**, helping me explore and implement real-world tools and concepts — from authentication to cloud image handling to error management — and gave me a solid understanding of building production-grade applications.

---

### 🛠️ Tech Stack Used

#### 🌐 Frontend
<img src="https://img.icons8.com/color/48/html-5--v1.png" width="22"/> **HTML**  
<img src="https://img.icons8.com/color/48/css3.png" width="22"/> **CSS**  
<img src="https://img.icons8.com/color/48/javascript--v1.png" width="22"/> **JavaScript**  
<img src="https://img.icons8.com/color/48/bootstrap.png" width="22"/> **Bootstrap**

#### 🔧 Backend & Server
<img src="https://img.icons8.com/color/48/nodejs.png" width="22"/> **Node.js**  
<img src="https://img.icons8.com/ios-filled/50/000000/express-js.png" width="22"/> **Express.js**  
<img src="https://img.icons8.com/windows/32/npm.png" width="22"/> **npm**

#### 🧩 Templating
<img src="https://seeklogo.com/images/E/ejs-logo-7C6BBA7F00-seeklogo.com.png" width="22"/> **EJS**  
<img src="https://seeklogo.com/images/E/ejs-logo-7C6BBA7F00-seeklogo.com.png" width="22"/> **EJS-Mate**

#### 🗄️ Database & Storage
<img src="https://img.icons8.com/color/48/mongodb.png" width="22"/> **MongoDB (Atlas)**  
<img src="https://img.icons8.com/color/48/cloud.png" width="22"/> **Cloudinary (Image Hosting)**  
<img src="https://img.icons8.com/ios-filled/50/database.png" width="22"/> **Multer (Upload Middleware)**

---

### ✨ Features Implemented

- 📱 **Fully responsive website design** using Bootstrap 5  
- 🛠️ **Custom-level error handling** for all sync and async operations  
- ✅ **Client-side validation** via Bootstrap classes & form controls  
- 🧪 **Server-side validation** using **MongoDB schema rules** and **Joi middleware**  
- 🗂️ **MVC folder structure** for cleaner code separation and scalability  
- 🧱 **Layouts & includes** templating with EJS and EJS-Mate for reusability  
- 🌐 **Public folder setup** for serving static CSS & JS files  
- 🔁 **Middleware chains** for route protection, validation, flash messaging, and more  
- 🗺️ **Mapbox integration** for real-time map rendering with **Mapbox SDK**  
- 🍪 **Session management** via `cookie-parser` and `express-session`  
- ☁️ **MongoDB session store** implemented using **Mongo Atlas cloud**  
- 📤 **Cloud-based image handling** with **Multer** + **Cloudinary API**  
- ⚡ **Flash messaging** via `connect-flash` for instant user feedback  
- 🔐 **Authentication** with `passport.js` and local strategy  
- 🛡️ **Authorization checks** to restrict updates/deletion only to resource owners

---

### 📁 Repository Structure

├── uploads/ → Stores user-uploaded images (fallback if Cloudinary isn't used)
├── public/ → Contains static files like CSS and client-side JavaScript
├── views/ → EJS templates and layout files (MVC view layer)
├── controllers/ → Logic handlers for routes (listings, users, reviews)
├── routes/ → Express routers for different modules (listings, users, reviews)
├── util/ → Utility/helper functions used across the codebase
├── init/ → Scripts for seeding dummy data into the database
├── cloudconfig.js → Config file for Cloudinary and Multer-Cloudinary setup
├── schema.js → Joi validation schemas for listings and user inputs
└── index.js → Main server file: connects routes, applies middleware, handles errors

---
### 🚀 Project Status

- ✅ **Completed**
- 🗓️ **Time Taken**: ~15 Days
- 🔧 **Project Type**: Solo Project

This project helped me gain hands-on experience with a wide range of backend tools, cloud services, and architecture patterns. It built my foundation in full-stack development, and I’m genuinely excited to take it further by building more advanced and user-centric apps.

---

### 🧑‍💻 Author

**Akshay Kapoor**  
_B.Tech CSE | Full Stack Developer | DSA Enthusiast_  
[GitHub](https://github.com/AkshayKapoor024) • [LinkedIn](https://www.linkedin.com/in/kapoorakshay24) • [Email](mailto:work.akshaykapoor24@gmail.com)

---

<p align="center"><i>“Grateful for what I’ve learnt — driven by what’s yet to discover.”</i></p>
<p align="center"><b>– Akshay Kapoor</b></p>
