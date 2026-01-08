import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, ListGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

// Import all necessary Redux actions
import { logout, uploadResume } from '../../redux/slice/authSlice';
import { fetchMyApplications } from '../../redux/slice/applicationSlice';

const JobseekerDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // === Select state from Redux store using separate selectors ===
    // 1. Get user authentication data
    const { user, token, status, error: authError } = useSelector((state) => state.auth);
    // 2. Get the list of the user's job applications
    const { 
        myApplications, 
        myApplicationsStatus, 
        myApplicationsError 
    } = useSelector((state) => state.applications);

    // === Local component state for the file input ===
    const [resumeFile, setResumeFile] = useState(null);
    const [localError, setLocalError] = useState('');
    const resumeInputRef = useRef(null);

    // === useEffect hook to handle authentication and data fetching ===
    useEffect(() => {
        // If there's no token, the user is not logged in, so redirect to login page
        if (!token) {
            navigate('/login');
        } else {
            // If the user is logged in, dispatch the action to fetch their applications
            dispatch(fetchMyApplications());
        }
    }, [token, navigate, dispatch]);

    // === Event Handlers ===
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Validate that the selected file is a PDF
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
            // Dispatch the upload action and wait for it to complete
            await dispatch(uploadResume(formData)).unwrap();
            toast.success('Resume updated successfully!');
            setResumeFile(null); // Clear the file from local state
            if (resumeInputRef.current) {
                resumeInputRef.current.value = ""; // Visually clear the file input field
            }
        } catch (err) {
            toast.error(err || 'Failed to upload resume. Please try again.');
        }
    };

    // === Conditional Rendering for page load and fatal errors ===
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

    // === Main Component JSX Render ===
    return (
        <div className="bg-light py-5">
            <Container>
                <Row>
                
                    {/* --- LEFT COLUMN: USER PROFILE CARD --- */}
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
                                     <Button variant="outline-dark" onClick={() => navigate('/')}>🏠 Home</Button>
                                     <Button variant="outline-primary" onClick={() => navigate('/profile/edit')}>✏️ Edit Profile Info</Button>
                                     <Button variant="outline-secondary" onClick={() => navigate('/profile/pic')}>🖼️ Update Profile Picture</Button>
                                     <Button variant="danger" onClick={handleLogout}>🚪 Logout</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>

                    {/* --- RIGHT COLUMN: MAIN CONTENT --- */}
                    <Col md={8}>
                        {/* SECTION 1: RESUME MANAGEMENT */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <Card.Title as="h2" className="mb-3">My Resume</Card.Title>
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
                                    {status === 'loading' ? (<><Spinner as="span" animation="border" size="sm" /> Uploading...</>) : 'Upload Resume'}
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* SECTION 2: APPLIED JOBS LIST */}
                        <div className="mt-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Header as="h2" className="bg-white border-0 pt-3">My Job Applications</Card.Header>
                                
                                {myApplicationsStatus === 'loading' && (
                                    <Card.Body className="text-center"><Spinner animation="border" /></Card.Body>
                                )}

                                {myApplicationsStatus === 'failed' && (
                                    <Card.Body><Alert variant="danger">{myApplicationsError || "Could not load your applications."}</Alert></Card.Body>
                                )}

                                {myApplicationsStatus === 'succeeded' && (
                                    <>
                                        {myApplications.length === 0 ? (
                                            <Card.Body><Alert variant="info">You have not applied to any jobs yet.</Alert></Card.Body>
                                        ) : (
                                            <ListGroup variant="flush">
                                                {myApplications.map((app) => (
                                                    <ListGroup.Item 
                                                        key={app._id} 
                                                        as={Link} 
                                                        to={`/job/${app.jobId?._id}`}
                                                        className="d-flex justify-content-between align-items-start text-decoration-none text-dark p-3"
                                                        action
                                                    >
                                                        <div className="ms-2 me-auto">
                                                            <div className="fw-bold">{app.jobId?.title || 'Job Title Not Found'}</div>
                                                            {app.jobId?.companyId?.name || 'A Great Company'}
                                                        </div>
                                                        <Badge bg="primary" pill>
                                                            {app.status}
                                                        </Badge>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                    </>
                                )}
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default JobseekerDashboard;