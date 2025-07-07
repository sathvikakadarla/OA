import React, { useState } from 'react';
import './Vendor_management.css';
import { useNavigate } from 'react-router-dom';  

const VendorManagement = () => {
  const navigate = useNavigate();  

  const [showVendorListing, setShowVendorListing] = useState(false);
  const [showPerformanceMonitoring, setShowPerformanceMonitoring] = useState(false);

  const handleBackButtonClick = () => {
    navigate('/dashboard');  
  };

  const handleVendorListingClick = () => {
    setShowVendorListing(true);
    setShowPerformanceMonitoring(false);
  };

  const handlePerformanceMonitoringClick = () => {
    setShowPerformanceMonitoring(true);
    setShowVendorListing(false);
  };

  return (
    <div className="vendor-management-container">
      {/* Sidebar */}
      <div className="vendor-sidebar">
      <button className="back-button" onClick={handleBackButtonClick}>
            &#8592; {/* Left arrow character */}
          </button>
        <div className="vendor-header">
          <h2>Vendor Management</h2>
        </div>
        <div className="vendor-content">
          <div className="vendor-section" onClick={handleVendorListingClick}>
            <h3>Vendor Listing</h3>
          </div>
          <div className="vendor-section" onClick={handlePerformanceMonitoringClick}>
            <h3>Performance Monitoring</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showVendorListing && <VendorListing />}
        {showPerformanceMonitoring && <PerformanceMonitoring />}
      </div>
    </div>
  );
};

const VendorListing = () => {
  return (
    <div className="vendor-list-box">
      <h2>Vendor Listing</h2>
      <table className="vendor-table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Vendor Name</th>
            <th>Vendor Address</th>
            <th>Active</th>
            <th>Inactive</th>
          </tr>
        </thead>
        {/* Add table rows as needed */}
      </table>
    </div>
  );
};

const PerformanceMonitoring = () => {
  return (
    <div className="performance-monitoring-box">
      <h2>Performance Monitoring</h2>
      <p>Content for Performance Monitoring will be displayed here.</p>
    </div>
  );
};

export default VendorManagement;