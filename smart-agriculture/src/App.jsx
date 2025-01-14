import './App.css'
import Register from './pages/register'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Admin from './pages/loginadmin'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './pages/adminDashboard'
import FarmerDashboard from './pages/farmerDashboard'
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/farmerdashboard' element={<FarmerDashboard />}></Route>
        <Route path='/' element={<FarmerDashboard />}></Route>
        <Route path='/admindashboard' element={<AdminDashboard />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/Register' element={<Register />}></Route>
        <Route path='/Login' element={<Login />}></Route>
      </Routes>
    </>
  )
}

export default App
