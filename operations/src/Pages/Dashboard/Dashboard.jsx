import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Dashboard.css';
import { assets } from '../../assets/assets';
import Recentorders from '../Recent_order/Recent_order';
import DeliveryPartners from '../Delivery/Delivery';

const Dashboard = () => {
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

                {/* Third Row with Credit to Wallet Tile */}
                <div className='third-row'>
                    <Link to="/credit-to-wallet" className='credit-to-wallet'>
                        <img src={assets.wallet} alt='wallet' />
                        <h2>Credit to Wallet</h2>
                    </Link>
                    <Link to="/cart" className="cart">
                        <img src={assets.trolley} alt='trolley' />
                        <h2>Cart</h2>
                    </Link>
                </div>

                

                <div className='recent-and-delivery'>
                    <Recentorders /> {/* Recent Orders box */}
                    <DeliveryPartners /> {/* Delivery Partners box */}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
