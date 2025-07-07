import React, { useState } from 'react';
import './Login.css';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../AuthContext/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        setIsVisible(false);
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                navigate('/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Failed to log in. Please try again.');
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <FaTimes className="close-btn" onClick={handleClose} />
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
    );
};

export default Login;