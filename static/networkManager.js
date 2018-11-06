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

// when we get a message from the server that a new player has joined the game
networkManager.socket.on("new_player", function(id) {
    entityManager.generatePlayer({
      cx: 200,
      cy: 200,
      id: id,
      my_player: false
    });
});

// player disconnects
networkManager.socket.on("disconnect_from_server", function(id) {
  // find the player by id
  const obj = entityManager._players.find(obj => obj.id == id);
  const index = entityManager._players.indexOf(obj);
  // remove
  entityManager._players.splice(index, 1);
})

// EXISTING PLAYERS
networkManager.socket.on("existingPlayers", function(data) {
  for (let p in data)  {
    // socket id for each player
    const id = data[p];
    entityManager.generatePlayer({
        cx: 200,
        cy: 200,
        id: id,
        my_player: false
    });
  }
})


// PLAYER POSITION
networkManager.socket.on("position_server", function(player) {
  // lets find the player with the same id
  let obj = entityManager._players.find(obj => obj.id == player.id);
  try {
    // set position
    obj.setPos(player.cx, player.cy);
    // set tabletop position
    mapManager.setPosition(obj.tt_player, player.tt_pos.column, player.tt_pos.row);
  } catch(e) {}
});
