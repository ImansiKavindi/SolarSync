import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../shared/api';
import '../styles/login.css'; // Add this line
import logo from '../images/logo.png';
import bg from '../images/bg8.jpg';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(username, password);
      const { token, role, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', user.username);

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'employee') {
        navigate('/employee');
      } else {
        setError('Unknown role');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

   return (
    <div className='login-container'>
    <div className="login-split-container">

        <div className="login-card">
          <img src={logo} alt="Logo" className="logo" />
          <h4>Connecting People to Solar</h4>
          <h2>LOGIN</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      

      
        <img src={bg} alt="Solar Panel" className="right-image" />
      </div>
      </div>
    
  );
};

export default Login;
