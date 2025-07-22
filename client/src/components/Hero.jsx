import React, { useRef } from 'react';
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
// 1. Import the NEW action from the jobSlice
import { setFilters } from '../redux/slice/jobSlice';
import { assets } from '../assets/assets';

const Hero = () => {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const dispatch = useDispatch();

  // 2. Handle form submission to prevent page reload and dispatch the action
  const handleSearch = (e) => {
    e.preventDefault(); // Prevents the form from reloading the page
    
    // 3. Dispatch the setFilters action with the values from the inputs
    dispatch(setFilters({
      title: titleRef.current.value,
      location: locationRef.current.value,
    }));
  };

  return (
    <Container className="my-5">
      <div className="bg-dark text-white text-center p-5 rounded">
        <h2 className="display-4 fw-bold mb-3">Your Next Career Awaits</h2>
        <p className="fs-5 text-white-50">Search for jobs from top companies.</p>

        {/* 4. Use a Form with an onSubmit handler for better accessibility */}
        <Form className="mt-4" data-bs-theme="dark" onSubmit={handleSearch}>
          <Row className="g-2 justify-content-center align-items-center">
            <Col xs={12} md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <img src={assets.search_icon} alt="Search" width="20" />
                </InputGroup.Text>
                <FormControl placeholder="Job title or keyword" ref={titleRef} />
              </InputGroup>
            </Col>

            <Col xs={12} md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <img src={assets.location_icon} alt="Location" width="20" />
                </InputGroup.Text>
                <FormControl placeholder="City or location" ref={locationRef} />
              </InputGroup>
            </Col>

            <Col xs={12} md={2}>
              {/* Button type="submit" will trigger the form's onSubmit */}
              <Button variant="info" type="submit" className="w-100 fw-bold">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default Hero;