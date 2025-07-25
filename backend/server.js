const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Route imports
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const qrRoutes = require("./routes/qrRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const materialRoutes = require("./routes/materialRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Route usage
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/attendance", attendanceRoutes); // ✅ Integrated attendance
app.use("/api/materials", materialRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("🎉 Seminar Management API is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});