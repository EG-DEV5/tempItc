const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizeRoles,
  } = require('../middleware/authentication');
const {
    mainDashboard,
    harshAcceleration
  } = require('../controllers/dashboardController');

  router.get('/mainDashboard',authenticateUser, mainDashboard);
  router.get('/harshAcceleration',authenticateUser, harshAcceleration);
  router.get('/overSpeeding',authenticateUser, harshAcceleration);
  router.get('/harshBrake',authenticateUser, harshAcceleration);
  router.get('/seatBelt',authenticateUser, harshAcceleration);
  router.get('/nightDriving',authenticateUser, harshAcceleration);
  router.get('/sharpTurns',authenticateUser, harshAcceleration);


  module.exports = router;

