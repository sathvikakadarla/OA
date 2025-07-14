import React, { useState } from 'react';
import './CreditToWallet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreditToWallet = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/profile/${mobileNumber}`);
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
        setError('');
        toast.success('Profile fetched successfully!');
      } else {
        setError(data.message || 'Profile not found');
        setUserProfile(null);
        toast.error('Profile not found');
      }
    } catch (error) {
      setError('Error fetching profile');
      console.error(error);
      toast.error('Error fetching profile');
    }
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      toast.error('Please enter a valid amount');
      return;
    }

    const employee = JSON.parse(localStorage.getItem('employeeInfo'));
    const employeeName = employee?.name || "Unknown";
    const employeeEmail = employee?.email || "Unknown";

    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/profile/${mobileNumber}/add-money`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) })
      });

      const data = await res.json();

      if (res.ok) {
        setUserProfile(data.updatedProfile);
        setAmount('');
        setError('');
        toast.success('Money added successfully!');

        // Add to history
        await fetch(`https://oa-backend-qdbq.onrender.com/api/history/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName,
            employeeEmail,
            creditedAmount: Number(amount),
            userEmail: data.updatedProfile.email,
            userMobile: data.updatedProfile.mobileNumber,
          }),
        });

        toast.success("History log added ✅");
      } else {
        setError(data.message);
        toast.error(data.message || 'Error adding money');
      }
    } catch (err) {
      console.error(err);
      setError('Error adding money');
      toast.error('Error adding money');
    }
  };

  const handleResetBalance = async () => {
    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/profile/${mobileNumber}/reset-balance`, {
        method: 'PUT',
      });
      const data = await res.json();

      if (res.ok) {
        setUserProfile(data.updatedProfile);
        toast.success('Wallet balance reset to ₹0');
      } else {
        toast.error(data.message || 'Failed to reset balance');
      }
    } catch (err) {
      console.error('Reset error:', err);
      toast.error('Error resetting balance');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProfile();
  };

  return (
    <>
      <div className="top-left-button">
        <button onClick={() => navigate('/history')}>View History</button>
      </div>

      <div className="credit-to-wallet-container">
        <div className="credit-to-wallet-inner-container">
          {/* Mobile number input */}
          <div className="input-section left">
            <label htmlFor="mobile-number">Mobile Number</label>
            <input
              type="text"
              id="mobile-number"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              maxLength="10"
            />
          </div>

          {/* Fetch profile button */}
          <div className="submit-button">
            <button onClick={handleSubmit}>Fetch Profile</button>
          </div>

          {/* Profile details and money input shown only after fetching */}
          {userProfile && (
            <>
              <div className="profile-details">
                <h3>User Profile</h3>
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Mobile Number:</strong> {userProfile.mobileNumber}</p>
                <p><strong>Profile ID:</strong> {userProfile._id}</p>
                <p><strong>Wallet Balance:</strong> ₹{userProfile.currentBalance}</p>
              </div>
              
              <div className="input-section right">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="submit-button">
                <button onClick={handleAddMoney}>Add Money</button>
                <button
                  onClick={handleResetBalance}
                  style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                >
                  Reset Balance
                </button>
              </div>
            </>
          )}

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default CreditToWallet;
