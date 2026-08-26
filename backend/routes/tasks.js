const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();


// GET all tasks
router.get('/', auth, async (req, res) => {

  try {

    const { status, priority, projectId } = req.query;

    let filter = {
      userId: req.user.id
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    const tasks = await Task
      .find(filter)
      .sort({ deadline: 1 });

    res.json(tasks);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// GET one task
router.get('/:id', auth, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    res.json(task);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// CREATE task
router.post('/', auth, async (req, res) => {

  try {

    const {
      title,
      description,
      priority,
      status,
      deadline,
      projectId
    } = req.body;


    const task = new Task({
      title,
      description,
      priority,
      status,
      deadline,
      projectId,
      userId: req.user.id
    });


    await task.save();

    res.json(task);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// UPDATE task
router.put('/:id', auth, async (req, res) => {

  try {

    const {
      title,
      description,
      priority,
      status,
      deadline,
      projectId
    } = req.body;


    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }


    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }


    task.title = title;
    task.description = description;
    task.priority = priority;
    task.status = status;
    task.deadline = deadline;
    task.projectId = projectId;

    await task.save();

    res.json(task);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// DELETE task
router.delete('/:id', auth, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }


    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }


    await task.deleteOne();

    res.json({
      message: 'Task removed'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


module.exports = router;