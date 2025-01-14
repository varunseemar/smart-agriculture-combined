import React from 'react'
import styles from './login.module.css'
import { useState } from 'react';
import bannerPic from '../images/banner.jpg'
import { loginAdmin } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false);
    const [userData,setUserData] = useState({
        email:'',
        password:'',
    })
    const [Errors,setErrors] = useState({
            wrongEmailpass:"",
            accessDenied:"",
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
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            setLoading(false);
            return;
        }
        try{
            const {email,password} = userData;
            const response = await loginAdmin({email,password})
            if(response.status === 200){
                toast.success('Successfully Logged In');
                const {data} = response;
                localStorage.setItem('email', email)
                localStorage.setItem('name', data.name)
                localStorage.setItem('token', data.token)
                navigate('/admindashboard');
            }
        }
        catch(err){
            if(err.message === "Wrong Email or Password"){
                errors.wrongEmailpass = "Wrong Email or Password";
                toast.error('Wrong Email or Password');
                setErrors(errors);
            }
            if(err.message === "Acces Denied"){
                errors.accessDenied = "Access Denied";
                toast.error('Access Denied');
                setErrors(errors);
            }
            console.log(err.message)
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className={styles.register}>
        <div className={styles.form}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"0px",fontSize:"30px"}}>Welcome To Admin Panel</p>
            <p style={{fontFamily:"sans-serif",marginTop:"15px",marginBottom:"30px"}}>Your personal Smart Agricultre App</p>
            <form onSubmit={handleSubmit} style={{marginBottom:"3vh"}}>
                <input name='email' value={userData.email} onChange={handleChange} type='email' placeholder='Email'></input>
                <input name='password' value={userData.password} onChange={handleChange} type='password' placeholder='Password' style={{marginBottom:"0vh"}}></input>
                <button disabled={loading} type='submit'>Sign In</button>
            </form>
            <a href='/Login' style={{color:"black",fontWeight:"600",marginLeft:"0.3vw"}}>User Login</a>
        </div>
        <div className={styles.pic}>
            <p className={styles.pictext}>Smart Agriculture</p>
            <img src={bannerPic}></img>
        </div>
    </div>
  )
}

export default Login;