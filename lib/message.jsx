import React from 'react';

class Message extends React.Component {
  render() {
    let userName = this.props.msg.userName;
    let messageText = this.props.msg.messageText;
    return(
      <div className="message"> { userName }: { messageText }</div>
    );
  }
}

export default Message;