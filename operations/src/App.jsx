import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './Pages/Login/Login.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import AssignedOrder from './Pages/Assigned_order/Assigned_order.jsx';
import NextdayOrder from './Pages/Nextday_order/Nextday_order.jsx';
import OngoingOrder from './Pages/Ongoing_order/Ongoing_order.jsx';
import OrderCompleted from './Pages/Order_completed/Order_completed.jsx';
import CreditToWallet from './Pages/CreditToWallet/CreditToWallet.jsx';
{/*import AdminCancellation from './Pages/Admin_cancellation/Admin_cancellation.jsx';
import UserCancellation from './Pages/User_cancellation/User_cancellation.jsx';
import UpcomingOrder from './Pages/Upcoming_order/Upcoming_order.jsx';*/}
import VendorManagement from './Pages/Vendor_management/Vendor_management.jsx';
import History from './Pages/CreditToWallet/History.jsx';
import { AuthProvider } from './Pages/AuthContext/AuthContext'; // Correct path
import './App.css';
import Cart from './Pages/Cart/Cart.jsx';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Main Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Navbar />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Dashboard Subpages: First Row */}
                    <Route path="/ongoing-order" element={<OngoingOrder />} />
                    <Route path="/assigned-order" element={<AssignedOrder />} />
                    <Route path="/nextday-order" element={<NextdayOrder />} />
                    <Route path="/order-completed" element={<OrderCompleted />} />

                    {/* Dashboard Subpages: Second Row */}
                    {/*<Route path="/admin-cancellation" element={<AdminCancellation />} />
                    <Route path="/user-cancellation" element={<UserCancellation />} />
                    <Route path="/upcoming-order" element={<UpcomingOrder />} />*/}
                    <Route path="/vendor-management" element={<VendorManagement />} />

                    {/*Dashboard Subpages: Third page */}
                    <Route path="/credit-to-wallet" element={<CreditToWallet />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/cart" element={<Cart />} />


                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;