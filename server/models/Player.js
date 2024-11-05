const Game = require('./Game');

class Player {
    static players = [];
    static playerIdCounter = 0;

    constructor(name, game) {
        this.id = ++Player.playerIdCounter;
        this.name = name;
        this.game = game;
        this.password = Math.random().toString(36).substring(2);
        this.connections = [];

        this.host = false;
        this.role = null;
        this.chatViewPermissions = [];
        this.chatSendPermission = 'village';
        this.alive = true;
        this.ready = false;
        this.canVote = true;
        this.vote = null;

        Player.players.push(this);
    }

    static findById(id) {
        return Player.players.find(player => player.id === parseInt(id));
    }

    send(messageContent) {
        const message = {
            action: "recieveMessage",
            messages: [{
                sender: this.name,
                date: new Date(),
                message: messageContent,
                permission: this.chatSendPermission,
            }],
        };
        this.game.sendMessage(message);
    }

    joinGame(gameCode) {
        const game = Game.findByCode(gameCode);
        if (game) {
            this.game = game;
            game.players.push(this);
        } else {
            throw new Error('Game not found');
        }
    }

    leaveGame() {
        this.game.players = this.game.players.filter(player => player !== this);
    }

    kickPlayer() {
        this.game.players = this.game.players.filter(player => player !== this);
    }
}

module.exports = Player;