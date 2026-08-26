const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();


router.get('/', auth, async (req, res) => {

  try {

    const tasks = await Task.find({
      userId: req.user.id
    });


    const total = tasks.length;

    const completed = tasks.filter(
      task => task.status === 'Completed'
    ).length;

    const pending = tasks.filter(
      task => task.status === 'Pending'
    ).length;

    const inProgress = tasks.filter(
      task => task.status === 'In Progress'
    ).length;


    const high = tasks.filter(
      task => task.priority === 'High'
    ).length;

    const medium = tasks.filter(
      task => task.priority === 'Medium'
    ).length;

    const low = tasks.filter(
      task => task.priority === 'Low'
    ).length;


    let completionRate = 0;

    if (total > 0) {
      completionRate = (completed / total) * 100;
    }


    res.json({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,

      highPriority: high,
      mediumPriority: medium,
      lowPriority: low,

      completionRate: completionRate.toFixed(2)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


module.exports = router;