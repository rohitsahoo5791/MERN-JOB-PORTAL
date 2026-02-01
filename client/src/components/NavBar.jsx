import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import './Navstyles.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderNavLinks = () => {
    if (!token) {
      return (
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </>
      );
    }

    if (user?.role === 'recruiter') {
      return (
        <li><Link to="/recruiter-dashboard">Dashboard</Link></li>
      );
    }

    return (
      <>
        <li><Link to="/jobseeker-dashboard">Dashboard</Link></li>
        <li><button onClick={handleLogout} className="nav-logout-btn">Logout</button></li>
      </>
    );
  };

  return (
    <nav className="navbar-header">
      <Link to="/" className="navbar-brand">Job Portal</Link>
      <ul className="navbar-menu">
        {renderNavLinks()}
      </ul>
    </nav>
  );
};

export default Navbar;
