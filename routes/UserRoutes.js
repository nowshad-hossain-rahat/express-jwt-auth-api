const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// public routes
router.post('/signup', UserController.signup);
router.get('/signin', UserController.signin);

// private routes

module.exports = router;
