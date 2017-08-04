import React from 'react';
import Tile from './tile';
import { hashHistory } from 'react-router';
import { GRID_SIZE } from '../vars';
//

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.gridSize = GRID_SIZE;
    this.winCount = 5;
    this.room = location.pathname;
    this.socket = this.props.socket;
    this.state = { currentPlayer: "X",
                   grid: this.makeGrid(),
                   winner: null,
                  };
  }

  componentWillMount() {
    //socket stuff here
    this.socket.emit('room', this.room);
    this.socket.on('currentGrid', grid => {
      this.setState({ grid }, this.getCurrentPlayer);
    });

    this.socket.on("boardChange", msg => {
      this.handleMsg(msg);
    });

    this.socket.on("reset", () => {
      this.setState({ grid: this.makeGrid(), currentPlayer: "X" });
    });
  }

  getCurrentPlayer() {
    const grid = this.state.grid;
    let count = 0;
    grid.forEach(row => {
      row.forEach(el => {
        if (el !== " ") count += 1;
      });
    });
    console.log(count);
    let currentPlayer;
    currentPlayer = (count % 2 === 0) ? "X" : "O";
    this.setState({ currentPlayer });
  }

  handleMsg(msg) {
    const x = msg.pos[0];
    const y = msg.pos[1];
    const newGrid = this.state.grid.slice(0);
    newGrid[x][y] = this.state.currentPlayer;
    const nextPlayer = msg.mark === "X" ? "O" : "X";
    this.setState({ grid: newGrid, currentPlayer: nextPlayer },
      ()=> { this.findWinner(x,y); }
    );
  }

  handleClick(pos) {
    const x = pos[0];
    const y = pos[1];
    if (this.state.grid[x][y] === " ") {
      this.socket.emit( "boardChange",
      { pos, mark: this.state.currentPlayer, room: this.room });
    }
  }

  findWinner(x,y) {
    let count = Math.max(...[
      this.check(x,y,"row"),
      this.check(x,y,"col"),
      this.check(x,y,"dia"),
      this.check(x,y,"antiDia")
    ]);
    if (count === this.winCount) {

      console.log("winner is", this.state.grid[x][y]);
      let newWinner = this.state.grid[x][y];
      this.setState({ winner: newWinner });
    }
    return false;
  }

  inBounds(x, y) {
    return (x > -1 && x < this.gridSize) && (y > -1 && y < this.gridSize);
  }

  check(x,y,dir) {
    let grid = this.state.grid;
    let count = 1;
    let deltaX = 0;
    let deltaY = 0;
    switch(dir) {
      case "row":
        deltaY = 1;
        break;
      case "col":
        deltaX = 1;
        break;
      case "dia":
        deltaX = 1;
        deltaY = 1;
        break;
      case "antiDia":
        deltaX = -1;
        deltaY = 1;
        break;
      default:
        return;
    }
    //go foward;
    let x1 = x;
    let y1 = y;
    while (this.inBounds(x1+deltaX,y1+deltaY) && grid[x1][y1] === grid[x1+deltaX][y1+deltaY]) {
      count += 1;
      x1 += deltaX;
      y1 += deltaY;
    }
    //gobackward
    x1 = x;
    y1 = y;
    while (this.inBounds(x1-deltaX,y1-deltaY) && grid[x1][y1] === grid[x1-deltaX][y1-deltaY]) {
      count += 1;
      x1 -= deltaX;
      y1 -= deltaY;
    }
    return count;
  }

  makeGrid() {
    console.log(this.gridSize);
    const grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push(" ");
      }
      grid.push(row);
    }
    console.log(grid);
    return grid;
  }

  resetGrid() {
    this.setState({ winner: null}, () => {
      this.socket.emit('reset', this.room);
    });
  }

  resyncGrid() {
    this.socket.emit('resync', this.room);
  }

  renderGrid() {
    const out = [];
    let count = 0;
    for (let i = 0; i < this.gridSize; i++ ) {
      for (let j = 0; j < this.gridSize; j++ ) {
        out.push(
          <li key={count}>
            <Tile
              value={this.state.grid[i][j]}
              pos={[i,j]}
              onClick={ () => this.handleClick([i,j]) }
            />
          </li>
        );
        count += 1;
      }
    }
    return out;
  }

  render() {
    window.state = this.state;
    let winText;
    if (this.state.winner) {
      winText = <div>Winner is { this.state.winner }!</div>;
    }

    let buttons = <div className="buttonContainer">
      <div className="button" onClick={ this.resetGrid.bind(this) }>
        Reset
      </div>
      <div className="button" onClick={ this.resyncGrid.bind(this) }>
        Resync
      </div>
    </div>;
    return(

      <div className="container">
        <div className="info-container">
          <div> Current Player: { this.state.currentPlayer }</div>
          { buttons }
        </div>
        <ul className="board">
          { this.renderGrid() }
        </ul>

        <div>
          { winText }
        </div>
      </div>
    );
  }
}

export default Board;