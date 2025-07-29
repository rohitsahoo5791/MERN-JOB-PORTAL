import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';


import { updateUserProfile } from '../../redux/slice/authSlice';

const RecruiterEditProfile = () => {
  const dispatch = useDispatch();


  const { user, status, error } = useSelector((state) => state.auth);


  const [formData, setFormData] = useState({ name: '', email: '' });


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.email) {
      toast.error('Please enter a new name or email to update.');
      return;
    }

    try {
      
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Update failed!');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4">Edit Profile Info</h3>
          {status === 'failed' && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Button type="submit" variant="primary" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Updating...
                </>
              ) : (
                'Update Info'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RecruiterEditProfile;