import React from 'react';
import classNames from 'classnames';
import Board from './board';
// import Chat from './chat';

const socket = io();

class Game extends React.Component {
  constructor() {
    super();
  }

  render() {
    let gameClass = classNames("container", "gameContainer");
    return(
    <div className={ gameClass }>
      <Board socket={ socket }/>
      {/* <Chat socket={ socket }/> */}
    </div>
    );
  }
}

export default Game;
