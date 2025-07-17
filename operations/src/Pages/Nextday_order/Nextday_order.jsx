import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Nextday_order.css";

const Editoption = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [showCustomerListing, setShowCustomerListing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://oa-backend-qdbq.onrender.com/api/orders");
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "option1") {
      setShowCustomerListing(true);
    } else {
      setShowCustomerListing(false);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <p>No delivered orders found.</p>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          &#8592;
        </button>
      </div>
    );
  }

  return (
    <div className="main-container">
      <button
        onClick={() => navigate("/dashboard")}
        className="left-arrow-button"
      >
        &#8592;
      </button>
      <div className="dropdown-list">
        <label htmlFor="dropdown" />
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="">Select</option>
          <option value="option1"> Customer </option>
          <option value="option2"> Vendor </option>
          <option value="option3"> Delivery Partner </option>
        </select>
      </div>
      <div className="main-content-nextday-orders">
        {selectedOption === "" && (
          <div className="placeholder-wrapper">
            <p className="placeholder-message">
              Please select a category from the dropdown above to proceed.
            </p>
          </div>
        )}
        {selectedOption === "option1" && (
          <CustomerListing orders={orders} setOrders={setOrders} />
        )}
      </div>

    </div>
  );
};

const CustomerListing = ({ orders, setOrders }) => {
  const [editOrderId, setEditOrderId] = useState(null);
  const [editableOrder, setEditableOrder] = useState({});

  const handleEdit = (order) => {
    setEditOrderId(order.orderId); // 👈 using orderId instead of _id
    setEditableOrder({
      ...order,
      address: { ...order.address },
    });
  };

  const handleInputChange = (field, value, isAddress = false) => {
    if (isAddress) {
      setEditableOrder((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setEditableOrder((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:2000/api/order/${editOrderId}`, // 👈 PUT instead of GET
        editableOrder
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === editOrderId ? response.data.data : order
          )
        );
        setEditOrderId(null);
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order.");
    }
  };

  return (
    <div className="customer-container">
      <table className="customer-table" border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Order On</th>
            <th>Order Id</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.orderId || "N/A"}</td>
              {editOrderId === order.orderId ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editableOrder.address.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value, true)}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editableOrder.address.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value, true)}
                      placeholder="Last Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editableOrder.address.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value, true)}
                      placeholder="Phone"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editableOrder.address.street || ""}
                      onChange={(e) => handleInputChange("street", e.target.value, true)}
                      placeholder="Street"
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{order.address.firstName} {order.address.lastName}</td>
                  <td>{order.address.phone || "N/A"}</td>
                  <td>
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.zipcode},{" "}
                    {order.address.country}
                  </td>
                </>
              )}
              <td>
                <ul className="item-content">
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.name} ({item.quantity} pcs) - ₹{item.price.toFixed(2)} each
                    </li>
                  ))}
                </ul>
              </td>
              <td>₹{order.amount.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                {editOrderId === order.orderId ? (
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <button className="edit-button" onClick={() => handleEdit(order)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Editoption;
