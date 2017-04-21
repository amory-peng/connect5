import React from 'react';
import Tile from './tile';

class Board extends React.Component {
  constructor() {
    super();
    this.gridSize = 10;
    this.winCount = 5;
    this.state = { currentPlayer: "X",
                   grid: this.makeGrid(),
                   winner: null
                  };
  }


  handleClick(pos) {
    const x = pos[0];
    const y = pos[1];
    if (this.state.grid[x][y] === " ") {
      const newGrid = this.state.grid.slice(0);
      newGrid[x][y] = this.state.currentPlayer;
      const nextPlayer = this.state.currentPlayer === "X" ? "O" : "X";
      this.setState({ grid: newGrid, currentPlayer: nextPlayer },
        ()=> { this.findWinner(x,y); }
      );
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
    console.log(count);
    return count;
  }

  makeGrid() {
    const grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push(" ");
      }
      grid.push(row);
    }
    return grid;
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
    let winText;
    if (this.state.winner) {
      winText = <div>Winner is { this.state.winner }!</div>;
    }

    return(
      <div>
        <div> Current Player: { this.state.currentPlayer }</div>
        <ul className="board">
          { this.renderGrid() }
        </ul>
        <div> { winText }</div>
      </div>
    );
  }
}

export default Board;
