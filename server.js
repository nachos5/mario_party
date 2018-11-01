let express = require('express'),
  http = require('http'),
  path = require('path'),
  socketIO = require('socket.io');

let app = express(),
  server = http.Server(app),
  io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('test', function(data) {
    console.log(data);
  })
});
