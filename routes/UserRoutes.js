const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const Auth = require('../middlewares/auth');

// public routes
router.post('/signup', UserController.signup);
router.get('/signin', UserController.signin);

// private routes
router.post('/change-password', Auth.isValidUser, UserController.changePassword);

module.exports = router;
