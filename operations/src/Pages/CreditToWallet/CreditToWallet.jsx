import React, { useState } from 'react';
import './CreditToWallet.css';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for Toastify
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
            const res = await fetch(`http://localhost:2000/api/profile/${mobileNumber}`);
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
      
        try {
          const res = await fetch(`http://localhost:2000/api/profile/${mobileNumber}/add-money`, {
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
      
            // 🔥 Add history log
            const employee = JSON.parse(localStorage.getItem('employeeInfo'));
            const employeeName = employee?.name || "Unknown";
            const employeeEmail = employee?.email || "Unknown";
      
            await fetch(`http://localhost:2000/api/history/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employeeName,
                employeeEmail,
                creditedAmount: Number(amount),
                userEmail: data.updatedProfile.email,
                userMobile: data.updatedProfile.mobileNumber,
                
              })
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
      

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchProfile();
    };

    return (
        <>
          <div className="top-left-button">
            <button onClick={() => navigate('/history')}>View History</button>
          </div>
      
          <div className='credit-to-wallet-container'>
            <div className='credit-to-wallet-inner-container'>
              <div className='input-section left'>
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
      
              <div className='input-section right'>
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
      
              {userProfile && (
                <div className="profile-details">
                  <h3>User Profile</h3>
                  <p><strong>Name:</strong> {userProfile.name}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Mobile Number:</strong> {userProfile.mobileNumber}</p>
                  <p><strong>Profile ID:</strong> {userProfile._id}</p>
                  <p><strong>Wallet Balance:</strong> ₹{userProfile.currentBalance}</p>
                </div>
              )}
      
              {error && <div className="error-message">{error}</div>}
      
              <div className='submit-button'>
                <button onClick={handleSubmit}>Fetch Profile</button>
                {userProfile && (
                  <button onClick={handleAddMoney}>Add Money</button>
                )}
              </div>
            </div>
      
            <ToastContainer />
          </div>
        </>
      );
    }
export default CreditToWallet;
