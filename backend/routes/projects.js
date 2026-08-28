// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// GET all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, deadline } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Project description is required' });
    }
    if (!deadline) {
      return res.status(400).json({ message: 'Project deadline is required' });
    }

    const project = new Project({
      name,
      description,
      deadline,
      userId: req.user.id
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
});

// UPDATE project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, deadline, status } = req.body;

    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;
    
    if (status) {
      project.status = status;
      if (status === 'Completed') {
        project.completedAt = new Date();
      } else {
        project.completedAt = null;
      }
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// TOGGLE project completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (project.status === 'Completed') {
      project.status = 'Active';
      project.completedAt = null;
    } else {
      project.status = 'Completed';
      project.completedAt = new Date();
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;