const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const auth = require('../middlewares/authMiddleware');

router.post('/addField', async (req, res) => {
  try{
    const { name, location, cropType, area, owner } = req.body;
    if(!name || !location || !cropType || !area || !owner){
      return res.status(400).send('All fields are required');
    }
    const newField = new Field({ fieldName:name, location, cropType, areaSize:area, owner });
    newField.initializeCropHealth();
    newField.initializeYieldHistory();
    await newField.save();
    res.status(200).json({ message: 'Field added successfully', field: newField });
  } 
  catch(error){
    console.error(error);
    res.status(500).send('Server error while adding field');
  }
});

router.get('/getFields/:ownerId', async (req, res) => {
  try{
    const {ownerId} = req.params;
    const fields = await Field.find({ owner: ownerId });
    res.status(200).json(fields);
  } 
  catch(error){
    console.error(error);
    res.status(500).send('Server error while fetching fields');
  }
});

router.delete('/deleteField/:fieldId', async (req, res) => {
  try{
    const { fieldId } = req.params;
    const { owner } = req.body;
    const field = await Field.findOne({ _id: fieldId, owner });
    if(!field){
      return res.status(404).send('Field not found or you are not the owner');
    }
    await Field.findByIdAndDelete(fieldId);
    res.status(200).send('Field deleted successfully');
  } 
  catch(error){
    console.error(error);
    res.status(500).send('Server error while deleting field');
  }
});

module.exports = router;