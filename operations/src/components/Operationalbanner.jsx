import React from 'react';
import './Operationalbanner.css';
import { assets } from '../assets/assets';
import { useAuth } from '../Pages/AuthContext/AuthContext'; // Context usage

const OperationalBanner = () => {
  const { isLoggedIn } = useAuth(); // Access login status

  if (isLoggedIn) return null; // Hide banner if user is logged in

  return (
    <div className="operational-banner-container">
      <img
        className="operational-banner"
        src={assets.operationalBanner}
        alt="Operational Banner"
      />
    </div>
  );
};

export default OperationalBanner;
