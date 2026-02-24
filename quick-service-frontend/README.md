🚀 Service Booking System (MEAN Stack)

A full-stack Service Booking System built using MEAN Stack where users can book services and admins can manage services and bookings.

🛠️ Tech Stack

Frontend

Angular (Standalone Components)

TypeScript

HTML, CSS

Backend

Node.js

Express.js

MongoDB

JWT Authentication

✨ Features
👤 User

Register & Login

View available services

Book services with date

View My Bookings (user-wise booking history)

Logout

🛠️ Admin

Role-based login (Admin / User)

Admin Dashboard

Add new services

View all bookings

Delete bookings

🔐 Security

JWT based authentication

Role-based routing (Admin/User separation)

Token stored securely in localStorage

📂 Project Structure
quickservice/
│
├── quick-service-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── quick-service-frontend/
│   ├── src/app/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── user/
│   │   └── services/
│   └── main.ts
│
└── README.md
⚙️ Installation & Run
🔹 Backend Setup
cd quick-service-backend
npm install
node server.js

Create .env file:

MONGO_URI=mongodb://127.0.0.1:27017/quickservice
JWT_SECRET=your_secret_key
🔹 Frontend Setup
cd quick-service-frontend
npm install
ng serve
🌐 URLs
Feature	URL
Login	http://localhost:4200/login

User Dashboard	http://localhost:4200/dashboard

Services	http://localhost:4200/services

My Bookings	http://localhost:4200/my-bookings

Admin Dashboard	http://localhost:4200/admin-dashboard

Admin Bookings	http://localhost:4200/admin-bookings
🧪 Sample Admin Credentials
Email: admin@gmail.com
Role: admin

(Role can be updated manually in MongoDB)

📌 Future Enhancements

Payment Gateway Integration

Booking Cancellation by User

Admin Service Edit/Delete

Route Guards for Security