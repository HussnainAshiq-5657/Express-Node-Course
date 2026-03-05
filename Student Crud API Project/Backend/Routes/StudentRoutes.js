const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StudentModel = require('../Models/StudentModel.js');

// Multer File Uploading

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../Uploads'));
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const fileFilter = (res, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only Images are Allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

// Get All Students
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';

    const query = {
      $or: [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
      ],
    };
    const students = await StudentModel.find(query);
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
router.post('/', upload.single('profile_pic'), async (req, res) => {
  try {
    // const newStudent = await StudentModel.create(req.body);
    const student = new StudentModel(req.body);
    if (req.file) {
      student.profile_pic = req.file.filename;
    }
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ Message: err.message });
  }
});

// Update a student
router.put('/:id', upload.single('profile_pic'), async (req, res) => {
  try {
    const existingStudent = await StudentModel.findById(req.params.id);

    if (!existingStudent) {
      if (req.file) {
        const filepath = path.join(__dirname, '../Uploads', req.file.filename);
        fs.unlink(filepath, (err) => {
          if (err) console.log('Failed to Delete : ', err);
        });
      }
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.file) {
      if (existingStudent.profile_pic) {
        const oldImagePath = path.join(__dirname, '../Uploads', existingStudent.profile_pic);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log('Failed to Delete : ', err);
        });
      }

      req.body.profile_pic = req.file.filename;
    }

    const updatedStudent = await StudentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete a  Student
router.delete('/:id', async (req, res) => {
  try {
    const DeleteStudent = await StudentModel.findByIdAndDelete(req.params.id);
    if (!DeleteStudent) {
      res.status(404).json({ Message: 'Student Not Found...' });
    }
    if (DeleteStudent.profile_pic) {
      const filePath = path.join(__dirname, '../Uploads', DeleteStudent.profile_pic);
      fs.unlink(filePath, (err) => {
        if (err) console.log('Failed to Delete : ', err);
      });
    }
    res.json({ message: 'Student Deleted SuccessFully......' });
  } catch (err) {
    res.status(500).json({ Message: err.message });
  }
});

module.exports = router;
