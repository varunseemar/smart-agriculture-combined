const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/getAllUsers', async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.delete('/deleteUser/:userId', async (req,res)=>{
    try{
        const id = req.params.userId;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send("User not found");
        }
        await User.findByIdAndDelete(id);
        res.status(200).send("User deleted Successfully");
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.patch('/updateSubscription/:userId', async (req, res) => {
    try{
      const id = req.params.userId;
      const {status} = req.body;
      const user = await User.findById(id);
      if(!user){
        return res.status(404).send("User not found");
      }
      user.subscription.status = status;
      if(status === 'active'){
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        user.subscription.endDate = oneMonthLater;
      } 
      else{
        user.subscription.endDate = null;
      }
      await user.save();
      res.status(200).send({message: `Subscription updated to '${status}'`,subscription: user.subscription,});
    } 
    catch(err){
      console.error(err);
      res.status(500).send("An error occurred while updating the user role");
    }
});


module.exports = router;