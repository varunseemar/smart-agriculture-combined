const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
      type: String,
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    password:{
      type: String,
      required: true,
    },
    role:{
      type: String,
      enum: ['admin', 'farmer'],
      default: 'farmer',
    },
    createdAt:{
      type: Date,
      default: Date.now,
    },
    subscription:{
      status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
      },
      endDate: Date,
    },
});

module.exports = mongoose.model('User',userSchema);