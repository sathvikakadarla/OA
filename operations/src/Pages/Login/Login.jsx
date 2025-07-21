import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../AuthContext/AuthContext';

const Login = ({ onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://oa-backend-qdbq.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                setIsLoggedIn(true);
                alert(data.message);
                onClose(); // Close the popup after successful login
                navigate('/Home');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
    const handleTabClose = () => {
        // Clear login flags or tokens
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // or whatever key you're using
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => window.removeEventListener('beforeunload', handleTabClose);
    }, []);


    return (
        <div className="login-popup-overlay">
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <FaTimes className="close-btn" onClick={onClose} />
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <MdEmail className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {showPassword ? (
                            <FaEye className="icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    <button className="submit" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
