function Server() {};
let server = new Server();

server.startServer = function() {

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
  // keep track of the id of each player (not socket id, used in game logic stuff)
  let player_id = 1;
  // keep track of the game state
  let gamestate = {};

  let startServer = this.startServer;

  // Add the WebSocket handlers
  io.on('connection', function(socket) {
    // emit game state
    socket.emit('game_state_server', gamestate);
    // existing players
    let e_players = Object.keys(players).length > 0;
    let reconnect = false;
    socket.on('init', function(uuid) {
      console.log("player " + uuid + " has connected");
      if (uuid in players) {
        // player is reconnecting
        players[uuid].existing_players = e_players;
        reconnect = true;
      } else {
      // our player
        players[uuid] = {uuid: uuid, player_id: player_id,
                         existing_players: e_players};
        player_id++;
      }
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
        players[player.uuid].connected = true;
        socket.emit('reconnecting', players[player.uuid]);
      }
    });

    // send to all clients except sender
    socket.on('update_player', function(player) {
      players[player.uuid] = player;
      players[player.uuid].connected = true;
      players[player.uuid].socket_id = socket.id;
      socket.broadcast.emit('update_player_server', player);
    });

    // send to all clients except sender that we are ready for the next turn
    socket.on('next_turn', function() {
      socket.broadcast.emit('next_turn_server');
    });

    // send to all clients except sender the state of the die
    socket.on('die_sprite', function(rand) {
      socket.broadcast.emit('die_sprite_server', rand);
    })

    // we get information about the game state
    socket.on('gamestate', function(state) {
      gamestate = state;
    });

    socket.on('disconnect', function() {
      let player = null;
      for (let key in players) {
        if (players[key].socket_id == socket.id) {
          player = players[key];
        }
      }
      player.connected = false;
      console.log("player " + player.uuid + " has disconnected");

      // nobody is connected
      if (!isAnyoneConnected()) {
        const t = setTimeout(function() {
          if (!isAnyoneConnected()) {
            io.close();
            startServer();
            clearTimeout(t);
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

server.startServer();
