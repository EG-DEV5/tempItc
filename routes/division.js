/** @format */

const express = require('express')
const router = express.Router()

const {
  addDivision,
  getDivision,
} = require('../controllers/divisionController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/addDivision', authenticateUser, addDivision)
router.get('/getDivision', authenticateUser, getDivision)
module.exports = router
