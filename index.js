var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname));

io.on('connection', function(socket) {
  console.log("user connected");
});

io.on('connection', function(socket) {
  socket.on('kappa', () => {
    console.log('kappa');
  })
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
