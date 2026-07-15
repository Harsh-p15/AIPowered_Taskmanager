import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login({onLoginSuccess}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ error, setError] = useState('');

    const husername = (e) =>{setUsername(e.target.value)};
    const hpassword = (e) =>{setPassword(e.target.value)};
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');

        try{
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/',{
                username: username,
                password: password,
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            onLoginSuccess(response.data.access, username);
            navigate('/dashboard');
        }
        catch(err){
            setError("login failed");
            console.log(err);
        }
    };



  return(
    <div>
    <h1> Task manager webapp</h1>
    <h2> Login </h2>
    <form onSubmit={handleSubmit}>
        <input type = "text" placeholder = "username" value = {username} onChange ={ husername}/> 
        <input type = "password" placeholder = "passowrd" value = {password} onChange = {hpassword}/>
        <button type = "submit"> Login </button>
    </form>
    </div>

  );

}
export default Login;