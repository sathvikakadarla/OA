import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext/AuthContext';
import OperationalBanner from './Operationalbanner';
import Login from '../Pages/Login/Login';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(false);
    setHasLoggedOut(true);
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname === '/' && hasLoggedOut) {
      setHasLoggedOut(false);
    }
  }, [location.pathname, hasLoggedOut]);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // Don't show navbar on actual /login route
  if (location.pathname === '/login') return null;

  return (
    <>
      <div className="navbar-header">
        <div className="navbar-logo">
          <Link to="/" className="logo">
            <img className="logo-img" src={assets.noveglogo} alt="Logo" />
          </Link>
          {isLoggedIn && (
            <Link to="/home" className="home-button">Home</Link>
          )}
        </div>

        <div className="navbar-links">
          <p>NoVegRapix Operational Admin</p>
        </div>

        <div className="navbar-button">
          {isLoggedIn ? (
            <div className="home-logout-container">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" type="button" onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Show banner only when login popup is NOT shown */}
      {location.pathname === '/' && !showLogin && <OperationalBanner />}

      {/* Render login popup overlay */}
      {showLogin && (
        <div className="login-popup-overlay">
          <Login onClose={handleLoginClose} />
        </div>
      )}
    </>
  );
};

export default Navbar;
