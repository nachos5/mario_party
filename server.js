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

// Add the WebSocket handlers
io.on('connection', function(socket) {
  console.log("player " + socket.id + " has connected");

  // emit game state
  socket.emit('game_state_server', gamestate);

  let e_players = Object.keys(players).length > 0;
  let reconnect = false;
  socket.on('init', function(uuid) {
    if (uuid in players) {
      // player is reconnecting
      players[uuid].existing_players = e_players;
      reconnect = true;
    } else {
    // our player
      players[uuid] = {uuid: uuid, player_id: player_id, existing_players: e_players};
      player_id++;
    }
    // let our socket know that we are ready to spawn
    socket.emit('my player', players[uuid]);
  });

  // a new player has joined the game
  socket.on('new player', function(player) {
    if (!reconnect) {
      players[player.uuid] = player;
    }
    // spawn existing players
    if (e_players) {
      socket.emit('existingPlayers', {players: players, my_uuid: player.uuid});
    }

    if (!reconnect) {
      // send to all clients except sender
      socket.broadcast.emit('new_player', players[player.uuid]);
    } else {
      socket.emit('reconnecting', players[player.uuid]);
    }
  });

  // send to all clients except sender
  socket.on('update_player', function(player) {
    players[player.uuid] = player;
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
    console.log("player " + socket.id + " has disconnected");
  });
});
