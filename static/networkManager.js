// ===============
// NETWORK MANAGER
// ===============

function NetworkManager() {
    this.socket = io();
}

// ====
// EMIT
// ====

// emit data to the server
NetworkManager.prototype.emit = function(message, data) {
  this.socket.emit(message, data);
}

// initialize the manager
let networkManager = new NetworkManager();

networkManager.error = false;

// we initialise with non-valid information
networkManager.player_info = {uuid: -1, player_id: -1};

// gather info about my player
networkManager.socket.on("my player", function(player) {
  // if a player with the same uuid is already playing the game
  if (player.connected) {
    networkManager.error = true;
    g_canvas.style.display = "none";
    document.getElementById("errorMessage").style.display = "block";
    throw 'You are already playing the game!';
  };

  // if not
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
  
  const client_players = entityManager._players;
  const client_player = client_players[client_players.length - 1];
  entityManager.initEventPlayer(client_player);
});

// player reconnects
networkManager.socket.on("reconnecting", function(player) {
  const clientPlayer = entityManager._players[0];
  // ==== MAIN PLAYER ==== //
  clientPlayer.cx = player.cx;
  clientPlayer.cy = player.cy;
  clientPlayer.stars = player.stars;
  clientPlayer.coins = player.coins;
  // ==== TT PLAYER ==== //
  clientPlayer.tt_player.position = player.tt_player.position;
  // ==== EVENT PLAYER ==== //
  clientPlayer.eventPlayer.cx = player.eventPlayer.cx;
  clientPlayer.eventPlayer.cy = player.eventPlayer.cy;
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
          cx: player.cx,
          cy: player.cy,
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


// UPDATING PLAYER STUFF
networkManager.socket.on("update_player_server", function(player) {
  // lets find the player with the same id
  let obj = entityManager._players.find(obj => obj.uuid == player.uuid);

  try {
    // ==== MAIN PLAYER ==== //
    // position
    obj.setPos(player.cx, player.cy);
    // scoreboard stuff
    obj.coins = player.coins;
    obj.stars = player.stars;


    // ==== TABLETOP PLAYER ==== //
    // position
    mapManager.setPosition(obj.tt_player, {row: player.tt_player.position.row,
                                           column: player.tt_player.position.column});
    // alpha (pipe stuff)
    obj.tt_player.alpha = player.tt_player.alpha;


    // ==== EVENT PLAYER ==== //
    obj.eventPlayer.cx = player.eventPlayer.cx;
    obj.eventPlayer.cy = player.eventPlayer.cy;

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
