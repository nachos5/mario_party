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
      } else {
      // our player
        players[uuid] = {uuid: uuid, player_id: player_id,
                         existing_players: e_players, game_full: all_players_ready && !reconnect};
        player_id++;
      }
      players[uuid].socket_id = socket.id;
      // let our socket know that we are ready to spawn
      socket.emit('my player', players[uuid]);
    });

    // a new player has joined the game
    socket.on('new player', function(player) {
      if (!reconnect) {
        players[player.uuid] = player;
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
        players[player.uuid].socket_id = socket.id;
        players[player.uuid].connected = true;
        delete disconnected[player.uuid];
        socket.emit('reconnecting', {player: players[player.uuid], disconnected: disconnected});
      }
    });

    // send to all clients except sender
    socket.on('update_player', function(player) {
      if (!(player.uuid in disconnected))  {
        players[player.uuid] = player;
        if (player.uuid in disconnected)
          players[player.uuid].connected = false;
        else
          players[player.uuid].connected = true;
        players[player.uuid].isReady = player.isReady;
        players[player.uuid].socket_id = socket.id;
        players[player.uuid].star_pos = starPos;
        players[player.uuid].spriteID = player.spriteID;

        socket.broadcast.emit('update_player_server', player);
        // lock char selection
        if (player.isReady) {
          socket.broadcast.emit('lock_char', {uuid: player.uuid, id: player.spriteID});
        }
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

    socket.on('disconnect', function() {
      let player = null;
      for (let key in players) {
        if (players[key].socket_id == socket.id) {
          player = players[key];
        }
      }
      player.connected = false;
      player.socket_id = socket.id;
      disconnected[player.uuid] = player.uuid;
      socket.broadcast.emit("disconnected", {disconnected: disconnected, uuid: player.uuid});
      console.log("player " + player.uuid + " has disconnected");

      // nobody is connected
      if (!isAnyoneConnected()) {
        const t = setTimeout(function() {
          if (!isAnyoneConnected()) {
            disconnected = {};
            io.close();
            startServer(startServer);
          }
        }, 20000);
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
};

server.startServer(server.startServer);
