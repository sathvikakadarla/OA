import React, { useState } from 'react';
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
            const response = await fetch('http://localhost:2000/api/auth/login', {
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
                navigate('/home');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

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
