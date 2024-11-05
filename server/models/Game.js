const Player = require('./Player'); // Ensure this import is correct

class Game {
    static games = [];
    static codes = [];
    static publicGames = [];

    constructor() {
        this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.players = [];
        this.chat = [];
        this.connections = [];
        this.inGame = false;
        this.gameEnded = false;
        this.votingOpen = false;
        this.settings = {
            allowPlayersToJoin: true,
            allowSelfVotes: false,
            public: false,
            revealRolesInGame: true,
            revealRolesOnDeath: false,
        };
        this.votes = {};
        this.data = {
            wolfpack: {
                killsAllowed: 1,
            },
        };
        this.dayPhase = {
            phase: null,
            timeStarted: new Date(),
        };

        // Add game into list
        Game.games.push(this);
    }

    static findByCode(code) {
        return Game.games.find(game => game.code === code);
    }

    static get publicGames() {
        return Game.games.filter(game => !game.inGame);
    }

    join(name) {
        const player = new Player(name, this);
        this.players.push(player);
        return player;
    }

    sendMessage(message) {
        this.players.forEach(player => {
            player.send(message);
        });
    }
}

module.exports = Game;