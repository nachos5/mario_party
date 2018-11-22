function Server() {};
let server = new Server();

server.startServer = function(startServer) {

  let express = require('express'),
      http = require('http'),
      path = require('path'),
      socketIO = require('socket.io');

  let app = express(),
      server = http.Server(app),
      io = socketIO(server);

  app.set('port', 5000);
  app.use('/static', express.static(__dirname + '/static'));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Routing
  app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/index.html'));
  });

  // Starts the server.
  let port = process.env.PORT || 5000;
  server.listen(port, function() {
    console.log('Starting server');
  });

  // store our players in an object
  let players = {};
  // keep track of disconnected players
  let disconnected = {};
  // keep track of the id of each player (not socket id, used in game logic stuff)
  let player_id = 1;
  // keep track of the game state
  let gamestate = {};
  // star position
  let starPos = null;
  // all players ready
  let all_players_ready = false;
  // currently locked chars (from selection)
  let locked_chars = {};
  // players ready for the minigame to start
  let minigame_ready = [];
  // players ready for next frame
  let ready_for_next_frame = {};

  //setInterval(function() { console.log("nýtt"); for (let p in players) { console.log(players[p].socket_id); }; }, 1000);

  // Add the WebSocket handlers
  io.on('connection', function(socket) {

    // emit game state
    socket.emit('game_state_server', gamestate);

    // existing players
    let e_players = Object.keys(players).length > 0;
    let reconnect = false;
    socket.on('init', function(uuid) {
      if (!all_players_ready) console.log("player " + uuid + " has connected");
      if (uuid in players) {
        // player is reconnecting
        players[uuid].existing_players = e_players;
        reconnect = true;
        locked_chars[uuid] = players[uuid].spriteID;
      } else {
      // our player
        players[uuid] = {uuid: uuid, player_id: player_id, spriteID: player_id - 1,
                         existing_players: e_players, game_full: ((all_players_ready && !reconnect) || (Object.keys(players).length >= 4))};
        locked_chars[uuid] = player_id - 1;
        player_id++;
      }
      players[uuid].socket_id = socket.id;
      // let our socket know that we are ready to spawn
      socket.emit('my player', players[uuid]);

      console.log( "init " + Object.keys(players) );
    });

    // a new player has joined the game
    socket.on('new player', function(player) {
      if (!reconnect) {
        players[player.uuid] = player;
        console.log(players[player.uuid].uuid)
        players[player.uuid].connected = true;
        players[player.uuid].socket_id = socket.id;
      }

      // spawn existing players
      if (e_players) {
        socket.emit('existingPlayers', {players: players, my_uuid: player.uuid});
      }

      if (!reconnect) {
        // send to all clients except sender
        socket.broadcast.emit('new_player', players[player.uuid]);
      } else {
        delete players[player.uuid].socket_id;
        players[player.uuid].socket_id = socket.id;
        players[player.uuid].connected = true;
        delete disconnected[player.uuid];

        socket.emit('reconnecting', {player: players[player.uuid], all_ready: all_players_ready});
        socket.broadcast.emit('reconnecting_anotherPlayer', {player: players[player.uuid], disconnected: disconnected})
      }
      console.log("new player " + Object.keys(players))
    });

    // send to all clients except sender
    socket.on('update_player', function(player) {
      const check = player.uuid in disconnected;

      if (!check)  {
        players[player.uuid] = player;
        players[player.uuid].connected = true;
        players[player.uuid].isReady = player.isReady;

        players[player.uuid].star_pos = starPos;
        //players[player.uuid].uuid = player.uuid;

        players[player.uuid].stars = player.stars;
        players[player.uuid].coins = player.coins;

        players[player.uuid].spriteID = player.spriteID;
        locked_chars[player.uuid] = player.spriteID;

        socket.broadcast.emit('update_player_server', player);
        socket.emit('lock_char', {uuid: player.uuid, spriteID: player.spriteID, locked_chars: locked_chars});
      }
      else {
        players[player.uuid].connected = false;
      }
    });

    // send to all clients except sender that we are ready for the next turn
    socket.on('next_turn', function(bool) {
      socket.broadcast.emit('next_turn_server', bool);
    });

    // send to all clients except sender the state of the die
    socket.on('die_sprite', function(rand) {
      socket.broadcast.emit('die_sprite_server', rand);
    })

    // we get information about the game state
    socket.on('gamestate', function(state) {
      //console.log("gamestate " + Object.keys(players))
      gamestate = state;
      if (!all_players_ready) {
        for (let p in players) {
          if (!players[p].isReady) {
            return; // if a player is not ready we return
          }
        };
        // if we have reached this point, all players are ready!
        all_players_ready = true;
        socket.emit('all_players_ready_server');
        socket.broadcast.emit('all_players_ready_server');
      };
    });

    socket.on('starPos', function(pos) {
      starPos = pos;
    });

    // emit an audio trigger to other sockets
    socket.on('audio', function(data) {
      socket.broadcast.emit('audio_trigger', data);
    });

    // animation trigger
    socket.on('animation_trigger', function(data) {
      socket.broadcast.emit('animation_trigger_server', data);
    });

    socket.on('game_is_full', function(uuid) {
      delete players[uuid];
    });

    // ==== EVENT BLOCKS ==== //
    socket.on('event_blocks_init', function() {
      socket.broadcast.emit('event_blocks_run');
    });

    socket.on('results1', function(data) {
      socket.broadcast.emit('results1_server', data);
    });

    socket.on('results2', function(data) {
      socket.broadcast.emit('results2_server', data);
    });

    socket.on('results3', function(data) {
      socket.broadcast.emit('results3_server', data);
    });

    socket.on('block_winner', function(data) {
      socket.broadcast.emit('block_winner_server', data);
    });

    // ==== COLLECTABLES ==== //
    socket.on('update_collectables', function(data) {
      socket.broadcast.emit('update_collectables_server', data);
      console.log(data);
    });

    // ==== MINIGAME STUFF ==== //

    socket.on('minigame_ready', function(id) {
      minigame_ready.push(id);
      if (minigame_ready.length == Object.keys(players).length) {
        socket.emit("minigame_ready_server");
        socket.broadcast.emit("minigame_ready_server");
        minigame_ready = []; // reset
      }
    });

    socket.on('generate_bullets', function() {
      socket.broadcast.emit('generate_bullets_server');
    });

    // bullet storm
    socket.on('add_to_placements', function(data) {
      socket.broadcast.emit('add_to_placements_server', data);
    });

    socket.on('add_to_placements_lava', function(data) {
      socket.broadcast.emit('add_to_placements_lava_server', data);
    });

    socket.on('reduce_alpha', function() {
      socket.broadcast.emit('reduce_alpha_server');
    });

    // ==== EVENT PLAYER ==== //
    socket.on('event_player_velocity', function(data) {
      let player = null;
      for (let key in players) {
        if (players[key].player_id == data.id)
          player = players[key];
      }
      player.eventPlayer.velX = data.velX;
      player.eventPlayer.velY = data.velY;
      player.eventPlayer.prevVelX = data.prevVelX;
      player.eventPlayer.prevVelY = data.prevVelY;
      socket.broadcast.emit('event_player_velocity_server', data);
    });

    // ==== NETWORK SYNCINC ==== //
    socket.on('network_sync', function(data) {
      console.log("asdasdasd")
      ready_for_next_frame[data] = true;
      if (Object.keys(ready_for_next_frame).length == Object.keys(players).length) {
        socket.emit('ready_for_next_frame_server');
        socket.broadcast.emit('ready_for_next_frame_server');
        ready_for_next_frame = {};
        //console.log("FRAME");
      }
    });



    socket.on('disconnect', function() {
      let player = null;
      for (let key in players) {
        if (players[key].socket_id == socket.id) {
          player = players[key];
        }
      }
      player.socket_id = socket.id;
      disconnected[player.uuid] = player.uuid;
      socket.broadcast.emit("disconnected", player.uuid);
      console.log("player " + player.uuid + " has disconnected");

      delete locked_chars[player.uuid];

      // BAIL ON RECONNECT
      delete players[player.uuid];
      const obj = minigame_ready.find(obj => obj == player.uuid);
      const index = minigame_ready.indexOf(obj);
      minigame_ready.splice(1, index);

      // nobody is connected
      if (!isAnyoneConnected()) {
        const t = setTimeout(function() {
          if (!isAnyoneConnected()) {
            disconnected = {};
            clearInterval(interval);
            clearInterval(interval2);
            clearInterval(interval3);
            clearInterval(debugInterval);
            io.close();
            startServer(startServer);
          }
        }, 0);
      }
    });
  });

  // we check if any players are connected
  function isAnyoneConnected() {
    let anyone_connected = false;
    for (let key in players) {
      if (players[key].connected) {
        anyone_connected = true;
      }
    }
    return anyone_connected;
  };

  let debugInterval = setInterval(function() {
    //console.log(locked_chars);
    //console.log(Object.keys(players).length);
    //console.log(disconnected)
    //console.log(Object.keys(players))
  }, 500);

  // SERVER EMITS TO ALL
  let interval = setInterval(function() {
    let random = [
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
    ]
    io.sockets.emit('random', random);
  }, 500);

  // SERVER EMITS TO ALL
  let interval2 = setInterval(function() {
    let random = [
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
    ]
    io.sockets.emit('random2', random);
  }, 500);

  let interval3 = setInterval(function() {
    let random = Math.random();
    io.sockets.emit('random_longInterval', random);
  }, 5000);
};



server.startServer(server.startServer);
