import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

//================================================================
// ASYNC THUNKS (The logic for communicating with the API)
//================================================================

/**
 * THUNK 1: Fetches the details of a single job to display on the page.
 */
export const fetchJobDetailsForApplication = createAsyncThunk(
  'applications/fetchJobDetails',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; 
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.get(
        `http://localhost:5000/api/application/job-details/${jobId}`, 
        config
      );
      
      return data.job; // On success, return the job object

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch job details.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * THUNK 2: Submits an application for a job.
 */
export const applyForJob = createAsyncThunk(
  'applications/applyForJob',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; 
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.post(
        `http://localhost:5000/api/application/apply/${jobId}`,
        {}, // Body is empty
        config
      );

      toast.success(data.message || 'Applied successfully!');
      return data; // On success, return the success response

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply for the job.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; 
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.get(
        `http://localhost:5000/api/application/my-applications`, 
        config
      );
      
      return data.applications;

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch your applications.';
      return rejectWithValue(errorMessage);
    }
  }
);



//================================================================
// SLICE (The state manager)
//================================================================

/**
 * The initial state needs to track the status for BOTH fetching and applying,
 * so they don't interfere with each other.
 */
const initialState = {
  // State for fetching the job's details
  jobDetails: null,
  jobDetailsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  jobDetailsError: null,

  // State for the "apply" action
  applicationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  applicationError: null,

   myApplications: [],
  myApplicationsStatus: 'idle',
  myApplicationsError: null,
};


const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  
  // Regular reducers for synchronous actions
  reducers: {
    /**
     * Resets all state in this slice back to its initial value.
     * Useful for cleaning up when the user navigates away from the page.
     */
    resetApplicationState: (state) => {
      state.jobDetails = null;
      state.jobDetailsStatus = 'idle';
      state.jobDetailsError = null;
      state.applicationStatus = 'idle';
      state.applicationError = null;

      state.myApplications = [];
      state.myApplicationsStatus = 'idle';
      state.myApplicationsError = null;
    }
  },

  // Reducers for async actions (our thunks)
  extraReducers: (builder) => {
    builder
      // Cases for fetching job details
      .addCase(fetchJobDetailsForApplication.pending, (state) => {
        state.jobDetailsStatus = 'loading';
        state.jobDetails = null; // Clear previous job details
        state.jobDetailsError = null;
      })
      .addCase(fetchJobDetailsForApplication.fulfilled, (state, action) => {
        state.jobDetailsStatus = 'succeeded';
        state.jobDetails = action.payload; // Store the fetched job
      })
      .addCase(fetchJobDetailsForApplication.rejected, (state, action) => {
        state.jobDetailsStatus = 'failed';
        state.jobDetailsError = action.payload;
      })

      // Cases for submitting an application
      .addCase(applyForJob.pending, (state) => {
        state.applicationStatus = 'loading';
        state.applicationError = null;
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.applicationStatus = 'succeeded';
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applicationStatus = 'failed';
        state.applicationError = action.payload;
      })
            .addCase(fetchMyApplications.pending, (state) => {
        state.myApplicationsStatus = 'loading';
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplicationsStatus = 'succeeded';
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.myApplicationsStatus = 'failed';
        state.myApplicationsError = action.payload;
      });
  
  },
});

// Export the synchronous action
export const { resetApplicationState } = applicationSlice.actions;

// Export the reducer to be used in the store
export default applicationSlice.reducer;