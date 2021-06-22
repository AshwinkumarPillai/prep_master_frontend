import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import QuestionEdit from "../../components/question_edit";
import QuestionAdd from "../../components/question_add";

import { updateTest } from "../../api/auth";

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

  cancelAddQuestion = () => {
    this.setState({ addingQuestion: false });
  };

  saveQuestion = (question) => {
    console.log(question);
    this.setState({ test: { ...this.state.test, questions: [...this.state.test.questions, question] } });
  };

  saveTest = async () => {
    let test = JSON.parse(JSON.stringify(this.state.test));
    let checkpoint = JSON.parse(JSON.stringify(this.state.test));
    try {
      this.setState({ test: null });
      let qs = test.questions;
      let questions = [];
      for (let q of qs) questions.push(q._id);
      test.questions = JSON.parse(JSON.stringify(questions));
      let res = await updateTest({ ...test, testId: test._id });
      let resp = res.data;
      if (resp.status === 200) {
        this.setState({ test: resp.test });
      } else this.setState({ test: checkpoint });
    } catch (error) {
      this.setState({ test: checkpoint });
    }
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
                {this.state.test.questions.map((question, index) => (
                  <QuestionEdit question={question} key={index} />
                  // <React.Fragment key={index}>
                  //   <div className="card">
                  //     {index + 1}&nbsp;&nbsp;&nbsp;{question.title}
                  //     <hr />
                  //     {question.options.map((option, index2) => (
                  //       <React.Fragment key={index2}>
                  //         <div className="row">
                  //           <div className="col s2">{index2 + 1}</div>
                  //           <div className="col s10">{option.value}</div>
                  //         </div>
                  //       </React.Fragment>
                  //     ))}
                  //   </div>
                  // </React.Fragment>
                ))}
              </React.Fragment>
              <br />
              {this.state.addingQuestion ? (
                <QuestionAdd cancelAddQuestion={this.cancelAddQuestion} saveQuestion={this.saveQuestion} />
              ) : (
                <div className="row">
                  <div className="col">
                    <button
                      className="waves-effect btn blue darken-2"
                      onClick={() => {
                        this.setState({ addingQuestion: true });
                      }}
                    >
                      <i className="material-icons left">add_circle_outline</i>Add Question
                    </button>
                  </div>
                  <div className="col">
                    {this.state.test.questions.length > 0 ? (
                      <button className="waves-effect btn green darken-2" onClick={this.saveTest}>
                        <i className="material-icons left">publish</i>Save Test
                      </button>
                    ) : null}
                  </div>
                  <div className="col">
                    <button
                      className="waves-effect btn purple darken-4"
                      onClick={() => {
                        this.props.history.push("/admin");
                      }}
                    >
                      <i className="material-icons left">check</i>Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            <br />
            <br />
          </React.Fragment>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            Loading...
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(admin_test);
