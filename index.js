var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log("user connected");

  socket.on('boardChange', (msg) => {
    io.emit('received', msg);
  });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});
