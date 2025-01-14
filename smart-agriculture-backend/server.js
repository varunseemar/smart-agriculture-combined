const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Port = process.env.PORT || 3000;
const fs = require('fs');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin:"*"
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFileSync('log.txt',reqString,{flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    })
    next();
})

app.use((err,req,res,next)=>{
    const errorString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFileSync('error.txt',errorString,{flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    })
    res.status(500).send("Something Went Wrong");
    next();
})

app.listen(Port,()=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>{
        console.log("DB Connected")
    })
    .catch((err)=>{
        console.log(err)
    })
    console.log(`Server Started at post ${Port}`)
})
