const express = require('express')
const router = express.Router()
const uploadPhoto = require('../utils/multer')
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication')

const {
  addAdmin,
  login,
  resetPassword,
  forgotPassword,
  updatePassword,
} = require('../controllers/authController')

router.post('/register', uploadPhoto.single('image'), addAdmin)
router.post('/login', login)
// router.post('/reset-password', authenticateUser, resetPassword)
// router.post('/forgot-password', forgotPassword);

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:otp', resetPassword)
router.patch('/updateMyPassword', authenticateUser, updatePassword)

module.exports = router
