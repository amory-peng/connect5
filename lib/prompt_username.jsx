import React from "react";

class PromptUserName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.setUserName(this.state.name);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Enter username..."
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default PromptUserName;
