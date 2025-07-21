import React, { useState, useEffect } from "react";
import './Recent_order.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Recentorders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get("http://localhost:2000/api/order/recent");
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.warn(response.data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error Fetching orders:", error);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <div className="order-container">
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007BFF', marginBottom: '20px', display: 'inline-block' }}>
  ← Back to Dashboard
</Link>
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No recent orders found.</p>
        ) : (
          <>
            {/* Desktop & Tablet View (Table) */}
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Created</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order._id}>
                    <td>{i + 1}</td>
                    <td>{order.orderId}</td>
                    <td>₹{(order.amount).toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {order.address?.firstName} {order.address?.lastName}<br />
                      {order.address?.email}<br />
                      {order.address?.phone}
                    </td>
                    <td>
                      {order.address?.street}, {order.address?.city}<br />
                      {order.address?.state} - {order.address?.zipcode}, {order.address?.country}
                    </td>
                    <td>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span style={{ fontSize: '15px', color: 'black', fontStyle:'italic' }}>
                              Shop: {item.shopName}<br />
                            </span>
                            {item.name} — ₹{item.price} × {item.quantity}<br />
                            {/* {item.description}<br /> */}
                            {idx < order.items.length - 1 && <hr />} 
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View (Card layout) */}
            <div className="mobile-order-cards">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <h3>Order ID: {order.orderId}</h3>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Amount:</strong> ₹{(order.amount).toFixed(2)}</p>

                  <div className="address-section">
                    <p><strong>Customer:</strong> {order.address?.firstName} {order.address?.lastName}</p>
                    <p>{order.address?.email} | {order.address?.phone}</p>
                    <p>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span style={{ fontSize: '15px', color: 'black', fontStyle:'italic'}}>
                            Shop: {item.shopName}<br />
                          </span>
                          <strong>{item.name}</strong> — ₹{item.price} × {item.quantity}<br />
                          {/* {item.description}<br /> */}              
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recentorders;
