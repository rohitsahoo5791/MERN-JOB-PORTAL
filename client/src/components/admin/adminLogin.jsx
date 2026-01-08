import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call the special admin login API endpoint
            const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
                email,
                password,
            });

            // --- THIS IS THE CRUCIAL PART ---
            // If login is successful, save the token to local storage
            // This 'admin_token' is what the AdminDashboardPage looks for.
            localStorage.setItem('admin_token', response.data.token);
            // -----------------------------

            toast.success('Admin login successful!');
            
            // Redirect to the admin dashboard
            navigate('/admin/dashboard');

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Toaster />
            <Container style={{ maxWidth: '450px' }}>
                <Card className="shadow-lg border-0">
                    <Card.Header as="h3" className="text-center bg-dark text-white p-3">
                        Admin Portal Login
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formAdminEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter admin email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formAdminPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                            <div className="d-grid">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" /> Logging In...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminLoginPage;