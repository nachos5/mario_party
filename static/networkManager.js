// ================= //
// communicator between server and client
// ================ //

// constructor
function NetworkManager() {
  this.socket = io();
}

// emit data to the server
NetworkManager.prototype.emit = function(message, data) {
  this.socket.emit(message, data);
}

// initialize the manager
let networkManager = new NetworkManager();

// we initialise with non-valid information
networkManager.player_info = {socket_id: -1, player_id: -1};

// gather info about my player
networkManager.socket.on("my player", function(player) {
  networkManager.player_info = {socket_id: player.socket_id,
                                player_id: player.player_id,
                                existing_players: player.existing_players};
});

// when we get a message from the server that a new player has joined the game
networkManager.socket.on("new_player", function(data) {
    entityManager.generatePlayer({
      cx: 200,
      cy: 200,
      socket_id: data.socket_id,
      my_player: false,

      // Added
      stars: 0,
      coins: 0,
      player_id: data.player_id
    });
});

// player disconnects
networkManager.socket.on("disconnect_from_server", function(id) {
  // find the player by id
  const obj = entityManager._players.find(obj => obj.socket_id == id);
  const index = entityManager._players.indexOf(obj);
  // remove
  entityManager._players.splice(index, 1);
})

// EXISTING PLAYERS
networkManager.socket.on("existingPlayers", function(data) {
  for (let p in data.players)  {
      if (p != data.my_socket_id) {
      // socket id for each player
      const player = data.players[p];
      entityManager.generatePlayer({
          cx: 200,
          cy: 200,
          socket_id: player.socket_id,
          my_player: false,

          // Added
          stars: 0,
          coins: 0,
          player_id: player.player_id
      });
    }
  };

  networkManager.next();
});


// PLAYER POSITION
networkManager.socket.on("position_server", function(player) {
  // lets find the player with the same id
  let obj = entityManager._players.find(obj => obj.socket_id == player.socket_id);
  try {
    // set position
    obj.setPos(player.cx, player.cy);
    // set tabletop position
    mapManager.setPosition(obj.tt_player, {row: player.tt_pos.row, column: player.tt_pos.column});
  } catch(e) {}
});


// we are ready for the next turn
networkManager.socket.on("next_turn_server", function() {
  // we handle events first
  stateManager.handleEvents();
});
