import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, Badge, CloseButton, Pagination, Alert, Spinner } from 'react-bootstrap';
import { JobCategories, JobLocations } from '../assets/assets';
import JobCard from './jobCard';
import { fetchAllJobs, setFilters } from '../redux/slice/jobSlice';

const JobListing = () => {
  const dispatch = useDispatch();
  
  // Get the full state from the jobs slice
  const { jobs, status, error, filters } = useSelector((state) => state.jobs);
  
  // Local state for UI controls (checkboxes and pagination) is still needed
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch jobs only once when the component first loads
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllJobs());
    }
  }, [status, dispatch]);

  // Handle all client-side filtering whenever the source data or filters change
  useEffect(() => {
    const sourceJobs = Array.isArray(jobs) ? jobs : [];

    const matchesCategory = (job) => selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesLocation = (job) => selectedLocations.length === 0 || selectedLocations.includes(job.location);
    const matchesTitle = (job) => filters.title === '' || job.title?.toLowerCase().includes(filters.title.toLowerCase());
    const matchesSearchLocation = (job) => filters.location === '' || job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const filtered = sourceJobs.slice().reverse().filter(
      (job) => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
    );

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [jobs, selectedCategories, selectedLocations, filters]);

  // Dispatch an action to clear a search filter (title or location)
  const clearFilter = (key) => {
    dispatch(setFilters({ ...filters, [key]: '' }));
  };
  
  // Pagination logic
  const jobsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  
  // --- Conditional Rendering Logic ---

  if (status === 'loading') {
    return (
        <Container className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading Jobs...</p>
        </Container>
    );
  }

  if (status === 'failed') {
    return (
        <Container className="my-5">
            <Alert variant="danger">
                <h4>Error Fetching Jobs</h4>
                <p>{error || 'An unknown error occurred. Please try refreshing the page.'}</p>
            </Alert>
        </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        {/* === Sidebar Filter (COMPLETE) === */}
        <Col lg={4} sm={12}>
          <div className="p-4 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Current search display from Redux 'filters' state */}
            {(filters.title || filters.location) && (
              <div className="mb-4">
                <h6 className="mb-3">Current Search</h6>
                <div className="d-flex flex-wrap gap-2">
                  {filters.title && (
                    <Badge pill bg="primary" className="p-2 d-flex align-items-center">
                      {filters.title}
                      <CloseButton variant="white" className="ms-2" onClick={() => clearFilter('title')} />
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge pill bg="info" text="dark" className="p-2 d-flex align-items-center">
                      {filters.location}
                      <CloseButton className="ms-2" onClick={() => clearFilter('location')} />
                    </Badge>
                  )}
                </div>
                <hr />
              </div>
            )}
            
            <Form> 
              <div className="mb-4">
                <h6 className="mb-3">Categories</h6>
                {JobCategories.map((category, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`cat-${index}`}
                    label={category}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
                      )
                    }
                    checked={selectedCategories.includes(category)}
                  />
                ))}
              </div>

              <div>
                <h6 className="mb-3">Locations</h6>
                {JobLocations.map((location, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`loc-${index}`}
                    label={location}
                    onChange={() =>
                      setSelectedLocations((prev) =>
                        prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
                      )
                    }
                    checked={selectedLocations.includes(location)}
                  />
                ))}
              </div>
            </Form>
          </div>
        </Col>

        {/* === Job Listings (COMPLETE) === */}
        <Col lg={8} sm={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">
                {filteredJobs.length > 0 ? `${filteredJobs.length} Jobs Found` : 'No Jobs Found'}
                </h3>
            </div>

            {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
                <div className="text-center mt-5 p-4 bg-light rounded">
                    <h5>No matching jobs found.</h5>
                    <p className="text-muted">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
                        {[...Array(totalPages).keys()].map((number) => (
                        <Pagination.Item
                            key={number + 1}
                            active={number + 1 === currentPage}
                            onClick={() => setCurrentPage(number + 1)}
                        >
                            {number + 1}
                        </Pagination.Item>
                        ))}
                        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
                    </Pagination>
                </div>
            )}
        </Col>
      </Row>
    </Container>
  );
};

export default JobListing;