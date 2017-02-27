import React from 'react';
import Tile from './tile';

class Board extends React.Component {
  constructor() {
    super();
    this.gridSize = 10;
    this.state = { currentPlayer: "X" };
  }

  componentWillMount() {
    this.setState({grid: this.makeGrid()});
  }

  handleClick(pos) {
    const x = pos[0];
    const y = pos[1];
    const newGrid = this.state.grid.slice(0);
    newGrid[x][y] = this.state.currentPlayer;
    const nextPlayer = this.state.currentPlayer === "X" ? "O" : "X";
    this.setState({ grid: newGrid, currentPlayer: nextPlayer });
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
    return(
      <div>
        <ul className="board">
          { this.renderGrid() }
        </ul>
      </div>
    );
  }
}

export default Board;
