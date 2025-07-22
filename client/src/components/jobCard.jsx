import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // --- 1. CRITICAL FIX: Hooks must be called at the top level ---
  // We get the token from the Redux store here, at the component's top level.
  // The selector is also corrected to point to `state.auth.token`.
  const { token } = useSelector((state) => state.auth);

  const handleViewJobClick = () => {
    // 2. Now we can safely use the 'token' variable inside the handler.
    if (!token) {
      toast.error('Please login to view or apply to this job.');
      navigate('/login');
    } else {
      // You can navigate to a detailed job page here in the future
      // navigate(`/job/${job._id}`);
      toast.success('✅ Apply feature coming soon!');
    }
  };

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    // The key should be on this top-level Card element in the parent component (JobListing.jsx)
    // Example: paginatedJobs.map((job) => <JobCard key={job._id} job={job} />)
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

        <Button variant="primary" className="mt-2" onClick={handleViewJobClick}>
          View Job
        </Button>
      </Card.Body>

      <Card.Footer className="text-muted small bg-light">
        <strong>Location:</strong> {job.location}  | 
        <strong>Category:</strong> {job.category}  | 
        <strong>Salary:</strong> ₹{job.salary?.toLocaleString?.()}
      </Card.Footer>
    </Card>
  );
};

export default JobCard;