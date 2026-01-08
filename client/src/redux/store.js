import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import jobReducer from './slice/jobSlice';
import applicationReducer from './slice/applicationSlice';

// --- CHANGE THIS BLOCK ---
// From:
// export const store = configureStore({ ... });

// To:
const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
});

export default store; // Add this line to make it a default export
// ----------------------