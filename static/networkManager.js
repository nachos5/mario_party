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

networkManager.all_players_ready = false;
networkManager.error = false;

// we initialise with non-valid information
networkManager.player_info = {uuid: -1, player_id: -1, spriteID: -1};

// gather info about my player
networkManager.socket.on("my player", function(player) {
  // if a player with the same uuid is already playing the game
  if (player.connected) {
    networkManager.error = true;
    g_canvas.style.display = "none";
    document.getElementById("errorMessage").style.display = "block";
    throw 'You are already playing the game!';
  }
  // game is full
  else if (player.game_full) {
    networkManager.error = true;
    g_canvas.style.display = "none";
    document.getElementById("errorMessage2").style.display = "block";
    networkManager.emit('game_is_full', player.uuid);
    throw 'Game full!';
  }

  // everything is fine
  networkManager.player_info = {uuid: player.uuid, player_id: player.player_id, socket_id: player.socket_id,
                                existing_players: player.existing_players, spriteID: player.spriteID};
});

// when we get a message from the server that a new player has joined the game
networkManager.socket.on("new_player", function(player) {
  const client_players = entityManager._players;

  entityManager.generatePlayer({
    uuid: player.uuid,
    my_player: false,
    stars: 0,
    coins: 0,
    player_id: player.player_id,
    spriteID: player.spriteID,
  });

  const client_player = client_players[client_players.length - 1];
  entityManager.initEventPlayer(client_player);
/*
  const spriteID = client_player.spriteID;
  // Lock default sprite
  menuManager.menuPopUp.charSelection[spriteID].lock();*/
});

// player reconnects
networkManager.socket.on("reconnecting", function(data) {
  const player = data.player;
  const disconnected = data.disconnected
  const clientPlayer = entityManager._players[0];
  // ==== MAIN PLAYER ==== //
  clientPlayer.stars = player.stars;
  clientPlayer.coins = player.coins;
  clientPlayer.spriteID = player.spriteID;
  clientPlayer.socket_id = player.socket_id;
  clientPlayer.refresh();
  g_startGame = true;
  menuManager.cleanup();
  // ==== TT PLAYER ==== //
  clientPlayer.tt_player.position = player.tt_player.position;
  // ==== EVENT PLAYER ==== //
  clientPlayer.eventPlayer.cx = player.eventPlayer.cx;
  clientPlayer.eventPlayer.cy = player.eventPlayer.cy;
  networkManager.all_players_ready = true;
  stateManager.updateImageData('scoreRoom');

  networkManager.displayDc(disconnected);
});



networkManager.socket.on("all_players_ready_server", function() {
  networkManager.all_players_ready = true;
  g_startGame = true;
  stateManager.updateImageData('scoreRoom');
});



networkManager.displayDc = function(disconnected) {
  const output = document.getElementById('output');
  output.innerHTML = "";
  for (let d in disconnected) {
   const obj = entityManager._players.find(obj => obj.uuid = disconnected[d]);
   const li = document.createElement("li");
   const text = document.createTextNode(obj.tt_player.name + " is currently disconnected.");
   li.appendChild(text);
   output.appendChild(li);
  }
}
// player disconnects
networkManager.socket.on("disconnected", function(data) {
  entityManager._players.find(obj => obj.uuid == data.uuid).connected = false;
  networkManager.displayDc(data.disconnected);
})



// EXISTING PLAYERS
networkManager.socket.on("existingPlayers", function(data) {
  for (let p in data.players)  {
      if (p != data.my_uuid) {
        // player from server
        const player = data.players[p];
        entityManager.generatePlayer({
          uuid: player.uuid,
          socket_id: player.socket_id,
          my_player: false,
          stars: player.stars,
          coins: player.stars,
          player_id: player.player_id,
          spriteID: player.spriteID
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
    obj.connected = player.connected;
    obj.socket_id = player.socket_id
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

    // ==== STAR ==== //
    entityManager.getStar().setTilePosition(player.star_pos);
  } catch(e) {
    console.log("Player couldn't be updated!");
  }
});


// we are ready for the next turn
networkManager.socket.on("next_turn_server", function(bool) {
  stateManager.nextTurn(bool);
});

// change the sprite of the die
networkManager.socket.on("die_sprite_server", function(rand) {
  try {
    entityManager.getDie().side_sprite(rand);
  } catch(e) {
    // if we are here the die just hasn't spawned yet
  }
});

// game state from server
networkManager.socket.on("game_state_server", function(state) {
  stateManager.gamestate = state;
});

networkManager.socket.on("audio_trigger", function(data) {
  audioManager.playAudio(data.bufferString, data.delayTime, data.loop, data.gainConst);
});

networkManager.socket.on("animation_trigger_server", function(data) {
  entityManager.playAnimation(data);
});

networkManager.socket.on("lock_char", function(data) {
  try {
    const player = entityManager._players.find(obj => obj.uuid == data.uuid);
    player.spriteID = data.id;
    const obj = menuManager.menuPopUp.charSelection.find(obj => obj.id == data.id);
    obj.isLocked = true;
    player.refresh();

    menuManager.updateImageData();
  } catch(e) {}
});



// lets emit our identity
networkManager.emit('init', localStorage.getItem('uuid'));
