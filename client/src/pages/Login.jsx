import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// 1. Import the ASYNC THUNK itself, not a separate action
import { loginUser } from '../redux/slice/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // No need for a separate 'role' state, we can get it from the form
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = e.target.role.value; // Get role directly from the form on submit

    try {
     
      const resultAction = await dispatch(loginUser({ email, password, role })).unwrap();

  
      if (resultAction.user?.role === 'jobseeker') {
        navigate('/jobseeker-dashboard');
      } else if (resultAction.user?.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        // This case is unlikely if the server is consistent
        navigate('/');
      }
    } catch (err) {
     
      console.error('Failed to login:', err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4 text-center">Login to Your Account</h2>

     
          {status === 'failed' && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            
            <Form.Group className="mb-4">
              <Form.Label>Select Role</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Job Seeker"
                  type="radio"
                  name="role" // Name is important for grouping
                  value="jobseeker"
                  defaultChecked // Use defaultChecked for uncontrolled inputs
                />
                <Form.Check
                  inline
                  label="Recruiter"
                  type="radio"
                  name="role"
                  value="recruiter"
                />
              </div>
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;