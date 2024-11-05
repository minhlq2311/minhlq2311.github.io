// utils/webSocketHandler.js
const WebSocketServer = require('websocket').server;
const { Game } = require('../models/Game');
const GameService = require('../services/GameService');
const deepClone = require('lodash.clonedeep');

function initWebSocket(server) {
    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', function (request) {
        const connection = request.accept(null, request.origin);

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                const data = JSON.parse(message.utf8Data);
                handleGameActions(data, connection);
            }
        });

        connection.on('close', function () {
            console.log('Connection closed');
        });
    });
}

// Function to handle actions
function handleGameActions(data, connection) {
    const { action, code, name, message } = data;

    switch (action) {
        case 'joinGame':
            const joinResponse = GameService.joinGame(Game.games.find(game => game.code === code), name);
            if (joinResponse.failed) {
                connection.sendUTF(JSON.stringify({ action: 'error', message: joinResponse.reason }));
            } else {
                connection.sendUTF(JSON.stringify({ action: 'joinSuccess', player: joinResponse }));
            }
            break;

        case 'startGame':
            const game = Game.games.find(g => g.code === code);
            if (game) {
                GameService.startGame(game, { name });
                connection.sendUTF(JSON.stringify({ action: 'gameStarted' }));
            }
            break;

        case 'sendMessage':
            const gameInstance = Game.games.find(g => g.code === code);
            if (gameInstance) {
                GameService.sendMessage(gameInstance, {
                    action: 'receiveMessage',
                    messages: [{ sender: name, message, date: new Date() }]
                });
            }
            break;

        default:
            connection.sendUTF(JSON.stringify({ action: 'error', message: 'Invalid action' }));
            break;
    }
}

module.exports = { initWebSocket };

