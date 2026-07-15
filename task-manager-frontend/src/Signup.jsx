import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';

function Signup(){

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] =useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');

    const husername = (e) =>{setUsername(e.target.value)};
    const hemail = (e) => {setEmail(e.target.value)};
    const hpassword = (e) => {setPassword(e.target.value)};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const reponse = await axios.post("http://127.0.0.1:8000/api/signup/",{
                username: username,
                email:email,
                password:password,
            });
            navigate('/Login');
        }

        catch(error){
            if (error.response && error.response.data) {
                // If username already exists, show it, otherwise show a generic error
                const backendError = error.response.data.username || error.response.data.detail;
                setError(backendError ? backendError[0] : "Signup failed. Try a different username.");
            } 
            else {
                setError("Cannot connect to backend server.");
                }
            console.log(error);
        }
    };
    return(
        <>

        <h1> Signup page </h1>

        <form onSubmit = {handleSubmit}>

            <input type = "text" placeholder ="username" value = {username} onChange = {husername}/>
            <input type = "email" placeholder = "email" value ={email} onChange = {hemail}/>
            <input type = "password" placeholder = "password" value = {password} onChange = {hpassword}/>

            <button type = "submit"> Signup </button>
            <p> already have an account <Link to ="/Login"> Login </Link></p>

        </form>

    

        
        

        </>
    );
}
export default Signup;