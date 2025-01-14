const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  fieldName:{
    type: String,
    required: true,
  },
  owner:{
    type: String,
    required: true,
  },
  location:{
    type: String,
    required: true,
  },
  cropType:{
    type: String,
    required: true,
  },
  areaSize:{
    type: Number,
    required: true,
  },
  cropHealth:[
    {
      day:{
        type: String,
        required: true,
      },
      value:{
        type: Number,
        min: 60,
        max: 100,
      },
    },
  ],
  yieldHistory:[
    {
      month:{
        type: String,
        required: true,
      },
      yield:{
        type: Number,
        min: 60,
        max: 100,
      },
    },
  ],
  createdAt:{
    type: Date,
    default: Date.now,
  },
});

fieldSchema.methods.initializeCropHealth = function (){
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cropHealth = daysOfWeek.map((day) => ({
    day,
    value: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
  }));
  this.cropHealth = cropHealth;
};

fieldSchema.methods.initializeYieldHistory = function (){
  const months = [];
  const currentDate = new Date();
  for(let i = 0; i < 6; i++){
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' }).slice(0, 3);
    months.push({
      month: monthName,
      yield: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
    });
  }
  this.yieldHistory = months.reverse();
};

module.exports = mongoose.model('Field', fieldSchema);