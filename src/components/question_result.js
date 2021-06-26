import React, { Component } from "react";

import M from "materialize-css";

export default class question_result extends Component {
  constructor(props) {
    super(props);
    let question = props.question;
    this.state = {
      title: question.title,
      multiCorrect: question.multiCorrect,
      options: question.options,
      selectedOptions: props.selectedOptions,
      correctOption: question.correctOption,
      correctOptions: question.correctOptions,
      explanation: question.explanation,
    };
  }

  componentDidMount() {
    let elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems, {});
  }

  chooseState = (optionId) => {
    let isSelected = this.state.selectedOptions.has(optionId);
    let isCorrect;
    if (this.state.multiCorrect) {
      let s = new Set(this.state.correctOptions);
      isCorrect = s.has(optionId);
    } else isCorrect = this.state.correctOption === optionId;
    if (isCorrect) return ["#44bd32", "bold"];
    if (isSelected && !isCorrect) return ["#e84118", "bold"];
    return ["black", "normal"];
  };

  getMark = () => {
    if (this.state.multiCorrect) {
      if (this.state.correctOptions.length !== this.state.selectedOptions.size) return 0;
      else {
        let allCorrect = true;
        for (let cop of this.state.correctOptions) {
          if (!this.state.selectedOptions.has(cop)) allCorrect = false;
        }
        return allCorrect ? 1 : 0;
      }
    } else return this.state.selectedOptions.has(this.state.correctOption) ? 1 : 0;
  };

  render() {
    return (
      <React.Fragment>
        <div className="card" style={{ padding: "20px" }}>
          <div className="row">
            <div className="col s8">
              <h6>
                <span className="new badge black left" data-badge-caption="." style={{ marginRight: "8px" }}>
                  {this.props.index}
                </span>
                {this.state.title}
              </h6>
            </div>
            <div className="col s4" style={{ textAlign: "right" }}>
              {this.getMark()} / 1
            </div>
          </div>
          <hr style={{ border: ".5px solid black" }} />
          {this.state.multiCorrect ? (
            <React.Fragment>
              {this.state.options.map((option, index2) => (
                <React.Fragment key={index2}>
                  <p className="ptest">
                    <label>
                      <input
                        id={option.value + index2}
                        type="checkbox"
                        className="filled-in test_option_checkbox"
                        disabled={true}
                        checked={this.state.selectedOptions !== undefined && this.state.selectedOptions.has(option._id)}
                      />
                      <span></span>
                    </label>
                    <label
                      htmlFor={option.value + index2}
                      className="customLabel_disabled"
                      style={{ color: this.chooseState(option._id)[0], fontWeight: this.chooseState(option._id)[1] }}
                    >
                      {option.value}
                    </label>
                  </p>
                </React.Fragment>
              ))}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.state.options.map((option, index2) => (
                <React.Fragment key={index2}>
                  <p className="ptest">
                    <label>
                      <input
                        type="radio"
                        id={this.state.title + index2}
                        name={this.state.title}
                        className="with-gap test_option_radio disabled"
                        checked={this.state.selectedOptions !== undefined && this.state.selectedOptions.has(option._id)}
                        disabled={true}
                      />
                      <span></span>
                    </label>
                    <label
                      htmlFor={this.state.title + index2}
                      className="customLabel_disabled"
                      style={{ color: this.chooseState(option._id)[0], fontWeight: this.chooseState(option._id)[1] }}
                    >
                      {option.value}
                    </label>
                  </p>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
          <br />
          <ul className="collapsible">
            <li>
              <div className="collapsible-header">
                <i className="material-icons">expand_more</i>View Explanation
              </div>
              <div className="collapsible-body">
                <span>{this.state.explanation}</span>
              </div>
            </li>
          </ul>

          <br />
        </div>
      </React.Fragment>
    );
  }
}
