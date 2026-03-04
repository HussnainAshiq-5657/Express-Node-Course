const express = require('express');
const router = express.Router();
const StudentModel = require('../Models/StudentModel.js');

// Get All Students
router.get('/', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ Message: err.message });
  }
});

// Get a Single Student
router.get('/:id', async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) {
      res.status(404).json({ Message: 'Student Not Found...' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ Message: err.message });
  }
});

// Add a Student
router.post('/', async (req, res) => {
  try {
    const newStudent = await StudentModel.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ Message: err.message });
  }
});

// Update a  Student
router.put('/:id', async (req, res) => {
  try {
    const UpdateStudent = await StudentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!UpdateStudent) {
      res.status(404).json({ Message: 'Student Not Found...' });
    }
    res.json(UpdateStudent);
  } catch (err) {
    res.status(400).json({ Message: err.message });
  }
});

// Get a Single Student
router.delete('/:id', async (req, res) => {
  try {
    const DeleteStudent = await StudentModel.findByIdAndDelete(req.params.id);
    if (!DeleteStudent) {
      res.status(404).json({ Message: 'Student Not Found...' });
    }
    res.json({message:"Student Deleted SuccessFully......"});
  } catch (err) {
    res.status(500).json({ Message: err.message });
  }
});

module.exports = router;
