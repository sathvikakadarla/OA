import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import arrow icon
import './Assigned_order.css';

const AssignedOrder = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="page-container">
            <FaArrowLeft className="back-arrow-global" onClick={handleBack} />
            <h1>Assigned Orders</h1>
            <p>This page shows all assigned orders.</p>
        </div>
    );
};

export default AssignedOrder;
