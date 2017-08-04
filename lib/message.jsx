import React from 'react';

class Message extends React.Component {
  render() {
    let userName = this.props.msg.userName;
    let messageText = this.props.msg.messageText;
    return(
      <div className="message">
        <div className="message__user">{ userName }:</div>
        <div className="message__messageText">{ messageText }</div>
      </div>
    );
  }
}

export default Message;