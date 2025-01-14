const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/Register', async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).send("User already Exists.")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const user = new User({
            name,
            email,
            password:hashPassword,
        });
        await user.save();
        res.status(200).send('Successful')

    }
    catch(err){
        throw new Error(err.message);
    }

})

router.post('/Login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await User.findOne({email})
        
        if(!userExist){
            return res.status(400).send("Wrong Email or Password")
        }
        if(userExist.role === 'admin'){
            return res.status(400).send("Acces Denied")
        }
        const validPass = await bcrypt.compare(password, userExist.password);
        if(!validPass){
            return res.status(400).send("Wrong Email or Password")
        }
        const token = jwt.sign({_id:userExist._id},process.env.JWTOKEN);
        res.status(200).json({
            name:userExist.name,
            email:userExist.email,
            token,
        })

    }
    catch(err){
        throw new Error(err.message);
    }

})

router.post('/AdminLogin', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await User.findOne({email})
        
        if(!userExist){
            return res.status(400).send("Wrong Email or Password")
        }
        if(userExist.role === 'farmer'){
            return res.status(400).send("Acces Denied")
        }
        const validPass = bcrypt.compareSync(password,userExist.password)
        if(!validPass){
            return res.status(400).send("Wrong Email or Password")
        }
        const token = jwt.sign({_id:userExist._id},process.env.JWTOKEN);
        res.status(200).json({
            name:userExist.name,
            email:userExist.email,
            token,
        })

    }
    catch(err){
        throw new Error(err.message);
    }

})

module.exports = router;