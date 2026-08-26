const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


// REGISTER
router.post('/register', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();


    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


// LOGIN
router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const correctPassword = await user.matchPassword(password);

    if (!correctPassword) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }


    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }

});


module.exports = router;