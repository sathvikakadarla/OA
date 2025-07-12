import React from "react";
import './Recent_order.css';

const Recentorders = () => {
    return (
      <div className="order-container">
      <div className="recent-orders">
      <h2>Recent Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Scheduled For</th>
            <th>Amount</th>
          </tr>
        </thead>
      </table>
    </div>
      <div className="delivery-container">
        <div className="delivery-heading">
        <h2>Delivery Partner</h2>
        </div>
      </div>
    </div>
    )
}

export default Recentorders;
