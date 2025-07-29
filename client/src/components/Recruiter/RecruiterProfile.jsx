import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Spinner, Alert } from 'react-bootstrap';


const RecruiterProfile = () => {
  
  const { user, status } = useSelector((state) => state.auth);

  
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