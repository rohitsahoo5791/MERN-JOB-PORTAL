import React, { useRef } from 'react';
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setFilters } from '../redux/slice/jobSlice';
import { assets } from '../assets/assets';
import './HeroStyles.css';

const Hero = () => {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({
      title: titleRef.current?.value || '',
      location: locationRef.current?.value || '',
    }));
  };

  return (
    <section className="hero-section">
      <Container>
        <div className="hero-container">
          <h1 className="hero-title">Your Next Career Awaits</h1>
          <p className="hero-subtitle">Search for jobs from top companies.</p>
          <SearchForm
            titleRef={titleRef}
            locationRef={locationRef}
            onSearch={handleSearch}
          />
        </div>
      </Container>
    </section>
  );
};

const SearchForm = ({ titleRef, locationRef, onSearch }) => {
  return (
    <Form className="hero-search-form" onSubmit={onSearch}>
      <Row className="g-2 justify-content-center align-items-center">
        <Col xs={12} md={4}>
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <img src={assets.search_icon} alt="" width="20" />
            </InputGroup.Text>
            <FormControl
              placeholder="Job title or keyword"
              ref={titleRef}
              aria-label="Job title or keyword"
            />
          </InputGroup>
        </Col>

        <Col xs={12} md={4}>
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <img src={assets.location_icon} alt="" width="20" />
            </InputGroup.Text>
            <FormControl
              placeholder="City or location"
              ref={locationRef}
              aria-label="City or location"
            />
          </InputGroup>
        </Col>

        <Col xs={12} md={2}>
          <Button type="submit" className="search-btn">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Hero;
