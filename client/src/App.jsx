import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar';


import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import ApplyJob from './pages/ApplyJob';
import Application from './pages/Application';
import JobSeekerDashboard from './components/jobseeker/JobSeekerDashboard';


import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';
import RecruiterCreateJob from './components/Recruiter/RecJobCre';
import RecruiterEditProfile from './components/Recruiter/RecruiterEditProfile';
import EditJob from './components/Recruiter/EditJob';
import UpdateProfilePic from './components/Recruiter/UpdateProfilePic';

function App() {
  return (
    
    <>
    
      <Navbar />

     
      <Routes>
  
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
       
        <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/application" element={<Application />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />

       
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/create-job" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/edit-job/:jobId" element={<EditJob />} />
        <Route path="/profile/edit" element={<RecruiterEditProfile />} />
        <Route path="/profile/pic" element={<UpdateProfilePic />} />
      </Routes>
    </>
  );
}

export default App;