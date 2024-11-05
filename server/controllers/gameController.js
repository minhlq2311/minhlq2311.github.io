const GameService = require('../services/gameService'); // Ensure this import is correct
const { Game } = require('../models/Game');

// Join game
const joinGame = (req, res) => {
    const { name, code } = req.body;
    try {
        if (!name || !code) {
            return res.status(400).send("Name and/or code missing");
        }
        if (name.toLowerCase().includes("moderator") || name.length < 3 || name.length > 15 || !/^[\x00-\x7F]*$/.test(name)) {
            return res.status(403).send("Invalid name format.");
        }

        const response = GameService.joinGame(code, name);
        if (response.failed) {
            return res.status(404).send(response.reason);
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error joining game:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Start game
const createGame = (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send("Name missing");
        }
        if (name.toLowerCase().includes("moderator") || name.length < 3 || name.length > 15 || !/^[\x00-\x7F]*$/.test(name)) {
            return res.status(403).send("Invalid name format.");
        }
        console.log('Starting game with name:', name);
        const response = GameService.newGame(name);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error starting game:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get public games
const getPublicGames = (req, res) => {
    if (Game.games.length === 0) {
        return res.status(404).send("No public games found");
    }
    const publicGames = Game.publicGames.map(game => game.code);
    res.json(publicGames);
};
const getStatus = (req, res) => {
    res.status(200).send("Game werewolf Online is currently up.");
};


module.exports = { joinGame, createGame, getPublicGames, getStatus };