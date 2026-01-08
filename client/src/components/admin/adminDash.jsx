// frontend/src/pages/admin/AdminDashboardPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup, Badge, Accordion } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

// --- Axios API Client Setup ---
// Create an instance of Axios that will automatically include the admin token in all requests.
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api/admin', // Base URL for all admin routes
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- The Main Component ---
const AdminDashboardPage = () => {
    // State to manage the current view (which button is active)
    const [view, setView] = useState('users'); // 'users', 'latestUsers', 'latestJobs'

    // State for storing data from API calls
    const [jobseekers, setJobseekers] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [latestUsers, setLatestUsers] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);

    // State for the expanded view data (applications or jobs for a specific user)
    const [expandedData, setExpandedData] = useState({});

    // State for loading and error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- API Fetching Functions ---

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (view === 'users') {
                const [jobseekersRes, recruitersRes] = await Promise.all([
                    apiClient.get('/users/jobseekers'),
                    apiClient.get('/users/recruiters')
                ]);
                setJobseekers(jobseekersRes.data.users);
                setRecruiters(recruitersRes.data.users);
            } else if (view === 'latestUsers') {
                const res = await apiClient.get('/users/latest');
                setLatestUsers(res.data.users);
            } else if (view === 'latestJobs') {
                const res = await apiClient.get('/jobs/latest');
                setLatestJobs(res.data.jobs);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch data.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [view]);

    // Fetch data whenever the view changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Event Handlers for Actions ---

    const handleDeleteUser = async (userId, userRole) => {
        if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            try {
                await apiClient.delete(`/users/${userId}`);
                toast.success('User deleted successfully!');
                // Refresh the list
                if (userRole === 'jobseeker') {
                    setJobseekers(prev => prev.filter(u => u._id !== userId));
                } else {
                    setRecruiters(prev => prev.filter(u => u._id !== userId));
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleExpand = async (userId, userRole) => {
        // If data is already fetched, just toggle visibility (or do nothing)
        if (expandedData[userId]) {
            // Optional: Toggle visibility by removing the key
            const newExpandedData = { ...expandedData };
            delete newExpandedData[userId];
            setExpandedData(newExpandedData);
            return;
        }

        // Set loading state for this specific user
        setExpandedData(prev => ({ ...prev, [userId]: { loading: true, data: [] } }));
        try {
            let res;
            if (userRole === 'jobseeker') {
                res = await apiClient.get(`/applications/user/${userId}`);
                setExpandedData(prev => ({ ...prev, [userId]: { loading: false, data: res.data.applications } }));
            } else {
                res = await apiClient.get(`/jobs/recruiter/${userId}`);
                setExpandedData(prev => ({ ...prev, [userId]: { loading: false, data: res.data.jobs } }));
            }
        } catch (err) {
            toast.error(`Failed to fetch details for user ${userId}`);
            setExpandedData(prev => ({ ...prev, [userId]: { loading: false, data: [], error: true } }));
        }
    };

    const handleDeleteExpandedItem = async (itemId, itemType, userId) => {
         if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                if(itemType === 'application'){
                    await apiClient.delete(`/applications/${itemId}`);
                } else { // 'job'
                    await apiClient.delete(`/jobs/${itemId}`);
                }
                toast.success('Item deleted successfully!');
                // Refresh the expanded data for that user
                setExpandedData(prev => ({
                    ...prev,
                    [userId]: {
                        ...prev[userId],
                        data: prev[userId].data.filter(item => item._id !== itemId)
                    }
                }));
            } catch (err) {
                toast.error('Failed to delete item.');
            }
        }
    };
    
    // --- Render Functions for Different Views ---

    const renderUserManagement = () => (
        <Accordion defaultActiveKey="0">
            {/* Jobseekers Section */}
            <Accordion.Item eventKey="0">
                <Accordion.Header>Jobseekers ({jobseekers.length})</Accordion.Header>
                <Accordion.Body>
                    <ListGroup variant="flush">
                        {jobseekers.map(user => (
                            <ListGroup.Item key={user._id}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>{user.name} ({user.email})</span>
                                    <div>
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleExpand(user._id, 'jobseeker')}>
                                            {expandedData[user._id] ? 'Collapse' : 'Expand'}
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user._id, 'jobseeker')}>Delete</Button>
                                    </div>
                                </div>
                                {expandedData[user._id] && (
                                    <div className="mt-3 p-2 border rounded">
                                        {expandedData[user._id].loading ? <Spinner size="sm" /> :
                                         expandedData[user._id].data.length === 0 ? <p className="text-muted small mb-0">No applications found.</p> :
                                         <ListGroup variant="flush">
                                            {expandedData[user._id].data.map(app => (
                                                <ListGroup.Item key={app._id} className="d-flex justify-content-between align-items-center">
                                                    <span>Applied for: {app.jobId?.title || 'N/A'}</span>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteExpandedItem(app._id, 'application', user._id)}>Delete</Button>
                                                </ListGroup.Item>
                                            ))}
                                         </ListGroup>
                                        }
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>

            {/* Recruiters Section */}
            <Accordion.Item eventKey="1">
                <Accordion.Header>Recruiters ({recruiters.length})</Accordion.Header>
                <Accordion.Body>
                    <ListGroup variant="flush">
                        {recruiters.map(user => (
                             <ListGroup.Item key={user._id}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>{user.name} ({user.email})</span>
                                    <div>
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleExpand(user._id, 'recruiter')}>
                                           {expandedData[user._id] ? 'Collapse' : 'Expand'}
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user._id, 'recruiter')}>Delete</Button>
                                    </div>
                                </div>
                                {expandedData[user._id] && (
                                    <div className="mt-3 p-2 border rounded">
                                        {expandedData[user._id].loading ? <Spinner size="sm" /> :
                                         expandedData[user._id].data.length === 0 ? <p className="text-muted small mb-0">No jobs posted.</p> :
                                         <ListGroup variant="flush">
                                            {expandedData[user._id].data.map(job => (
                                                <ListGroup.Item key={job._id} className="d-flex justify-content-between align-items-center">
                                                    <span>Job: {job.title}</span>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteExpandedItem(job._id, 'job', user._id)}>Delete</Button>
                                                </ListGroup.Item>
                                            ))}
                                         </ListGroup>
                                        }
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );

    const renderLatestUsers = () => (
        <ListGroup>
            {latestUsers.map(user => (
                <ListGroup.Item key={user._id}>
                    {user.name} ({user.email}) <Badge bg={user.role === 'jobseeker' ? 'success' : 'primary'}>{user.role}</Badge>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    const renderLatestJobs = () => (
        <ListGroup>
            {latestJobs.map(job => (
                <ListGroup.Item key={job._id}>
                    <strong>{job.title}</strong> by {job.companyId?.name || 'N/A'}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    // --- Main JSX Return ---
    return (
        <div className="bg-light py-5 min-vh-100">
            <Toaster position="top-right" />
            <Container>
                <h1 className="mb-4">Admin Dashboard</h1>

                {/* --- Top Navigation Buttons --- */}
                <Card className="shadow-sm mb-4">
                    <Card.Body className="d-flex gap-2">
                        <Button variant={view === 'users' ? 'primary' : 'outline-primary'} onClick={() => setView('users')}>Manage All Users</Button>
                        <Button variant={view === 'latestUsers' ? 'primary' : 'outline-primary'} onClick={() => setView('latestUsers')}>Latest Signups</Button>
                        <Button variant={view === 'latestJobs' ? 'primary' : 'outline-primary'} onClick={() => setView('latestJobs')}>Latest Job Posts</Button>
                    </Card.Body>
                </Card>

                {/* --- Main Content Area --- */}
                <Card className="shadow-sm">
                    <Card.Body>
                        {loading ? (
                            <div className="text-center"><Spinner animation="border" /></div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                {view === 'users' && renderUserManagement()}
                                {view === 'latestUsers' && renderLatestUsers()}
                                {view === 'latestJobs' && renderLatestJobs()}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminDashboardPage;