/** @format */

const express = require('express');
const router = express.Router();
const uploadPhoto = require('../utils/multer');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication');

const {
  addUser,
  addCustody,
  getAllUsers,
  getAllTrainers,
  getAllSafetyAdvisor,
  CustodyDetails,
  getCustodyByCity,getallCustodys,updateCustody
} = require('../controllers/userController');

router.post('/addUser',  authenticateUser, uploadPhoto.single('image'), addUser);
router.post('/addCustody', uploadPhoto.single('image'),addCustody);
router.put('/updateCustody/:id', uploadPhoto.single('image'), updateCustody);
router.get(
  '/getAllUsers',
  authenticateUser,
  authorizeRoles('admin'),
  getAllUsers
);
router.get(
  '/getAllTrainers',
  authenticateUser,
  authorizeRoles('admin'),
  getAllTrainers
);
router.get(
    '/getAllSafetyAdvisor',
    authenticateUser,
    authorizeRoles('admin'),
    getAllSafetyAdvisor
  );
router.get(
    '/CustodyDetails',
    authenticateUser,
    authorizeRoles('admin'),
    CustodyDetails
  );
router.get(
    '/getCustodyByCity',
    authenticateUser,
    authorizeRoles('admin'),
    getCustodyByCity
  );
router.get(
    '/getallCustodys',
    authenticateUser,
    authorizeRoles('admin'),
    getallCustodys
  );
// router.post('/reset-password', resetPassword);
// router.post('/forgot-password', forgotPassword);

module.exports = router;
