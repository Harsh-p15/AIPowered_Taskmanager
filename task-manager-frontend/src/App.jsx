import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');

  const handleLoginSuccess = (receivedToken, loggedInUsername) => {
    // Standardize token key to 'access_token'
    localStorage.setItem('access_token', receivedToken);
    localStorage.setItem('username', loggedInUsername);
    setToken(receivedToken);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Router>
        <Routes>
          {/* Redirect root to /dashboard if logged in, else /login */}
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/login" 
            element={<Login onLoginSuccess={handleLoginSuccess} />} 
          />
          
          <Route 
            path="/signup" 
            element={<Signup />} 
          />
          
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;