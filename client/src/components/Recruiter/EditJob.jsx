import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

// 1. Import the new Redux actions
import { fetchJobById, updateJob, clearCurrentJob } from '../../redux/slice/jobSlice';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. Get the relevant state from the Redux store
  const { currentJob, currentJobStatus, error } = useSelector((state) => state.jobs);
  
  // 3. Keep local state for the form itself
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', salary: '', category: ''
  });

  // 4. Fetch the job data when the component mounts
  useEffect(() => {
    dispatch(fetchJobById(jobId));

    // 5. Cleanup: When the component unmounts, clear the 'currentJob' from the store
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [jobId, dispatch]);

  // 6. Sync the Redux state to the local form state when data arrives
  useEffect(() => {
    if (currentJob) {
      setFormData({
        title: currentJob.title || '',
        description: currentJob.description || '',
        location: currentJob.location || '',
        salary: currentJob.salary || '',
        category: currentJob.category || '',
      });
    }
  }, [currentJob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 7. Dispatch the updateJob action
      await dispatch(updateJob({ jobId, jobData: formData })).unwrap();
      toast.success('Job updated successfully!');
      navigate('/recruiter-dashboard');
    } catch (err) {
      toast.error(err || 'Failed to update job.');
    }
  };
  
  // 8. Render UI based on the Redux status
  if (currentJobStatus === 'loading' && !currentJob) { // Show full-page spinner only on initial load
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading job details...</p>
      </Container>
    );
  }

  if (currentJobStatus === 'failed' && !currentJob) {
    return <Container><Alert variant="danger">Error: {error}</Alert></Container>;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Edit Job Posting</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Job Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Job Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="salary">
              <Form.Label>Salary (Annual)</Form.Label>
              <Form.Control type="number" name="salary" value={formData.salary} onChange={handleInputChange} required />
            </Form.Group>
            
            <Button variant="primary" type="submit" disabled={currentJobStatus === 'loading'}>
              {currentJobStatus === 'loading' ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditJob;