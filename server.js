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

let players = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
  // a new player has joined the game
  socket.on('new player', function() {
    console.log('a new player has joined the server' + ' ' + socket.id);
    // if existing players we emit to the sender (to create the player objects)
    if (Object.keys(players).length > 0) {
      socket.emit('existingPlayers', players);
    }
    // add to our players array
    players[socket.id] = socket.id;
    // send to all clients except sender
    socket.broadcast.emit('new_player', socket.id);
  });

  // send to all clients except sender
  socket.on('position', function(data) {
    data.id = socket.id;
    socket.broadcast.emit('position_server', data);
  });

  socket.on('disconnect', function() {
    console.log("player " + socket.id + " has disconnected");
    // let other clients know
    socket.broadcast.emit('disconnect_from_server', socket.id)
  });
});
