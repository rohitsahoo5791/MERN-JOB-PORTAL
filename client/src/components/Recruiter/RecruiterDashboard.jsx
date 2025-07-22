import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/authSlice.js';
import toast from 'react-hot-toast';

import { fetchRecruiterJobs, deleteJob } from '../../redux/slice/jobSlice.js';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
  const { recruiterJobs, recruiterJobsStatus } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (token) {
      dispatch(fetchRecruiterJobs());
    } else {
      navigate('/login');
    }
  }, [token, dispatch, navigate]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        toast.success('Job deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete job. Please try again.');
        console.error('Delete job error:', err);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (recruiterJobsStatus === 'loading') {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading your dashboard...</span>
      </Container>
    );
  }

  if (recruiterJobsStatus === 'failed') {
     return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          <h4>Could not load your jobs.</h4>
          <p>There was an error fetching your data. Please try logging out and back in.</p>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Alert>
      </Container>
    );
  }
  
  if (!user) {
    return null; 
  }

  return (
    <div className="bg-light py-5">
      <Container>
        <Row>
          {/* === Profile Section (COMPLETE) === */}
          <Col md={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center">
                <img
                  src={user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h4>{user.name}</h4>
                <p className="text-muted">{user.email}</p>
                <Badge bg="primary" pill>{user.role}</Badge>
              </Card.Body>
              <Card.Footer className="bg-white border-0 p-3">
                <div className="d-grid gap-2">
                  {/* --- THIS IS THE ADDED BUTTON --- */}
                  <Button variant="outline-dark" onClick={() => navigate('/')}>
                    🏠 Home
                  </Button>
                  <Button variant="outline-primary" onClick={() => navigate('/profile/edit')}>
                    ✏️ Edit Profile Info
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/profile/pic')}>
                    🖼️ Update Profile Picture
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    🚪 Logout
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          {/* === Job Listings Section (COMPLETE) === */}
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">My Job Listings</h2>
              <Button variant="success" onClick={() => navigate('/recruiter/create-job')}>
                ➕ Create New Job
              </Button>
            </div>

            {recruiterJobs.length === 0 ? (
              <Card className="text-center p-4">
                <Card.Body>
                  <p className="mb-0">You haven't posted any jobs yet. Get started by creating one!</p>
                </Card.Body>
              </Card>
            ) : (
              recruiterJobs.map((job) => (
                <Card key={job._id} className="mb-3 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5>{job.title}</h5>
                        <p className="text-muted">{job.location} | <Badge bg="secondary">{job.category}</Badge></p>
                      </div>
                      <div className="text-end">
                        <strong>Salary:</strong> ₹{job.salary?.toLocaleString()}
                      </div>
                    </div>
                    <p>{job.description?.slice(0, 150)}...</p>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button variant="outline-success" size="sm" onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}>✏️ Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteJob(job._id)}>🗑️ Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
 
export default RecruiterDashboard;