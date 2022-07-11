const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// public routes
router.post('/signup', UserController.signup);

// private routes

module.exports = router;
