import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, Badge, CloseButton, Pagination, Alert, Spinner } from 'react-bootstrap';
import { JobCategories, JobLocations } from '../assets/assets';
import JobCard from './jobCard';
import { fetchAllJobs, setFilters } from '../redux/slice/jobSlice';
import './JobListingStyles.css';

const JOBS_PER_PAGE = 5;

const JobListing = () => {
  const dispatch = useDispatch();
  const { jobs, status, error, filters } = useSelector((state) => state.jobs);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllJobs());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const sourceJobs = Array.isArray(jobs) ? jobs : [];
    const filtered = sourceJobs
      .slice()
      .reverse()
      .filter((job) => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesTitle = !filters.title || job.title?.toLowerCase().includes(filters.title.toLowerCase());
        const matchesSearchLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());

        return matchesCategory && matchesLocation && matchesTitle && matchesSearchLocation;
      });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, filters]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const clearFilter = (key) => {
    dispatch(setFilters({ ...filters, [key]: '' }));
  };

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'failed') {
    return <ErrorState error={error} />;
  }

  return (
    <section className="job-listing-section">
      <Container>
        <Row className="g-4">
          <Col lg={4}>
            <FilterSidebar
              filters={filters}
              selectedCategories={selectedCategories}
              selectedLocations={selectedLocations}
              onCategoryChange={handleCategoryChange}
              onLocationChange={handleLocationChange}
              onClearFilter={clearFilter}
            />
          </Col>

          <Col lg={8}>
            <JobResults
              filteredJobs={filteredJobs}
              paginatedJobs={paginatedJobs}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const LoadingState = () => (
  <Container className="text-center my-5">
    <Spinner animation="border" variant="primary" />
    <p className="mt-2">Loading Jobs...</p>
  </Container>
);

const ErrorState = ({ error }) => (
  <Container className="my-5">
    <Alert variant="danger">
      <h4>Error Fetching Jobs</h4>
      <p>{error || 'An unknown error occurred. Please try refreshing the page.'}</p>
    </Alert>
  </Container>
);

const FilterSidebar = ({
  filters,
  selectedCategories,
  selectedLocations,
  onCategoryChange,
  onLocationChange,
  onClearFilter,
}) => (
  <aside className="filter-sidebar">
    {(filters.title || filters.location) && (
      <div className="current-filters">
        <h6 className="filter-title">Current Search</h6>
        <div className="filter-badges">
          {filters.title && (
            <Badge pill bg="primary" className="filter-badge">
              {filters.title}
              <CloseButton
                variant="white"
                className="ms-2"
                onClick={() => onClearFilter('title')}
                aria-label="Clear job title filter"
              />
            </Badge>
          )}
          {filters.location && (
            <Badge pill bg="info" text="dark" className="filter-badge">
              {filters.location}
              <CloseButton className="ms-2" onClick={() => onClearFilter('location')} aria-label="Clear location filter" />
            </Badge>
          )}
        </div>
        <hr />
      </div>
    )}

    <Form className="filters-form">
      <fieldset>
        <legend className="filter-title">Categories</legend>
        {JobCategories.map((category, index) => (
          <Form.Check
            key={`cat-${index}`}
            type="checkbox"
            id={`cat-${index}`}
            label={category}
            onChange={() => onCategoryChange(category)}
            checked={selectedCategories.includes(category)}
          />
        ))}
      </fieldset>

      <fieldset>
        <legend className="filter-title">Locations</legend>
        {JobLocations.map((location, index) => (
          <Form.Check
            key={`loc-${index}`}
            type="checkbox"
            id={`loc-${index}`}
            label={location}
            onChange={() => onLocationChange(location)}
            checked={selectedLocations.includes(location)}
          />
        ))}
      </fieldset>
    </Form>
  </aside>
);

const JobResults = ({ filteredJobs, paginatedJobs, totalPages, currentPage, onPageChange }) => (
  <div className="job-results">
    <div className="results-header">
      <h3 className="results-count">
        {filteredJobs.length > 0 ? `${filteredJobs.length} Jobs Found` : 'No Jobs Found'}
      </h3>
    </div>

    {paginatedJobs.length > 0 ? (
      <div className="job-cards-container">
        {paginatedJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    ) : (
      <div className="no-results">
        <h5>No matching jobs found.</h5>
        <p className="text-muted">Try adjusting your search or filter criteria.</p>
      </div>
    )}

    {totalPages > 1 && (
      <div className="pagination-container">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => onPageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    )}
  </div>
);

export default JobListing;
