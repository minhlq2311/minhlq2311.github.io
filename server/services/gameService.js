const Player = require('../models/Player'); // Ensure this import is correct
const Roles = require('../models/Roles');
const Game = require('../models/Game'); // Ensure this import is correct
const deepClone = require('lodash.clonedeep');

class GameService {
    static newGame(name) {
        try {
            const newGame = new Game();
            const player = new Player(name, newGame);
            player.host = true;

            newGame.sendMessage({
                action: "recieveMessage",
                messages: [{
                    sender: "Moderator",
                    date: new Date(),
                    message: `${player.name} has opened the game room. When you have at least five players, which you can invite by giving them the code "${newGame.code}", use <c>!start</c> to start the game.`,
                    permission: "village"
                }]
            });
            console.log('New game created with code:', newGame.code);
            console.log('Host:', player.name);
            return { code: newGame.code, password: player.password };
        } catch (error) {
            throw new Error('Error creating new game: ' + error.message);
        }
    }

    static joinGame(code, name) {
        const game = Game.findByCode(code);
        if (!game) {
            return { failed: true, reason: 'Game not found' };
        }
        const player = new Player(name, game);
        game.players.push(player);
        return { code: game.code, playerId: player.id, playerPassword: player.password };
    }

    static startGame(game, player) {
        if (Game.publicGames.includes(game)) Game.publicGames.splice(Game.publicGames.indexOf(game), 1);

        game.inGame = true;
        game.dayPhase = { phase: "day", timeStarted: new Date() };

        game.chat = [];
        game.sendMessage({ action: "clearChat" });

        game.sendMessage({
            action: "recieveMessage",
            messages: [{
                sender: "Moderator",
                date: new Date().toString(),
                message: `${player.name} has started the game.`,
                permission: "village"
            }]
        });
    }


}

module.exports = GameService;