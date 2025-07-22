import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAllJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch jobs.');
    }
  }
);

export const fetchRecruiterJobs = createAsyncThunk(
  'jobs/fetchRecruiterJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/jobs/my-jobs', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch your jobs.');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/jobs/edit/${jobId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/jobs', jobData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`http://localhost:5000/api/jobs/edit/${jobId}`, jobData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/jobs/delete/${jobId}`, config);
      return jobId; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job.');
    }
  }
);


const initialState = {
  jobs: [],
  recruiterJobs: [],
  currentJob: null,
  status: 'idle', 
  recruiterJobsStatus: 'idle', 
  currentJobStatus: 'idle', 
  error: null,
  filters: {
    title: '',
    location: '',
  },
};



const jobSlice = createSlice({
  name: 'jobs',
  initialState,
 
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { title: '', location: '' };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
      state.currentJobStatus = 'idle';
      state.error = null;
    },
  },
 
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchAllJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

     
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.recruiterJobsStatus = 'loading';
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.recruiterJobsStatus = 'succeeded';
        state.recruiterJobs = action.payload;
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.recruiterJobsStatus = 'failed';
        state.error = action.payload;
      })

     
      .addCase(fetchJobById.pending, (state) => {
        state.currentJobStatus = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJobStatus = 'succeeded';
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.currentJobStatus = 'failed';
        state.error = action.payload;
      })

   
      .addCase(createJob.pending, (state) => {
        state.currentJobStatus = 'loading';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.currentJobStatus = 'succeeded';
        state.jobs.unshift(action.payload);
        state.recruiterJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.currentJobStatus = 'failed';
        state.error = action.payload;
      })

  
      .addCase(updateJob.pending, (state) => {
        state.currentJobStatus = 'loading';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.currentJobStatus = 'succeeded';
        const updatedJob = action.payload;
        state.jobs = state.jobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job
        );
        state.recruiterJobs = state.recruiterJobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job
        );
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.currentJobStatus = 'failed';
        state.error = action.payload;
      })
      
      
      .addCase(deleteJob.pending, (state) => {
       
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.jobs = state.jobs.filter((job) => job._id !== jobId);
        state.recruiterJobs = state.recruiterJobs.filter(
          (job) => job._id !== jobId
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export const { setFilters, clearFilters, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;