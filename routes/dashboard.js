/** @format */

const express = require('express')

const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const {
  mainDashboard,
  harshAcceleration,
  IsOverSpeed,
  nightDriving,
  sharpTurns,
  seatBelt,
  HarshBreaking,
  vehicleViolations,
  bestDrivers,
  getRatings,
  getRatingsById,
  vehicleViolationsById,
  weeklyTrends,
} = require('../controllers/dashboardController')

router.get('/mainDashboard', authenticateUser, mainDashboard)
router.get('/weeklyTrends', authenticateUser, weeklyTrends)
router.get('/ratings', authenticateUser, getRatings)
router.get('/ratings/:id', authenticateUser, getRatingsById)
router.get('/violations', authenticateUser, vehicleViolations)
router.get('/vechViolations', authenticateUser, vehicleViolationsById)
router.get('/topDrivers', authenticateUser, bestDrivers)
router.get('/harshAcceleration', authenticateUser, harshAcceleration)
router.get('/overSpeeding', authenticateUser, IsOverSpeed)
router.get('/harshBrake', authenticateUser, HarshBreaking)
router.get('/seatBelt', authenticateUser, seatBelt)
router.get('/nightDriving', authenticateUser, nightDriving)
router.get('/sharpTurns', authenticateUser, sharpTurns)

module.exports = router
