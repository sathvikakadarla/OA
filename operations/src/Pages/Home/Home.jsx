import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { assets } from '../../assets/assets';
import { useAuth } from '../AuthContext/AuthContext'; // ✅ make sure this path is correct
import OperationalBanner from '../../components/Operationalbanner'; // ✅ adjust path if needed

const Home = () => {
  const { isLoggedIn } = useAuth();
  console.log('isLoggedIn:', isLoggedIn); // For debugging

  return (
    <div className="home-page">
      {!isLoggedIn ? (
        <OperationalBanner />
      ) : (
        <div className="tile-container">
          <Link to="/dashboard" className="tile">
  <img src={assets.dashboardicon} alt="Dashboard" />
  <h2>Dashboard</h2>
  <p>Dashboard</p> {/* New description */}
</Link>

<Link to="/profile" className="tile">
  <img src={assets.profile} alt="Profile" />
  <h2>Profile</h2>
  <p>Profile</p> {/* New description */}
</Link>

        </div>
      )}
    </div>
  );
};


export default Home;
