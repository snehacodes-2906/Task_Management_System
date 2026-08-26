const express = require('express');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();


// GET all projects
router.get('/', auth, async (req, res) => {

  try {

    const projects = await Project.find({
      userId: req.user.id
    });

    res.json(projects);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// CREATE project
router.post('/', auth, async (req, res) => {

  try {

    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      userId: req.user.id
    });

    await project.save();

    res.json(project);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// UPDATE project
router.put('/:id', auth, async (req, res) => {

  try {

    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    project.name = name;
    project.description = description;

    await project.save();

    res.json(project);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// DELETE project
router.delete('/:id', auth, async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    await project.deleteOne();

    res.json({
      message: 'Project removed'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


module.exports = router;