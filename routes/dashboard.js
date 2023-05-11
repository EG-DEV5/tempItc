/** @format */

const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication');
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
} = require('../controllers/dashboardController');

router.get('/mainDashboard', authenticateUser, mainDashboard);
router.get('/violations', authenticateUser, vehicleViolations);
router.get('/topDrivers', authenticateUser, bestDrivers);
router.get('/harshAcceleration', authenticateUser, harshAcceleration);
router.get('/overSpeeding', authenticateUser, IsOverSpeed);
router.get('/harshBrake', authenticateUser, HarshBreaking);
router.get('/seatBelt', authenticateUser, seatBelt);
router.get('/nightDriving', authenticateUser, nightDriving);
router.get('/sharpTurns', authenticateUser, sharpTurns);

module.exports = router;
