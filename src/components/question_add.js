import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { addQuestion } from "../api/auth";

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
      savingQuestion: false,
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
    this.setState({ multiCorrect: e.target.checked, correctOption: null, correctOptions: [] });
  };

  setCorrectOption = (optionId) => {
    this.setState({ correctOption: optionId });
  };

  setMultiCorrectOption = (e, optionId) => {
    if (e.target.checked) {
      this.setState({ correctOptions: [...this.state.correctOptions, optionId] });
    } else {
      let multiCorrectOptions = [...this.state.correctOptions];
      this.setState({ correctOptions: multiCorrectOptions.filter((id) => id !== optionId) });
    }
  };

  saveQuestion = async () => {
    try {
      this.setState({ savingQuestion: true });
      let title = this.state.title;
      let explanation = this.state.explanation;
      let toptions = this.state.options;
      let correctOption = this.state.correctOption;
      let multiCorrect = this.state.multiCorrect;
      let correctOptions = this.state.correctOptions;
      let options = toptions.filter((opt) => opt.value.replaceAll(" ", "") !== "");
      if (!title || options.length < 1 || (multiCorrect && correctOptions.length < 1)) {
        alert("Please add necessary fields");
        this.setState({ savingQuestion: false });
      }
      let data = { title, options, correctOption, multiCorrect, correctOptions, explanation };
      let res = await addQuestion(data);
      let resp = res.data;
      if (resp.status === 200) {
        try {
          this.props.saveQuestion(resp.question);
        } catch (error) {
          console.log(error);
        }
        this.props.cancelAddQuestion();
        return;
      }
      this.setState({ savingQuestion: false });
    } catch (error) {
      console.log(error);
      this.setState({ savingQuestion: false });
    }
  };

  checkOptionCorrect = (optionId) => {
    let index = this.state.correctOptions.findIndex((optId) => optId === optionId);
    return index !== -1;
  };

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop: "5vh" }}>
          {this.state.savingQuestion ? (
            <div className="center">
              <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-blue-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card padding-10" style={{ padding: "10px" }}>
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
                            <input
                              className="with-gap"
                              name="selectedOption"
                              type="radio"
                              onChange={() => this.setCorrectOption(option._id)}
                              checked={this.state.correctOption === option._id}
                            />
                            <span></span>
                          </label>
                        </p>
                      )}
                    </div>
                    <div className="col s9">
                      <input
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
                    <div className="input-field col s12">
                      <textarea
                        id="explanation_area_add"
                        name="explanation"
                        value={this.state.explanation}
                        onChange={this.handleChange}
                        className="materialize-textarea"
                      ></textarea>
                      <label htmlFor="explanation_area_add">Add Explanation</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <button className="waves-effect btn blue darken-2" onClick={this.addOption}>
                        <i className="material-icons left">add_circle_outline</i>Add Option
                      </button>
                    </div>
                    <div className="col">
                      <button className="waves-effect btn green accent-4" onClick={this.saveQuestion}>
                        <i className="material-icons left">check</i>Save Question
                      </button>
                    </div>
                    <div className="col">
                      <button className="waves-effect btn red accent-4" onClick={this.props.cancelAddQuestion}>
                        <i className="material-icons left">clear</i>Cancel
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              </React.Fragment>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(QuestionAdd);
