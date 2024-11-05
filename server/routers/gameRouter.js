const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController'); // Ensure this import is correct

// Get public games
router.get('/publicGames', gameController.getPublicGames);

// Start game
router.post('/createGame', gameController.createGame);

// Join game
router.post('/joinGame', gameController.joinGame);

// Check server status
router.get('/status', gameController.getStatus);

module.exports = router;