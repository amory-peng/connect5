import React from 'react';

class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="tile" onClick={this.props.onClick}>
        { this.props.value }
      </div>
    );
  }
}

export default Tile;
