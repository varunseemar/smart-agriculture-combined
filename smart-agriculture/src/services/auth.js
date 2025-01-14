import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

export const registerUser = async ({name,email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/Register`,{
            name,
            email,
            password,
            role:'farmer'
        },{ 
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}
export const loginUser = async ({email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/Login`,{
            email,
            password
        },{ 
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}
export const loginAdmin = async ({email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/AdminLogin`,{
            email,
            password
        },{ 
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}