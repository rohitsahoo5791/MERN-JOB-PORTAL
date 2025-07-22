import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Spinner, Alert } from 'react-bootstrap';

/**
 * RecruiterProfile Component
 *
 * This component no longer fetches its own data. It simply reads the
 * user information directly from the Redux 'auth' state. This makes it
 * lightweight, fast, and always in sync with the global application state.
 */
const RecruiterProfile = () => {
  // 1. Get the user data and status directly from the Redux store.
  const { user, status } = useSelector((state) => state.auth);

  // 2. Handle the case where the user data is still loading or has failed.
  if (status === 'loading') {
    return (
      <Card className="text-center p-3">
        <Spinner animation="border" size="sm" />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="text-center p-3">
        <Alert variant="warning" className="mb-0">User not found.</Alert>
      </Card>
    );
  }
  
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // 3. Render the profile using the user data from Redux.
  return (
    <Card className="text-center p-4 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={user.profilePic || defaultAvatar}
        alt="Profile"
        className="rounded-circle mx-auto"
        style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #eee' }}
        onError={(e) => { e.target.src = defaultAvatar; }}
      />
      <Card.Body>
        <Card.Title className="mt-2 h4">{user.name || 'User Name'}</Card.Title>
        <Card.Text className="text-muted">{user.email || 'user.email@example.com'}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecruiterProfile;