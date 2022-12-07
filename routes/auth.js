const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const { auth,isAdmin } = require('../middleware/authentication');

const {
  addAdmin,
  login,
} = require('../controllers/authController');

router.post('/register', uploadPhoto.single('image'), addAdmin);
router.post('/login', login);
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
