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

// Add the WebSocket handlers
io.on('connection', function(socket) {
  // we check for existing players
  const e_players = Object.keys(players).length > 0;

  // add to our players array
  players[socket.id] = {socket_id: socket.id, player_id: player_id, existing_players: e_players};
  // let our socket know that we are ready to spawn
  socket.emit('my player', players[socket.id]);
  player_id++;

  // a new player has joined the game
  socket.on('new player', function() {
    console.log('a new player has joined the server' + ' ' + socket.id);
    // if existing players we emit to the sender (to create the player objects)
    if (e_players) {
      socket.emit('existingPlayers', {players: players, my_socket_id: socket.id});
    }

    // send to all clients except sender
    socket.broadcast.emit('new_player', players[socket.id]);
  });

  // send to all clients except sender
  socket.on('position', function(data) {
    data.socket_id = socket.id;
    socket.broadcast.emit('position_server', data);
  });

  // send to all clients except sender that we are ready for the next turn
  socket.on('next_turn', function() {
    socket.broadcast.emit('next_turn_server');
  });

  socket.on('disconnect', function() {
    console.log("player " + socket.id + " has disconnected");
    // remove from players array
    delete players[socket.id];
    // let other clients know
    socket.broadcast.emit('disconnect_from_server', socket.id)
  });
});
