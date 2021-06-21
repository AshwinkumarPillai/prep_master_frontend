import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import QuestionEdit from "../../components/question_edit";
import QuestionAdd from "../../components/question_add";

class admin_test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: null,
      addingQuestion: false,
    };
  }

  componentDidMount() {
    let test = JSON.parse(localStorage.getItem("adminTest"));
    this.setState({ test });
  }

  componentWillUnmount() {
    // localStorage.removeItem("adminTest");
  }

  handleChange = (e) => {
    this.setState({ test: { ...this.state.test, [e.target.name]: e.target.value } });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.test ? (
          <React.Fragment>
            <div className="container" style={{ marginTop: "5vh" }}>
              <div className="row">
                <div className="col s12 m4">
                  <label>Test Name</label>
                  <input
                    id="test_name_edit"
                    value={this.state.test.name}
                    name="name"
                    onChange={this.handleChange}
                    type="text"
                    placeholder=""
                  />
                </div>
                <div className="col s12 m4">
                  <label>Time Limit (minutes)</label>
                  <input
                    id="test_time_limit"
                    value={this.state.test.time_limit}
                    name="time_limit"
                    onChange={this.handleChange}
                    type="number"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="container">
              <React.Fragment>
                {this.state.test.questions.map((question, key) => (
                  <QuestionEdit question={question} key={key} />
                ))}
              </React.Fragment>
              <br />
              {this.state.addingQuestion ? (
                <QuestionAdd />
              ) : (
                <button
                  className="waves-effect btn blue darken-2"
                  onClick={() => {
                    this.setState({ addingQuestion: true });
                  }}
                >
                  <i className="material-icons left">add_circle_outline</i>Add Question
                </button>
              )}
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(admin_test);
