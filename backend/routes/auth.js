const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


// REGISTER
router.post('/register', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Check if fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all fields'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Do not create token here
    res.status(201).json({
      message: 'Registration successful. Please login.'
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

    // Find user
    const user = await User.findOne({ email });

    console.log("LOGIN EMAIL:", email);
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const correctPassword = await user.matchPassword(password);
    console.log("PASSWORD MATCH:", correctPassword);
    if (!correctPassword) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token
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