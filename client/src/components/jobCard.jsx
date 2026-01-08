import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // Get user's authentication token from the Redux store
  const { token } = useSelector((state) => state.auth);

  /**
   * Navigates to the detailed job page if the user is logged in.
   * Otherwise, it shows an error toast and redirects to the login page.
   */
  const handleViewDetailsClick = () => {
    if (!token) {
      toast.error('Please login to view job details.');
      navigate('/login');
    } else {
      // Navigate to the dynamic route for the specific job, e.g., /job/12345
      navigate(`/job/${job._id}`); 
    }
  };

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-0">{job.title}</Card.Title>
          <Card.Subtitle className="text-muted fw-normal">
            {job.companyId?.name || 'A Great Company'}
          </Card.Subtitle>
        </div>
        <img
          src={job.companyId?.profilePic || defaultAvatar}
          alt="Recruiter"
          width="45"
          height="45"
          className="rounded-circle object-fit-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
      </Card.Header>

      <Card.Body>
        <Card.Text>
          {job.description?.slice(0, 150)}...
        </Card.Text>

        {/* --- This is the key change: The button now navigates --- */}
        <Button variant="primary" className="mt-2" onClick={handleViewDetailsClick}>
          View Details
        </Button>
      </Card.Body>

      <Card.Footer className="text-muted small bg-light">
        <strong>Location:</strong> {job.location} |{' '}
        <strong>Category:</strong> {job.category} |{' '}
        <strong>Salary:</strong> ₹{job.salary?.toLocaleString?.()}
      </Card.Footer>
    </Card>
  );
};

export default JobCard;