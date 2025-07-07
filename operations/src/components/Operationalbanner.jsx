import React from 'react';
import './Operationalbanner.css';
import { assets } from '../assets/assets'; // Adjust path if needed

const OperationalBanner = () => {
  return (
    <div className="operational-banner-container">
      <img
        className="operational-banner"
        src={assets.operationalBanner}  // Use the correct export name
        alt="Operational Banner"
      />
    </div>
  );
};

export default OperationalBanner;

