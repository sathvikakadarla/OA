import React, { useEffect, useState } from 'react';
import './History.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const History = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://oa-backend-qdbq.onrender.com/api/history');
        const data = await res.json();
        if (res.ok) {
          const sorted = data.sort((a, b) => {
  const timeA = new Date(a.createdAt || a.timestamp);
  const timeB = new Date(b.createdAt || b.timestamp);
  return timeB - timeA; // Newest first
});
setLogs(sorted);

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
    <div className="history-wallet-container">
      <h2>Wallet Credit History</h2>

      <div className="table-scroll-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th className="sticky-header">Employee Name</th>
              <th className="sticky-header">Employee Email</th>
              <th className="sticky-header">Amount Credited</th>
              <th className="sticky-header">User Email</th>
              <th className="sticky-header">User Mobile</th>
              <th className="sticky-header">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.employeeName}</td>
                  <td>{entry.employeeEmail}</td>
                  <td style={{ color: entry.creditedAmount < 0 ? 'red' : 'green' }}>
                    ₹{entry.creditedAmount}
                  </td>
                  <td>{entry.userEmail}</td>
                  <td>{entry.userMobile}</td>
                  <td>
                    {new Date(entry.createdAt|| entry.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default History;
