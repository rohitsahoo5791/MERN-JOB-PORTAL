import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Button, Spinner, Alert, Image, Card, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';

// 1. Import the new async thunk
import { updateProfilePicture } from '../../redux/slice/authSlice';

const UpdateProfilePic = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      // 2. Dispatch the async thunk with the form data
      await dispatch(updateProfilePicture(formData)).unwrap();
      toast.success('Profile picture updated successfully!');
      // Reset preview after successful upload
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err || 'Upload failed. Please try again.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 text-center">
            <Card.Title as="h3" className="mb-4">Update Profile Picture</Card.Title>
            
            {status === 'failed' && <Alert variant="danger">{error}</Alert>}
            
            {/* Image Preview */}
            <Image 
              src={preview || defaultAvatar} 
              alt="Profile Preview" 
              roundedCircle 
              className="mb-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #eee' }}
            />
            
            <Form onSubmit={handleUpload}>
              <Form.Group controlId="profilePicUpload" className="mb-3">
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/gif"
                />
              </Form.Group>
              
              <Button type="submit" variant="primary" disabled={status === 'loading' || !file}>
                {status === 'loading' ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Uploading...
                  </>
                ) : 'Upload Picture'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfilePic;