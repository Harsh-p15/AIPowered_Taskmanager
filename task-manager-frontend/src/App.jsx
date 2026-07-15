import React, {useState} from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';

function App() {

  const[token,setToken] = useState(localStorage.getItem('access_token') || '');
  const[username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleLoginSuccess = (receivedToken, loggedInUsername) => {
    localStorage.setItem('token',receivedToken);
    localStorage.setItem('username',loggedInUsername);
    setToken(receivedToken);
    setUsername(loggedInUsername);
  };

  const handleLogout =() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');

  };

  return(
    <div>
      <h2> TaskManager</h2>
    <Router>
      <nav>
      {!token ? (
        <>
        <Link to = "/Login"> Login </Link>
        <Link to = "/Signup"> Signup</Link>
        </>
        
      ): (
        <div>
        <h3> welcome {username} </h3>
        
        
        <button onClick = {handleLogout}> Logout </button>

        </div>
        
      )
      }
      </nav>
      
    
          {/* Route defintions*/}

    <Routes>

      <Route path = "/" element = {token ? <Navigate to ="/Signup"/> : <Navigate to ="/Login"/>}/>
      <Route path = "/Login" element = {<Login onLoginSuccess = {handleLoginSuccess}/>}/>
      <Route path = "/Signup" element = {<Signup/>}/>
      <Route path = "/Dashboard" element = {token ? <Dashboard token = {token}/> : <Navigate to ="/Login"/>}/>

    </Routes>
    </Router>
  </div>  
    
  );
}
export default App;