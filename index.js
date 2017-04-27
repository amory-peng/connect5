var GRID_SIZE = require('./vars').GRID_SIZE;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

//store board state in server LEL
const boards = {};

const makeGrid = function() {
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push(" ");
    }
    grid.push(row);
  }
  return grid;
};

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  console.log(req.params);
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('room', (room) => {
    console.log('player joined');
    socket.join(room);
    if (boards[room]) {
      io.to(room).emit('currentGrid', boards[room]);
    } else {
      boards[room] = makeGrid();
    }
  });

  socket.on('boardChange', (msg) => {
    console.log(msg.room);
    const x = msg.pos[0];
    const y = msg.pos[1];
    boards[msg.room][x][y] = msg.mark;
    console.log(boards[msg.room]);
    io.to(msg.room).emit('boardChange', msg);
  });

  socket.on('reset', (room) => {
    boards[room] = makeGrid();
    io.to(room).emit('reset');
  });
});


http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
