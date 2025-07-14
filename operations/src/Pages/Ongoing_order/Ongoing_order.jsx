import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";
import { assets } from '../../assets/assets';
import "./Ongoing_order.css";

const OrderDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAddresses, setVisibleAddresses] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [filterStatus, setFilterStatus] = useState(""); // For filtering orders
    const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveredOrders = async () => {
            try {
                const response = await axios.get("https://oa-backend-qdbq.onrender.com/api/orders");
                if (response.data.success) {
                    setOrders(response.data.data);
                } else {
                    console.error("Failed to fetch delivered orders:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching delivered orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveredOrders();
    }, []);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setShowDropdown(false); // Close dropdown after selection
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status.toLowerCase() === filterStatus.toLowerCase())
    : orders;

    const toggleAddressVisibility = (id) => {
        setVisibleAddresses((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order); // Show the modal with the selected order details
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null); // Close the modal
    };

    if (loading) {
        return <p>Loading delivered orders...</p>;
    }

    

    return (
        <div className="order-delivered-container">
            <button onClick={() => navigate("/dashboard")} className="left-arrow-button">&#8592;</button>

          {/* Dropdown for filtering */}
          <div className="filter-container">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              {filterStatus ? `Status: ${filterStatus}` : "Filter by Status"} <FiChevronDown />
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                {["Default","Order Placed", "Order Received", "Out for Delivery", "Delivered"].map((status) => (
                  <li key={status} onClick={() => handleFilterSelect(status === "Default" ? "" : status)}>
                    {status}
                    </li>
                ))}
              </ul>
            )}
          </div>
            {filteredOrders.length === 0 ? (
                <p style={{ marginTop: "20px" }}>
                No orders found for <strong>{filterStatus}</strong>.
                </p>
            ) : (
            <table className="order-table" border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Order On</th>
                        <th>Order ID</th>
                        <th>Customer Details</th>
                        <th>Phone</th>
                        <th>ShopName</th>
                        <th>Items</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className="order-id-link"
                                    onClick={() => openOrderDetails(order)} // Open the modal on click
                                >
                                    {order.orderId || "N/A"}
                                </button>
                            </td>
                            <td>
                                <div className="customer-details">
                                    <span className="highlight-name">
                                        {order.address.firstName} {order.address.lastName}
                                    </span>
                                    <button
                                        className="location-button"
                                        onClick={() => toggleAddressVisibility(order._id)}
                                    >
                                        <img src={assets.map_icon} className="map_icon" alt="Map icon" />
                                    </button>
                                </div>
                                <div
                                    className={`address-container ${
                                        visibleAddresses[order._id] ? "visible" : ""
                                    }`}
                                >
                                    {order.address.street}, {order.address.city}, {order.address.state}
                                    <br />
                                    {order.address.zipcode}, {order.address.country}
                                </div>
                            </td>
                            <td>{order.address.phone}</td>
                            <td>{order.shopName || "N/A"}</td> {/* ✅ Display shop name */}
                            <td>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item._id}>
                                            {item.name} ({item.quantity} pcs) - ₹{item.price.toFixed(2)} each
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>₹{order.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {/* Modal for displaying order details */}
            {selectedOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeOrderDetails}>
                            ✖
                        </button>
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                        <p><strong>Customer Name:</strong> {selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                        <p><strong>Phone:</strong> {selectedOrder.address.phone}</p>
                        <p><strong>Address:</strong> {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.zipcode}, {selectedOrder.address.country}</p>
                        <p><strong>Amount:</strong> ₹{selectedOrder.amount.toFixed(2)}</p>
                        <p><strong>Shop Name:</strong> {selectedOrder.shopName || "N/A"}</p>
                        <h3>Items:</h3>
                        <ul>
                            {selectedOrder.items.map((item) => (
                                <li key={item._id}>
                                    {item.name} ({item.quantity} pcs) - ₹{item.price.toFixed(2)} each
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDelivered;
