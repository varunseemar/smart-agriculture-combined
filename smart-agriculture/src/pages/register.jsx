import React from 'react'
import { useState } from 'react';
import banner from '../images/banner.jpg'
import styles from './register.module.css'
import { registerUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false);
    const [userData,setUserData] = useState({
        name:'',
        email:'',
        password:'',
    })
    const [Errors,setErrors] = useState({
        userExist:"",
        name:"",
        email:"",
        password:"",
    });
    const handleChange = (e)=>{
        setUserData({
            ...userData,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        let errors = {};
        if(!userData.email || userData.email.trim() === ""){
            errors.email = "Email is Required"
            toast.error('Email is Required');
        }
        if(!userData.password || userData.password.trim() === ""){
            errors.password = "Password is Required"
            toast.error('Password is Required');
        }
        if(!userData.name || userData.name.trim() === ""){
            errors.name = "Name is Required"
            toast.error('Name is Required');
        }
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            setLoading(false);
            return;
        }
        try{
            const {name,email,password} = userData;
            const response = await registerUser({name,email,password})
            if(response.status === 200){
                toast.success('Successfully Registered');
                navigate('/login')
            }
            console.log(response)
        }
        catch(err){
            if(err.message === "User already Exists."){
                errors.userExist = "User already Exists";
                toast.error('User already Exists');
                setErrors(errors);
            }
            console.log(err.message)
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className={styles.login}>
        <div className={styles.loginform}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"0px",fontSize:"30px"}}>Create an account</p>
            <p style={{fontFamily:"sans-serif",marginTop:"15px",marginBottom:"30px"}}>Your personal Smart Agricultre App</p>
            <form onSubmit={handleSubmit}>
                <input name='name' value={userData.name} onChange={handleChange} type='text' placeholder='Name'></input>
                <input name='email' value={userData.email} onChange={handleChange} type='email' placeholder='Email'></input>
                <input name='password' value={userData.password} onChange={handleChange} type='password' placeholder='Password' style={{marginBottom:"3vh"}}></input>
                <div>
                    <input type="checkbox" id="checkbox" name="checkbox" style={{accentColor:"#858585",height:"14px",width:"14px",marginLeft:"0px"}}/> 
                    <label htmlFor="checkbox" style={{color:"#525252",fontFamily:"sans-serif",fontSize:"16.3px",marginLeft:"13px"}}>By creating an account, I agree to our terms of use and privacy policy</label>
                </div>
                <button disabled={loading} type='submit'>Create Account</button>
            </form>
            <p style={{fontFamily:"sans-serif",marginTop:"25px",marginLeft:"5px"}}>Already have an account?&nbsp;&nbsp;<a href='/Login' style={{color:"black",fontWeight:"600"}}>Sign In</a></p>
        </div>
        <div className={styles.loginpic}>
            <p className={styles.loginpictext}>Smart Agriculture</p>
            <img src={banner}></img>
        </div>
    </div>
  )
}

export default Register;