import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';


import { logout, uploadResume } from '../../redux/slice/authSlice';

const JobseekerDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const { user, token, status, error: authError } = useSelector((state) => state.auth);

   
    const [resumeFile, setResumeFile] = useState(null);
    const [localError, setLocalError] = useState(''); // For file type validation
    const resumeInputRef = useRef(null);


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setResumeFile(file);
            setLocalError('');
        } else {
            setResumeFile(null);
            setLocalError('Please select a PDF file.');
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setLocalError('No resume file selected.');
            return;
        }

        setLocalError('');
        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            await dispatch(uploadResume(formData)).unwrap();
            toast.success('Resume updated successfully!');
            setResumeFile(null); // Clear the local file state
            if (resumeInputRef.current) {
                resumeInputRef.current.value = ""; // Clear the file input visually
            }
        } catch (err) {
            toast.error(err || 'Failed to upload resume. Please try again.');
        }
    };

    // Render the UI based on the Redux status
    if (status === 'loading' && !user) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }
    
    if (!user) {
        return (
             <Container className="text-center mt-5">
                <Alert variant="danger">Could not load user data. Please try logging in again.</Alert>
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </Container>
        );
    }

    return (
        <div className="bg-light py-5">
            <Container>
                <Row>
                
                    <Col md={4}>
                       <Card className="border-0 shadow-sm mb-4">
                            <Card.Body className="text-center">
                                <img
                                    src={user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt="Profile"
                                    className="rounded-circle mb-3"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                                <h4 className="mb-1">{user.name}</h4>
                                <p className="text-muted">{user.email}</p>
                                <Badge bg="success" pill className="mb-3">{user.role}</Badge>
                            </Card.Body>
                            <Card.Footer className="bg-white border-0 p-3">
                                <div className="d-grid gap-2">
                                     <Button variant="outline-dark" onClick={() => navigate('/')}>
                                        🏠 Home
                                    </Button>
                                    {/* --- THESE ARE THE ADDED BUTTONS --- */}
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

                    <Col md={8}>
                        <h2>My Resume</h2>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <Card.Title>Resume Preview</Card.Title>
                                {user.resumeUrl ? (
                                    <div className="mb-4" style={{ height: '500px' }}>
                                        <iframe src={user.resumeUrl} width="100%" height="100%" title="Resume Preview" style={{ border: '1px solid #ddd', borderRadius: '4px' }}/>
                                    </div>
                                ) : (
                                    <Alert variant="info">You have not uploaded a resume yet.</Alert>
                                )}
                                <hr />
                                <Card.Title className="mt-4">Upload / Update Resume</Card.Title>
                                <Form.Group controlId="resumeUpload" className="mb-3">
                                    <Form.Label>Select a new resume (PDF only)</Form.Label>
                                    <Form.Control type="file" accept=".pdf" onChange={handleFileChange} ref={resumeInputRef} />
                                </Form.Group>

                                {localError && <Alert variant="danger" className="mt-3">{localError}</Alert>}
                                {status === 'failed' && authError && <Alert variant="danger" className="mt-3">API Error: {authError}</Alert>}

                                <Button variant="primary" onClick={handleResumeUpload} disabled={!resumeFile || status === 'loading'}>
                                    {status === 'loading' ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" /> Uploading...
                                        </>
                                    ) : 'Upload Resume'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default JobseekerDashboard;