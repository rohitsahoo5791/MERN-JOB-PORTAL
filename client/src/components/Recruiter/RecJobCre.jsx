import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';

// 1. Import the new createJob async thunk
import { createJob } from '../../redux/slice/jobSlice';

const RecruiterCreateJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. Get status and error from the store for UI feedback
  const { currentJobStatus, error } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    salary: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 3. Dispatch the createJob action with the form data
      await dispatch(createJob(formData)).unwrap();
      toast.success('Job posted successfully!');
      navigate('/recruiter-dashboard');
    } catch (err) {
      toast.error(err || 'Failed to post job. Please check the details.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">📢 Create a New Job Posting</h2>
          
          {/* 4. Display a general error message if creation fails */}
          {currentJobStatus === 'failed' && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior React Developer"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineering"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="salary">
                  <Form.Label>Annual Salary (INR)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500000"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and qualifications."
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={currentJobStatus === 'loading'}>
              {currentJobStatus === 'loading' ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Posting...
                </>
              ) : '➕ Post Job'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RecruiterCreateJob;