import React from "react";
import classNames from "classnames";
import Board from "./board";
import Chat from "./chat";

const socket = io();

const Game = () => {
  const gameClass = classNames("container", "gameContainer");
  return (
    <div className="container">
      <div className="gameContainer">
        <Board socket={socket} />
      </div>

      <Chat socket={socket} />
    </div>
  );
};

export default Game;
