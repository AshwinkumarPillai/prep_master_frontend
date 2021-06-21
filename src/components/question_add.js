import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class QuestionAdd extends Component {
  currentOptId = 0;
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      options: [{ value: "", _id: 0 }],
      correctOption: 0,
      explanation: "",
      multiCorrect: false,
      correctOptions: [],
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  editOption = (e, index) => {
    let value = e.target.value;
    let options = [...this.state.options];
    options[index].value = value;
    this.setState({ options });
  };

  addOption = () => {
    let options = [...this.state.options, { value: "", _id: ++this.currentOptId }];
    this.setState({ options });
  };

  removeOption = (index) => {
    let options = [...this.state.options];
    options.splice(index, 1);
    this.setState({ options });
  };

  allowMultiCorrect = (e) => {
    console.log(e.target.checked);
    this.setState({ multiCorrect: e.target.checked, correctOption: null });
  };

  setCorrectOption = (optionId) => {
    this.setState({ correctOption: optionId });
  };

  setMultiCorrectOption = (e, optionId) => {
    if (e.target.checked) {
      this.setState({ correctOptions: [...this.state.correctOptions, optionId] });
    } else {
      let multiCorrectOptions = [...this.state.correctOptions];
      this.setState({ correctOptions: multiCorrectOptions.filter((id) => id != optionId) });
    }
  };

  saveQuestion = () => {
    console.log(this.state);
  };

  checkOptionCorrect = (optionId) => {
    let index = this.state.correctOptions.findIndex((optId) => optId === optionId);
    return index !== -1;
  };

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop: "5vh" }}>
          <div className="right">
            <div className="switch">
              <label>
                <input type="checkbox" checked={this.state.multiCorrect} onChange={this.allowMultiCorrect} />
                <span className="lever"></span>
                Multiple Correct Options
              </label>
            </div>
          </div>

          <br />
          <div className="row">
            <div className="col s12">
              <label>Question: </label>
              <input
                id="question_add_title"
                value={this.state.title}
                name="title"
                onChange={this.handleChange}
                type="text"
                placeholder="Enter question..."
              />
            </div>
          </div>
          <React.Fragment>
            {this.state.options.map((option, index) => (
              <div className="row" key={option._id}>
                <div className="col s1">
                  {this.state.multiCorrect ? (
                    <p>
                      <label>
                        <input
                          type="checkbox"
                          className="filled-in"
                          onChange={(e) => this.setMultiCorrectOption(e, option._id)}
                          checked={this.checkOptionCorrect(option._id)}
                        />
                        <span></span>
                      </label>
                    </p>
                  ) : (
                    <p>
                      <label>
                        <input className="with-gap" name="selectedOption" type="radio" onChange={() => this.setCorrectOption(option._id)} />
                        <span></span>
                      </label>
                    </p>
                  )}
                </div>
                <div className="col s9">
                  <input
                    id={"option" + option._id}
                    value={option.value}
                    name={"option" + option._id}
                    onChange={(e) => this.editOption(e, index)}
                    type="text"
                    placeholder=""
                  />
                </div>
                <div className="col s2">
                  <button className="btn-floating red" onClick={() => this.removeOption(index)}>
                    <i className="material-icons">clear</i>
                  </button>
                </div>
              </div>
            ))}
            <React.Fragment>
              <br />
              <br />
              <div className="row">
                <div className="col s6">
                  <button className="waves-effect btn blue darken-2" onClick={this.addOption}>
                    <i className="material-icons left">add_circle_outline</i>Add Option
                  </button>
                </div>
                <div className="col s6">
                  <button className="waves-effect btn green accent-4" onClick={this.saveQuestion}>
                    <i className="material-icons left">check</i>Save Question
                  </button>
                </div>
              </div>
            </React.Fragment>
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(QuestionAdd);
