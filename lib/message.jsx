import React from "react";

const Message = ({ msg }) => {
  return (
    <div className="message">
      {" "}
      {msg.userName}: {msg.messageText}
    </div>
  );
};
export default Message;
