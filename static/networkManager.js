// ===============
// NETWORK MANAGER
// ===============

function NetworkManager() {
    this.socket = io();
    this.frameIter = 0;
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

networkManager.startIter = false;
networkManager.readyForNextFrame = true;
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
  console.log("new player");
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
  stateManager.updateImageData();

    // Show message to other players
    let msg = new Message({
     offsetTop   : 0.35,
     offsetRight : 0.06,
     offsetBot   : 0.35,
     offsetLeft  : 0.06,
     string      : ' A NEW PLAYER  / HAS JOINED',
     lines       : 2,
     p1SpriteID  : player.player_id,
     time        : 5,
    })

    stateManager.newMessage(msg);
/*
  const spriteID = client_player.spriteID;
  // Lock default sprite
  menuManager.menuPopUp.charSelection[spriteID].lock();*/
});

// player reconnects
networkManager.socket.on("reconnecting", function(data) {
  console.log("reconnecting");
  const player = data.player;
  const ready = data.all_ready;
  console.log(ready)
  const clientPlayer = entityManager._players[0];

  // ==== MAIN PLAYER ==== //
  clientPlayer.stars = player.stars;
  clientPlayer.coins = player.coins;
  clientPlayer.spriteID = player.spriteID;
  console.log(clientPlayer)
  clientPlayer.socket_id = player.socket_id;
  clientPlayer.refresh();
  if (ready) {
    g_startGame = true;
    menuManager.cleanup();
  }
  // ==== TT PLAYER ==== //
  clientPlayer.tt_player.position = player.tt_player.position;
  // ==== EVENT PLAYER ==== //
  clientPlayer.eventPlayer.cx = player.eventPlayer.cx;
  clientPlayer.eventPlayer.cy = player.eventPlayer.cy;
  networkManager.all_players_ready = true;
  stateManager.updateImageData();

  //console.log(disconnected)
  //networkManager.displayDc(disconnected);
});

networkManager.socket.on("reconnecting_anotherPlayer", function(data) {
  const player = data.player;
  const disconnected = data.disconnected;
  const obj = entityManager._players.find(obj => obj.uuid = player.uuid);
  obj.socket_id = player.socket_id;

  // Show message to other players
  let msg = new Message({
    offsetTop   : 0.35,
    offsetRight : 0.06,
    offsetBot   : 0.35,
    offsetLeft  : 0.06,
    string      : ' # IS CURRENTLY/ RECONNECTING',
    lines       : 2,
    p1SpriteID  : obj.spriteID,
    time        : 5,
   })

  stateManager.newMessage(msg);

  networkManager.displayDc(disconnected);
});


networkManager.socket.on("all_players_ready_server", function() {
  entityManager._players.sort(function(x, y) {
    return x.player_id - y.player_id;
  });
  networkManager.all_players_ready = true;
  g_startGame = true;

  stateManager.newGame();
  stateManager.updatePlayerSprites();
  stateManager.updateImageData();
  stateManager.updateInfo();

  audioManager.fadeOutPlayNext('map', 2);

  networkManager.startIter = true;
});



networkManager.displayDc = function(player) {
  const output = document.getElementById('output');
  output.innerHTML = "";
  //for (let d in disconnected) {
   //const obj = entityManager._players.find(obj => obj.uuid == disconnected[d]);

   // Show message to other players
   let msg = new Message({
    offsetTop   : 0.35,
    offsetRight : 0.06,
    offsetBot   : 0.35,
    offsetLeft  : 0.06,
    string      : ' # HAS/ DISCONNECTED',
    lines       : 2,
    p1SpriteID  : player.spriteID,
    time        : 5,
   })

   stateManager.newMessage(msg);

  //}
}
// player disconnects P.S. BAILED ON RECONNECT
networkManager.socket.on("disconnected", function(uuid) {
  const player = entityManager._players.find(obj => obj.uuid == uuid);
  networkManager.displayDc(player);
  const index = entityManager._players.indexOf(player);
  entityManager._players.splice(1, index);
  stateManager.updateImageData('scoreRoom');
})



