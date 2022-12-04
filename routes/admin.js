/** @format */

const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  addUser,
  addGroup,
  getAllUsers,
  getAllTrainers,
  getAllSafetyAdvisor,
  groupDetails,
  getGroupByItc,getallGroups
} = require('../controllers/adminController');

router.post('/addUser', uploadPhoto.single('image'), addUser);
router.post('/addGroup', addGroup);
router.get(
  '/getAllUsers',
  authenticateUser,
  authorizePermissions('admin'),
  getAllUsers
);
router.get(
  '/getAllTrainers',
  authenticateUser,
  authorizePermissions('admin'),
  getAllTrainers
);
router.get(
    '/getAllSafetyAdvisor',
    authenticateUser,
    authorizePermissions('admin'),
    getAllSafetyAdvisor
  );
router.get(
    '/groupDetails',
    authenticateUser,
    authorizePermissions('admin'),
    groupDetails
  );
router.get(
    '/getGroupByItc',
    authenticateUser,
    authorizePermissions('admin'),
    getGroupByItc
  );
router.get(
    '/getallGroups',
    authenticateUser,
    authorizePermissions('admin'),
    getallGroups
  );
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
