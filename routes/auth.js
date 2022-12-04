const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const { authenticateUser } = require('../middleware/authentication');

const {
  register,
  login,
  logout,
} = require('../controllers/authController');

router.post('/register', uploadPhoto.single('image'), register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