// EXISTING PLAYERS
networkManager.socket.on("existingPlayers", function(data) {
  for (let p in data.players)  {
      if (p != data.my_uuid) {
        console.log("existing")
        // player from server
        const player = data.players[p];
        entityManager.generatePlayer({
          uuid: player.uuid,
          socket_id: player.socket_id,
          my_player: false,
          stars: player.stars,
          coins: player.stars,
          player_id: player.player_id,
          spriteID: player.spriteID,
        });
    }
  };

  networkManager.next();
});


// UPDATING PLAYER STUFF
updateIter = 0;
networkManager.socket.on("update_player_server", function(player) {

  //for (let i in entityManager._players) console.log(entityManager._players[i].uuid);
  let obj = entityManager._players.find(obj => obj.uuid == player.uuid);
  //console.log(obj)

  try {
    if (updateIter == 10) {
      stateManager.updateImageData('scoreRoom');
      updateIter = -1;
    }
    updateIter++;

    // ==== MAIN PLAYER ==== //
    obj.connected = player.connected;
    obj.spriteID = player.spriteID;

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
    //console.log(e.stack);
  }
});

// UPDATING COLLECTABLES
networkManager.socket.on("update_collectables_server", function(player) {
  const client_player = entityManager._players.find(obj => obj.uuid == player.uuid);
  client_player.stars = player.stars;
  client_player.coins = player.coins;
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
  animationManager.generateMapAnimation(data.animation, data.times);
});

networkManager.socket.on("lock_char", function(data) {
  try {
    //  unlock all
    for (let c in menuManager.menuPopUp.charSelection) {
      menuManager.menuPopUp.charSelection[c].isLocked = false;
      menuManager.menuPopUp.charSelection[c].isSelected = false;
    }

    const players = entityManager._players;
    const my_player = entityManager.getMyPlayer();
    const chars = data.locked_chars;

    // lock relevant stuff
    for (let c in chars) {
      //console.log(c + " " + Math.random())
      const sprite_id = chars[c];
      menuManager.menuPopUp.charSelection[sprite_id].isLocked = true;

      if (c == my_player.uuid)
        menuManager.menuPopUp.charSelection[sprite_id].isSelected = true;
    }
    menuManager.updateImageData();
  } catch(e) {
    console.log(e.stack);
  }
});

// ==== EVENT BLOCKS ==== //
networkManager.socket.on('event_blocks_run', function() {
  eventManager.blocksEvent();
});

networkManager.socket.on("results1_server", function(results1) {
  try {
    entityManager._eventBlocks[0].results1_server_bool = true;
    entityManager._eventBlocks[0].results1_server = results1;
  } catch(e) {};
});

networkManager.socket.on("results2_server", function(results2) {
  try {
    entityManager._eventBlocks[0].results2_server_bool = true;
    entityManager._eventBlocks[0].results2_server = results2;
  } catch(e) {};
});

networkManager.socket.on("results3_server", function(results3) {
  try {
    entityManager._eventBlocks[0].results3_server_bool = true;
    entityManager._eventBlocks[0].results3_server = results3;
  } catch(e) {};
});

networkManager.socket.on("block_winner_server", function(winner) {
  try {
    entityManager._eventBlocks[0].block2.winner = winner;
  } catch(e) {};
});

// ==== DATA CREATED BY SERVER ==== //
networkManager.socket.on("random", function(data) {
  networkManager.random = data;
});

networkManager.socket.on("random2", function(data) {
  networkManager.random2 = data;
});

networkManager.socket.on("random_longInterval", function(data) {
  networkManager.random_longInterval = data;
});





// ==== MINIGAME STUFF ==== //
networkManager.socket.on("minigame_ready_server", function() {
  minigameManager.minigame_ready = true;
});

networkManager.socket.on('generate_bullets_server', function() {
  bulletStorm.generateBulletBill(5);
});

networkManager.socket.on('add_to_placements_server', function(id) {
  bulletStorm.game.addToPlacements(id);
})

networkManager.socket.on('add_to_placements_lava_server', function(id) {
  floorIsLava.game.addToPlacements(id);
})

networkManager.socket.on('reduce_alpha_server', function() {
  floorIsLava.game.gameFloor.reduceAlpha();
});


// SYNCING STUFF
networkManager.socket.on('ready_for_next_frame_server', function() {
  networkManager.readyForNextFrame = true;
});




// lets emit our identity
networkManager.emit('init', localStorage.getItem('uuid'));
