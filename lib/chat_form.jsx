import React from "react";

class ChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ text: "" });
    this.props.action(this.state.text);
  }

  render() {
    let placeholder;
    if (this.props.actionLabel === "Send") {
      placeholder = "Send a message";
    } else if (this.props.actionLabel === "Submit") {
      placeholder = "Enter username...";
    }

    return (
      <form className="chatForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="chatForm__input"
          value={this.state.text}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <input
          type="submit"
          value={this.props.actionLabel}
          className="chatForm__submit"
        />
      </form>
    );
  }
}

export default ChatForm;
