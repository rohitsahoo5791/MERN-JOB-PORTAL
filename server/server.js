const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORRECT MIDDLEWARE ORDER
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // set to true only if you're using cookies
}));
app.use(express.json());

// ✅ ROUTES
const jobRoutes = require('./routes/JobRoutes');
app.use('/api/jobs', jobRoutes); // use only this for job routes

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // use this for auth


// In your main backend server file (e.g., app.js)
const applicationRouter = require('./routes/applicationRoutes.js');

// ... other app.use() statements
app.use('/api/application', applicationRouter);



// backend/app.js (or server.js)

// ... other imports
const adminRouter = require('./routes/adminRoutes.js'); // Adjust path

// ... app.use for other routers

// Add this line
app.use('/api/admin', adminRouter);

// ✅ Static files (images, resumes, etc)
app.use('/uploads', express.static('uploads'));

// ✅ DB CONNECTION
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
