# 🛠️ Project Setup Guide

This guide will help you install the necessary tools, set up the project, and understand the key dependencies.

---

## ✅ 1. Core Requirements

| Tool       | Purpose                                        | Installation Link / Command                                      |
|------------|------------------------------------------------|------------------------------------------------------------------|
| Node.js    | Runtime for Express server                     | [Download Node.js](https://nodejs.org)                           |
| npm        | Package manager (comes with Node.js)           | Already included                                                 |
| MongoDB    | NoSQL database                                 | [Download MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| Postman    | API testing GUI                                | [Download Postman](https://www.postman.com/downloads)            |

---

## ✅ 2. Project Setup & Run Commands

```bash
# Step into your project directory
cd your-project-directory

# Install all dependencies
npm install

# Start the server
node server.js
```

For Auto-Reload During Development:

# Install nodemon globally
npm install -g nodemon

# Run with nodemon
nodemon server.js

## ✅ 3 & 4. Dependencies & Postman Testing

### 📦 Dependencies (Install via npm)

| Package        | Install Command              | Purpose                                  |
|----------------|------------------------------|------------------------------------------|
| express        | `npm install express`        | Backend routing                          |
| mongoose       | `npm install mongoose`       | MongoDB ODM                              |
| multer         | `npm install multer`         | File uploads (e.g., payment proof)       |
| pdfkit         | `npm install pdfkit`         | PDF certificate generation               |
| qrcode         | `npm install qrcode`         | QR code generation for attendance        |
| morgan         | `npm install morgan`         | Request logging                          |
| cors           | `npm install cors`           | Enable frontend-backend communication    |
| dotenv         | `npm install dotenv`         | Environment variable management          |
| jsonwebtoken   | `npm install jsonwebtoken`   | JWT authentication (if used)             |
| stripe         | `npm install stripe`         | Stripe payment API (online payment sim.) |

---

### 🔬 Testing with Postman

- **Method**: Use `GET`, `POST`, etc. depending on the API route.
- **Auth**: Bearer Token (when required)
- **Headers**:
  - `Content-Type: application/json` (or `multipart/form-data` for file uploads)
- **Body**:
  - Use **raw JSON** for normal API calls.
  - Use **form-data** for endpoints requiring file uploads.

Example JSON body for a POST request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "event": "Hackathon 2025"
}
```


Let me know if you'd like to add sample API endpoints too!
