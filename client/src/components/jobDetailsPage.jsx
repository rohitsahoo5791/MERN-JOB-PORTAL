import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetailsForApplication, applyForJob, resetApplicationState } from '../redux/slice/applicationSlice';
import { Button, Container, Card, Spinner, Alert } from 'react-bootstrap';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  // Select state from the 'applications' slice
  const {
    jobDetails,
    jobDetailsStatus,
    jobDetailsError,
    applicationStatus,
    applicationError
  } = useSelector((state) => state.applications);
  
  // --- FIX 1: SELECT 'token' AND 'user' FROM THE CORRECT SLICE ('auth') ---
  const { user, token } = useSelector((state) => state.auth);
  
  // --- FIX 2: DERIVE 'isAuthorized' FROM THE PRESENCE OF THE TOKEN ---
  // The '!!' converts a truthy/falsy value (like a token string or null) to a true/false boolean
  const isAuthorized = !!token;

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetailsForApplication(jobId));
    }
    return () => {
      dispatch(resetApplicationState());
    };
  }, [dispatch, jobId]);

  const handleApplyClick = () => {
    dispatch(applyForJob(jobId));
  };

  if (jobDetailsStatus === 'loading') {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (jobDetailsStatus === 'failed') {
    return <Alert variant="danger">{jobDetailsError || 'Could not load job details.'}</Alert>;
  }

  return (
    <Container className="my-5">
      {jobDetails && (
        <Card>
          <Card.Header as="h4">{jobDetails.title}</Card.Header>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              {jobDetails.companyId?.name || 'A Great Company'}
            </Card.Subtitle>
            <p><strong>Location:</strong> {jobDetails.location}</p>
            <p><strong>Category:</strong> {jobDetails.category}</p>
            <p><strong>Salary:</strong> ₹{jobDetails.salary?.toLocaleString()}</p>
            <hr />
            <h5>Job Description</h5>
            <p style={{ whiteSpace: 'pre-wrap' }}>{jobDetails.description}</p>
            
            {/* --- FIX 3: USE THE CORRECT isAuthorized and CHECK FOR THE 'Student' ROLE --- */}
            {isAuthorized && user?.role === 'jobseeker' && (
              <div className="mt-4">
                <Button
                  variant="success"
                  onClick={handleApplyClick}
                  disabled={applicationStatus === 'loading' || applicationStatus === 'succeeded'}
                >
                  {applicationStatus === 'loading' ? 'Applying...' : 
                   applicationStatus === 'succeeded' ? 'Applied Successfully' : 'Apply Now'}
                </Button>
              </div>
            )}
            
            {applicationStatus === 'failed' && applicationError && (
              <Alert variant="danger" className="mt-3">{applicationError}</Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default JobDetailsPage;