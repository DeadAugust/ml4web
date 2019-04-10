// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Players
let players = io.of('/'); //need individual?
// Listen for input clients to connect
players.on('connection', function (socket) {
  console.log('A player connected: ' + socket.id);

  //on start
  socket.on('start', function(){
    console.log('start');
    players.emit('start');
  });

  // Listen for data messages
  socket.on('data', function (world) {
    // Data comes in as whatever was sent, including objects
    console.log(world);

    // Send data to all clients
    players.emit('update', world);
  });

  // Listen for this input client to disconnect
  // Tell all clients, this input client disconnected
  socket.on('disconnect', function () {
    console.log("Client has disconnected " + socket.id);
    players.emit('disconnected', socket.id);
  });
});

let god = io.of('/god'); //need individual?
// Listen for input clients to connect
god.on('connection', function (socket) {
  console.log('God connected: ' + socket.id);

  //on start
  socket.on('start', function(){
    console.log('start');
    players.emit('start');
    rat.emit('start');
  });

  // Listen for data messages
  socket.on('data', function (world) {
    // Data comes in as whatever was sent, including objects
    console.log(world);

    // Send data to all clients
    players.emit('update', world);
    rat.emit('update', world);
  });

  // Listen for this input client to disconnect
  // Tell all clients, this input client disconnected
  socket.on('disconnect', function () {
    console.log("God disconnected " + socket.id);
    // players.emit('disconnected', socket.id);
  });
});


let rat = io.of('/hunger'); //need individual?
// Listen for input clients to connect
rat.on('connection', function (socket) {
  console.log('Rat connected: ' + socket.id);

  //on start
  // socket.on('start', function(){
  //   console.log('start');
  //   players.emit('start');
  // });

  // Listen for data messages
  socket.on('data', function (world) {
    // Data comes in as whatever was sent, including objects
    console.log(world);

    // Send data to all clients
    players.emit('update', world);
  });

  socket.on('rat', function(ratPos){
    god.emit('rat', ratPos);
  });

  // Listen for this input client to disconnect
  // Tell all clients, this input client disconnected
  socket.on('disconnect', function () {
    console.log("God disconnected " + socket.id);
    // players.emit('disconnected', socket.id);
  });
});
