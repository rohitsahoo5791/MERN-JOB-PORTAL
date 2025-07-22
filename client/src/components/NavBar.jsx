import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import './Navstyles.css'; // Assuming you have custom styles

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- CHANGE IS HERE ---
  // We get the 'user' and 'token' from the auth state.
  // The presence of a 'token' is our source of truth for authentication.
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="custom-navbar">
      <div className="logo">
        <Link to="/">Job Portal</Link>
      </div>
      <ul className="nav-links">
        {/* --- AND HERE --- */}
        {/* We check for the 'token' to decide which links to show. */}
        {!token ? (
          // Logged-out User Links
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        ) : user?.role === 'recruiter' ? (
          // Logged-in Recruiter Links
          <>
            <li><Link to="/recruiter-dashboard">Dashboard</Link></li>
            {/* <li><Link to="/recruiter/create-job">Post Job</Link></li>
            <li><Link to="/profile/pic">Profile Pic</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li> */}
          </>
        ) : (
          // Logged-in Job Seeker Links
          <>
           <li><Link to="/jobseeker-dashboard">Dashboard</Link></li>
           
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;