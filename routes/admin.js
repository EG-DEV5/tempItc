/** @format */

const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const { authenticateUser,authorizePermissions } = require('../middleware/authentication');

const { addUser, addGroup ,getAllUsers,getusersGroup} = require('../controllers/adminController');

router.post('/addUser', uploadPhoto.single('image'), addUser);
router.post('/addGroup', addGroup);
router.get('/getAllUsers',authenticateUser, authorizePermissions('admin'), getAllUsers);
router.get('/getusersGroup',authenticateUser, authorizePermissions('admin'), getusersGroup);
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
