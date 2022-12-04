/** @format */

const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const { authenticateUser } = require('../middleware/authentication');

const { addUser, addGroup } = require('../controllers/adminController');

router.post('/addUser', uploadPhoto.single('image'), addUser);
router.post('/addGroup', addGroup);
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
