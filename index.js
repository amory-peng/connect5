"use strict";
var GRID_SIZE = require("./vars").GRID_SIZE;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

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

app.get("*", (req, res) => {
  console.log(req.params);
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", socket => {
  socket.on("board", room => {
    socket.join(room);
    if (boards[room]) {
      io.to(room).emit("currentGrid", boards[room]);
    } else {
      boards[room] = makeGrid();
    }
    io.to(room).emit("receiveMessage", {
      userName: "Server",
      messageText: `player joined!`,
      room
    });
  });

  socket.on("boardChange", msg => {
    console.log(msg);
    const x = msg.pos[0];
    const y = msg.pos[1];
    boards[msg.room][x][y] = msg.mark;
    io.to(msg.room).emit("boardChange", msg);
  });

  socket.on("reset", room => {
    boards[room] = makeGrid();
    io.to(room).emit("reset");
  });

  socket.on("resync", room => {
    io.to(room).emit("currentGrid", boards[room]);
  });

  socket.on("sendMessage", msg => {
    console.log(msg);
    io.to(msg.room).emit("receiveMessage", msg);
  });

  socket.on("disconnect", room => {
    io.to(room).emit("receiveMessage", {
      userName: "Server",
      messageText: `player disconnected!`,
      room
    });
  });
});

http.listen(process.env.PORT || 4000, () => {
  console.log("listening on *:4000");
});
