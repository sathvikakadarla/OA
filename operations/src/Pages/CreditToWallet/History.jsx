import React, { useEffect, useState } from 'react';
import './CreditToWallet.css'; // Reusing styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const History = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/history');
        const data = await res.json();
        if (res.ok) {
          // Reverse the array so the newest entry appears first
          setLogs(data.reverse());
        } else {
          toast.error(data.message || 'Failed to fetch history');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching history');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="credit-to-wallet-container">
      <h2>Wallet Credit History</h2>

      <div className="history-container">
  <table className="history-table">
    <thead>
      <tr>
        <th className="sticky-header">Employee Name</th>
        <th className="sticky-header">Employee Email</th>
        <th className="sticky-header">Amount Credited</th>
        <th classname="sticky-header">User Email</th>
        <th classname="sticky-header">User Mobile</th>
        <th className="sticky-header">Timestamp</th>
      </tr>
    </thead>
  </table>

  {/* Scrollable part with only tbody data */}
  <div className="table-body-scroll">
    <table className="history-table">
      <tbody>
        {logs.length > 0 ? (
          logs.map((entry, index) => (
            <tr key={index}>
              <td>{entry.employeeName}</td>
              <td>{entry.employeeEmail}</td>
              <td>₹{entry.creditedAmount}</td>
              <td>{entry.userEmail}</td>
              <td>{entry.userMobile}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>No history found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      <ToastContainer />
    </div>
  );
};

export default History;
