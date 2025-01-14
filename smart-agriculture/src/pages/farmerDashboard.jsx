import React, { useEffect } from 'react'
import Dashboard from '../components/dashboard'
import { useNavigate } from 'react-router-dom';

const farmerDashboard = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if(!localStorage.getItem('email')){
      navigate('/login');
    }
  }, [])

  return (
    <>
        {localStorage.getItem('email') && <Dashboard />}
    </>
  )
}

export default farmerDashboard