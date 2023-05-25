/** @format */

const express = require('express')
const router = express.Router()
const uploadPhoto = require('../utils/multer')
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication')

const {
  addUser,
  addCustody,
  getAllUsers,
  getAllTrainers,
  getAllSafetyAdvisor,
  CustodyDetails,
  getsafteyAdvisorCustody,
  getCustodyByCity,
  getallCustodys,
  updateCustody,
  getProfile,
  getHomeStatistics,
  addRequest,
  updateUser,
  resForRequest,
  freeSaftey,
  getPendingTrainers,
  Vehicle,
  deleteUser,
  deleteCustody,
  getAllCities,
} = require('../controllers/userController')

router.post('/addUser', authenticateUser, uploadPhoto.single('image'), addUser)
router.post('/addCustody', uploadPhoto.single('image'), addCustody)
router.delete('/deleteUser/:id', authenticateUser, deleteUser)
router.delete('/deleteCustody/:id', authenticateUser, deleteCustody)
router.put(
  '/updateCustody/:id',
  authenticateUser,
  uploadPhoto.single('image'),
  updateCustody
)
router.put(
  '/updateUser/:id',
  authenticateUser,
  uploadPhoto.single('image'),
  updateUser
)
router.get(
  '/getAllUsers',
  authenticateUser,
  authorizeRoles('admin'),
  getAllUsers
)
router.get(
  '/getAllTrainers',
  authenticateUser,
  authorizeRoles('admin'),
  getAllTrainers
)
router.get(
  '/getAllSafetyAdvisor',
  authenticateUser,
  authorizeRoles('admin'),
  getAllSafetyAdvisor
)
router.get(
  '/CustodyDetails/:id',
  authenticateUser,
  authorizeRoles('admin'),
  CustodyDetails
)
router.get(
  '/getCustodyByCity',
  authenticateUser,
  authorizeRoles('admin'),
  getCustodyByCity
)
router.get(
  '/getallCustodys',
  authenticateUser,
  authorizeRoles('admin', 'safety-advisor'),
  getallCustodys
)
router.get(
  '/getCities',
  authenticateUser,
  authorizeRoles('admin', 'safety-advisor'),
  getAllCities
)
router.get('/saftey-custody', authenticateUser, getsafteyAdvisorCustody)
router.get('/profile', authenticateUser, getProfile)
router.get('/getHomeStatistics', getHomeStatistics)
router.get('/free-Saftey', freeSaftey)
router.post(
  '/addRequest',
  authenticateUser,
  authorizeRoles('admin', 'safety-advisor'),
  addRequest
)
router.post(
  '/resForRequest',
  authenticateUser,
  authorizeRoles('admin', 'safety-advisor'),
  resForRequest
)
router.get('/getPendingTrainers', getPendingTrainers)
router.get('/Vehicle', authenticateUser, Vehicle)
// router.post('/reset-password', resetPassword);
//  router.post('/forgot-password', forgotPassword);

module.exports = router
