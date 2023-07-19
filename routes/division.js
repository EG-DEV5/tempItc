/** @format */

const express = require('express')

const router = express.Router()

const {
  addDivision,
  getDivision,
  getDivisionById,
  getDivisionsFilter,
} = require('../controllers/divisionController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/addDivision', authenticateUser, addDivision)
router.get('/getDivision', authenticateUser, getDivision)
router.get('/getDivisionsFilter', authenticateUser, getDivisionsFilter)
router.get('/getDivision/:id', authenticateUser, getDivisionById)
module.exports = router
