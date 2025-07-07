import React from 'react';
import './Navbar.css';
import { assets } from '../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext/AuthContext';
import OperationalBanner from './Operationalbanner';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <div className="navbar-header">
        <div className="navbar-logo">
          <a href="/" className="logo">
            <img className="logo-img" src={assets.noveglogo} alt="Logo" />
          </a>
        </div>

        <div className="navbar-links">
          <p>NoVeg Operational Admin</p>
        </div>

        <div className="navbar-button">
          {isLoggedIn ? (
            <div className="profile-logout-container">
              <Link to="/profile">
                <img src={assets.profile} alt="Profile" className="profile-img" />
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-button"
              type="button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {location.pathname === '/' && <OperationalBanner />}
    </>
  );
};

export default Navbar;