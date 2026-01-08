import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Main Components ---
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';

// --- Jobseeker Components ---
import JobSeekerDashboard from './components/jobseeker/JobSeekerDashboard';
import ApplyJob from './pages/ApplyJob';
import Application from './pages/Application';
import JobDetailsPage from './components/jobDetailsPage';

// --- Recruiter Components ---
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';
import RecruiterCreateJob from './components/Recruiter/RecJobCre';
import RecruiterEditProfile from './components/Recruiter/RecruiterEditProfile';
import EditJob from './components/Recruiter/EditJob';
import UpdateProfilePic from './components/Recruiter/UpdateProfilePic';

// --- NEW: Admin Components ---
import AdminRoute from './components/admin/adminRouet'; // The security guard component
import AdminLoginPage from './components/admin/adminLogin';
import AdminDashboardPage from './components/admin/adminDash';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
  
        {/* ======================================= */}
        {/* ====== Public Routes              ====== */}
        {/* ======================================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/job/:jobId" element={<JobDetailsPage />} />
        
       
        {/* ======================================= */}
        {/* ====== Job Seeker Routes          ====== */}
        {/* ======================================= */}
        <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/application" element={<Application />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />

       
        {/* ======================================= */}
        {/* ====== Recruiter Routes           ====== */}
        {/* ======================================= */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/create-job" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/edit-job/:jobId" element={<EditJob />} />
        <Route path="/profile/edit" element={<RecruiterEditProfile />} />
        <Route path="/profile/pic" element={<UpdateProfilePic />} />


        {/* ======================================= */}
        {/* ====== NEW: Admin Routes          ====== */}
        {/* ======================================= */}

        {/* 1. This is the public-facing login page for the admin. */}
        {/* Anyone can visit this page. */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 2. These routes are protected by the AdminRoute component. */}
        {/* If a user is not a logged-in admin, they will be redirected to /admin/login */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          {/* Add any other future admin pages here, e.g.: */}
          {/* <Route path="/admin/settings" element={<AdminSettingsPage />} /> */}
        </Route>

      </Routes>
    </>
  );
}

export default App;