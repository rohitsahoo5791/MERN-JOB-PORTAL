// src/services/api.js

import axios from 'axios';

// Axios instance with base config
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ your Express backend URL
//   withCredentials: true, // if you later use cookies
});

// Optional: attach JWT if stored in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ LOGIN FUNCTION
export const loginUser = async (email, password, role) => {
  try {
    const { data } = await API.post('/auth/login', { email, password, role });
    return data;
  } catch (err) {
    console.error("Axios Login Error:", err.message);
    throw err;
  }
};


// Add this to your api.js file
export const fetchAllJobs = async () => {
  try {
    const { data } = await API.get('/jobs/all'); // or '/jobs' based on your backend setup
    return data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
};


export const getMyJobs = async () => {
  const res = await axios.get('/api/jobs/my', {
    headers: { Authorization: localStorage.getItem('token') }
  });
  return res.data;
};

export const deleteJob = async (id) => {
  await axios.delete(`/api/jobs/${id}`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
};

export const createJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post('http://localhost:5000/api/jobs/jobs', jobData, {
    headers: { Authorization: `Bearer ${token}` } // ✅ fix
  });
  return res.data;
};
// services/api.js
export const updateUserInfo = async (data) => {
  const token = localStorage.getItem('token');

  const res = await axios.put('http://localhost:5000/api/auth/update-info', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};




// (You can add more like registerUser, getJobs, etc.)
