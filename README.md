# ⏳ Time Capsule

![Status](https://img.shields.io/badge/Status-Active-success)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-green)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)

---

## 📖 About The Project

**Time Capsule** is a full-stack MERN web application that allows users to preserve memories, thoughts, and predictions for the future. Users can create secure **time-locked capsules** containing text and images, which remain encrypted and inaccessible until a specific future date.

The platform integrates **Google Gemini AI** for intelligent content insights, **Cloudinary** for optimized media storage, and **Nodemailer** for automated email notifications. Secure authentication is handled via **Google OAuth 2.0**.

---

## ✨ Key Features

* 🔒 **Time-Lock Mechanism**
  Capsules remain locked until the user-defined date and time.

* 📧 **Smart Notifications**
  Automated emails sent when a capsule is created and when it unlocks.

* 🤖 **AI Integration (Google Gemini)**
  Sentiment analysis and AI-generated summaries for unlocked capsules.

* 🖼️ **Media Storage with Cloudinary**
  Secure image uploads with automatic optimization and CDN delivery.

* ⏱️ **Automated Unlocking**
  Backend cron jobs automatically update capsule status from *Locked* to *Open*.

* 🔐 **Google Authentication**
  Secure login using Google OAuth 2.0.

* 🚀 **Dual Deployment**

  * Frontend deployed on **Vercel**
  * Backend deployed on **Render**

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** React
* **Styling:** Tailwind CSS
* **Deployment:** Vercel

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT + Google OAuth 2.0
* **Email Service:** Nodemailer (SMTP)
* **Task Scheduling:** Node-Cron
* **Deployment:** Render

### Cloud Services & APIs

* **AI:** Google Gemini API
* **Media Storage:** Cloudinary
* **Authentication:** Google OAuth 2.0

---

## ⚙️ Environment Variables

> ⚠️ Make sure to create `.env` files separately for **backend** and **frontend**.

### 1️⃣ Backend `.env`

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/timecapsule

# Security & Auth
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id

# Google Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# CORS Configuration
FRONTEND_URL=https://your-frontend-project.vercel.app
```

---

### 2️⃣ Frontend `.env`

Create a `.env` file in the frontend root directory:

```env
# API Connection
VITE_API_URL=https://your-backend-api.onrender.com

# Google Auth (Public ID for Frontend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📥 Cloning the Repository

Clone the repository and install dependencies:

```bash
git clone https://github.com/anik0110/Animesh-TimeCapsule.git
cd Animesh-TimeCapsule
npm install
npm run dev
```

---

## 🚀 Deployment

* **Frontend:** Deployed on **Vercel**
* **Backend:** Deployed on **Render**
* **Database:** MongoDB Atlas
* **Media Storage:** Cloudinary

---

## 📌 Future Enhancements

* Capsule sharing with trusted contacts
* End-to-end encryption for capsule content
* Multiple AI insight modes
* Push notifications

---

## 👨‍💻 Author

**Animesh Karn**

---

## 📄 License

This project is licensed under the **MIT License**.
