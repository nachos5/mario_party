// ================= //
// communicator between server and client
// ================ //

// constructor
function NetworkManager() {
    var WebSocketServer = {
      socket: null,
      connect: function() {
        var self = this;
        if (self.socket) {
          self.socket.destroy();
          delete self.socket;
          self.socket = null;
        }
        this.socket = io.connect('http://localhost:5000', {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity
        });
        this.socket.on('connect', function() {
          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', Math.random().toString(12));
          }
        });
        this.socket.on('disconnect', function() {
          console.log('disconnected from server');
          window.setTimeout('app.connect()', 5000);
        });
        return this.socket;
      }
    }

    this.socket = WebSocketServer.connect();
}

// emit data to the server
NetworkManager.prototype.emit = function(message, data) {
  this.socket.emit(message, data);
}

// initialize the manager
let networkManager = new NetworkManager();

// we initialise with non-valid information
networkManager.player_info = {uuid: -1, player_id: -1};

// gather info about my player
networkManager.socket.on("my player", function(player) {
  networkManager.player_info = {uuid: player.uuid,
                                player_id: player.player_id,
                                existing_players: player.existing_players};
});

// when we get a message from the server that a new player has joined the game
networkManager.socket.on("new_player", function(player) {
  entityManager.generatePlayer({
    cx: default_coords.cx,
    cy: default_coords.cy,
    uuid: player.uuid,
    my_player: false,

    // Added
    stars: 0,
    coins: 0,
    player_id: player.player_id
  });
});

// player reconnects
networkManager.socket.on("reconnecting", function(player) {
  const clientPlayer = entityManager._players[0];
  clientPlayer.tt_player.position = player.tt_player.position;
  clientPlayer.cx = player.cx;
  clientPlayer.cy = player.cy;
  clientPlayer.stars = player.stars;
  clientPlayer.coins = player.coins;
});

// player disconnects
networkManager.socket.on("disconnect_from_server", function(id) {
  // find the player by id
  const obj = entityManager._players.find(obj => obj.uuid == id);
  const index = entityManager._players.indexOf(obj);
  // remove
  entityManager._players.splice(index, 1);
})

// EXISTING PLAYERS
networkManager.socket.on("existingPlayers", function(data) {
  for (let p in data.players)  {
      if (p != data.my_uuid) {
        // player from server
        const player = data.players[p];
        entityManager.generatePlayer({
          cx: default_coords.cx,
          cy: default_coords.cy,
          uuid: player.uuid,
          my_player: false,

          // Added
          stars: player.stars,
          coins: player.stars,
          player_id: player.player_id
        });
    }
  };

  networkManager.next();
});


// PLAYER POSITION
networkManager.socket.on("update_player_server", function(player) {
  // lets find the player with the same id
  let obj = entityManager._players.find(obj => obj.uuid == player.uuid);
  try {
    // set position
    obj.setPos(player.cx, player.cy);
    // set tabletop position
    mapManager.setPosition(obj.tt_player, {row: player.tt_player.position.row,
                                           column: player.tt_player.position.column});
    // other stuff
    obj.coint = player.coins;
    obj.stars = player.stars;
  } catch(e) {}
});


// we are ready for the next turn
networkManager.socket.on("next_turn_server", function() {
  // we handle events first
  stateManager.nextTurn();
});

// change the sprite of the die
networkManager.socket.on("die_sprite_server", function(rand) {
  entityManager.getDie().side_sprite(rand);
});

// game state from server
networkManager.socket.on("game_state_server", function(state) {
  stateManager.gamestate = state;
});



// lets emit our identity
networkManager.emit('init', localStorage.getItem('uuid'));
