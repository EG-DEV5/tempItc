const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication');

const {
  addAdmin,
  login,
  resetPassword
} = require('../controllers/authController');

router.post('/register', uploadPhoto.single('image'), addAdmin);
router.post('/login', login);
 router.post('/reset-password', authenticateUser,resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
