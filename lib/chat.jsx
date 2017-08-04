import React from 'react';
import PromptUserName from './prompt_username';
import ChatForm from './chat_form';
import Message from './message';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], userName: "" };
    this.socket = this.props.socket;
    this.room = location.pathname;
    this.renderChatForm = this.renderChatForm.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setUserName = this.setUserName.bind(this);
  }

  componentWillMount() {
    //socket stuff
    this.socket.on("receiveMessage", (msg) => {
      let newMessages = this.state.messages.slice(0);
      newMessages.unshift(msg);
      this.setState({ messages: newMessages });
    });
  }

  renderChatForm() {
    if( this.state.userName === "" ) {
      return <ChatForm action={ this.setUserName }
                       actionLabel="Submit" />
    } else {
      return <ChatForm action={ this.sendMessage }
                        actionLabel="Send"/>
    }
  }

  setUserName(userName) {
    console.log("hit here");
    this.setState({ userName }, () => {
    this.sendMessage(`${userName} has joined.`);
    });
  }

  sendMessage(msg) {
    console.log(`${this.state.userName}: ${msg}`);
    let message = { userName: this.state.userName, messageText: msg, room: this.room };
    this.socket.emit("sendMessage", message);
  }

  renderMessages() {
    let messages = this.state.messages.map((message, idx) => {
      return <li className="messageContainer" key={ idx }><Message msg={ message } /></li>;
    });
    console.log("rendering messages...");
    console.log(messages);
    return messages;
  }

  render() {
    window.chatState = this.state;
    let welcomeText;
    if (this.state.userName) {
      welcomeText = <div>Hi { this.state.userName }!</div>;
    }

    return(
      <div className="chatContainer">
        <ul className="messageList">
          { this.renderMessages() }
        </ul>
        { this.renderChatForm() }
      </div>
    );
  }
}

export default Chat;