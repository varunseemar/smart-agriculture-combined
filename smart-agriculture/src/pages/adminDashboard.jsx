import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Trash2 } from "lucide-react";
import toast from 'react-hot-toast';
import axios from 'axios';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/constants'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const response = await axios.get(`${BACKEND_URL}/api/users/getAllUsers`);
        setUsers(response.data);
        setLoading(false);
      } 
      catch(error){
        toast.error('Failed to fetch users');
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [users, reload]);
  useEffect(() => {
      if(!localStorage.getItem('email')){
        navigate('/admin');
      }
  }, [])

  const handleDeleteUser = async (userId) => {
    try{
      await axios.delete(`${BACKEND_URL}/api/users/deleteUser/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('User deleted successfully');
      setReload(reload + 1);
    } 
    catch(error){
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    toast.success('Successfully Logged Out');
    navigate('/admin');
  }

  const handleSubscriptionUpdate = async (userId, newStatus) => {
    try{
      await axios.patch(`${BACKEND_URL}/api/users/updateSubscription/${userId}`, {
        status: newStatus,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                subscription: {
                  status: newStatus,
                },
              }
            : user
        )
      );
      toast.success('Subscription updated successfully');
    } 
    catch(error){
      toast.error('Failed to update subscription');
      console.error(error);
    }
  };

  if(loading){
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <p className="text-lg font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} className="h-16 w-16" alt="Logo" />
            <span className="text-xl font-bold text-primary">Smart Agriculture</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] overflow-y-auto pr-4">
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div>
                        <select
                          value={user.subscription.status}
                          onChange={(e) => handleSubscriptionUpdate(user._id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
