import React, { Component } from "react";

import { updateQuestion } from "../api/auth";

export default class question_edit extends Component {
  currentOptId = 0;

  constructor(props) {
    super(props);
    this.state = {
      _id: props.question._id,
      title: props.question.title,
      options: props.question.options,
      correctOption: props.question.correctOption,
      explanation: props.question.explanation,
      multiCorrect: props.question.multiCorrect,
      correctOptions: props.question.correctOptions,
    };
    this.setCurrOptId();
  }

  setCurrOptId() {
    for (let opt of this.props.question.options) {
      this.currentOptId = opt._id > this.currentOptId ? opt._id : this.currentOptId;
    }
    this.currentOptId++;
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

  addOption = async () => {
    this.setCurrOptId();
    let options = [...this.state.options, { value: "", _id: this.currentOptId }];
    await this.setState({ options });
  };

  removeOption = async (index) => {
    let options = [...this.state.options];
    options.splice(index, 1);
    await this.setState({ options });
    this.setCurrOptId();
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

  updateQuestion = async () => {
    try {
      this.setState({ savingQuestion: true });
      let _id = this.state._id;
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
      let data = { questionId: _id, title, options, correctOption, multiCorrect, correctOptions, explanation };
      let res = await updateQuestion(data);
      let resp = res.data;
      if (resp.status === 200) {
        console.log(resp.question);
        this.setState({ ...resp.question });
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
                  <input value={this.state.title} name="title" onChange={this.handleChange} type="text" placeholder="Enter question..." />
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
                    <div className="col s12">
                      <label>Add Explanation</label>
                      <textarea
                        id="explanation_area_edit"
                        name="explanation"
                        value={this.state.explanation}
                        onChange={this.handleChange}
                        className="materialize-textarea"
                      ></textarea>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <button className="waves-effect btn blue darken-2" onClick={this.addOption}>
                        <i className="material-icons left">add_circle_outline</i>Add Option
                      </button>
                    </div>
                    <div className="col">
                      <button className="waves-effect btn green accent-4" onClick={this.updateQuestion}>
                        <i className="material-icons left">check</i>Update Question
                      </button>
                    </div>
                    {/* <div className="col">
                      <button className="waves-effect btn red accent-4" onClick={this.props.cancelAddQuestion}>
                        <i className="material-icons left">clear</i>Cancel
                      </button>
                    </div> */}
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
