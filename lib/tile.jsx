import React from "react";

const Tile = ({ onClick, value }) => {
  let tileColor = "tile";
  if (value === "X") {
    tileColor = "tile-red";
  } else if (value === "O") {
    tileColor = "tile-blue";
  }

  return (
    <div className={tileColor} onClick={onClick}>
      {value}
    </div>
  );
};
export default Tile;
