import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { assets } from '../../assets/assets';


const Dashboard = () => {
  const [showRecentOrders, setShowRecentOrders] = useState(false);

  return (
    <>
      <div className='dashboard-container'>
        <div className='first-row'>
          <Link to="/ongoing-order" className='orders'>
            <img src={assets.order} alt='order' />
            <h2>Ongoing Orders</h2>
          </Link>
          <Link to="/assigned-order" className='assigned'>
            <img src={assets.assigned} alt='assigned' />
            <h2>Assigned Orders</h2>
          </Link>
          <Link to="/order-completed" className='order-completed'>
            <img src={assets.orderCompleted} alt='order completed' />
            <h2>Order Completed</h2>
          </Link>
          <Link to="/vendor-management" className='pending'>
            <img src={assets.vendorManagement} alt='pending' />
            <h2>Vendor Management</h2>
          </Link>
        </div>

        <div className='second-row'>
          <Link to="/admin-cancellation" className='admin-cancellation'>
            <img src={assets.adminCancellation} alt='admin cancellation' />
            <h2>Admin Cancellation</h2>
          </Link>
          <Link to="/user-cancellation" className='user-cancellation'>
            <img src={assets.userCancellation} alt='user cancellation' />
            <h2>User Cancellation</h2>
          </Link>
          <Link to="/upcoming-order" className='upcoming-order'>
            <img src={assets.upcomingOrder} alt='upcoming orders' />
            <h2>Upcoming Orders</h2>
          </Link>
          <Link to="/nextday-order" className='vendor-management'>
            <img src={assets.edit} alt='vendor management' />
            <h2>Cust/Vendor/Del partner Edit</h2>
          </Link>
        </div>

        <div className='third-row'>
          <Link to="/credit-to-wallet" className='credit-to-wallet'>
            <img src={assets.wallet} alt='wallet' />
            <h2>Credit to Wallet</h2>
          </Link>

          <Link to="/cart" className="cart">
            <img src={assets.trolley} alt='trolley' />
            <h2>Cart</h2>
          </Link>

          {/* Recent Orders Button */}
           <Link to="/recentorders" className="recent-orders-tile" onClick={() => setShowRecentOrders(true)}>
            <img src={assets.recentOrders || assets.order} alt="recent orders" />
            <h2>Recent Orders</h2>
           </Link>
          <Link to="/delivery-partner" className='delivery-partner-tile'>
            <img src={assets.order || assets.order} alt='delivery partner' />
            <h2>Delivery Partner</h2>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
