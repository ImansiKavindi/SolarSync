// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// MongoDB connection and server start
const PORT = process.env.PORT || 8090;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for profile images, CVs, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));



// Routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clientRoutes = require('./routes/clients');
const employeedashboardRoutes = require('./routes/employeedashboard');

// Add employee routes

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/employeedashboard', employeedashboardRoutes);

console.log("🚀 authRoutes are successfully loaded!");

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connection Success"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 404 Route Handling
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on port: ${PORT}`);
});

//mongoose.connection.once('open', async () => {
  //console.log('✅ Connected to database name:', mongoose.connection.name);
  //const collections = await mongoose.connection.db.listCollections().toArray();
  //console.log('📦 Collections:', collections.map(c => c.name));
//});
