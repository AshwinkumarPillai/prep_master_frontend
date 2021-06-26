import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import QuestionEdit from "../../components/question_edit";
import QuestionAdd from "../../components/question_add";

import { updateTest, fetchFullTestDetails, searchQuestion } from "../../api/auth";

class admin_test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: null,
      addingQuestion: false,
    };
  }

  componentDidMount() {
    this.fetchTest();
  }

  async fetchTest() {
    let test = JSON.parse(localStorage.getItem("adminTest"));
    try {
      let res = await fetchFullTestDetails({ testId: test._id });
      let resp = res.data;
      if (resp.status === 200) {
        this.setState({ test: resp.test });
      }
    } catch (error) {
      alert("Internal Server Error");
    }
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
    this.setState({ test: { ...this.state.test, questions: [...this.state.test.questions, question] } });
  };

  removeQuestion = (id) => {
    let test = { ...this.state.test };
    let questions = [...test.questions];
    let index = questions.findIndex((q) => q._id === id);
    if (index !== -1) questions.splice(index, 1);
    test.questions = questions;
    this.setState({ test });
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

  searchQuestion = async (e) => {
    let val = e.target.value;
    if (val.length < 5) return;
    let res = await searchQuestion(val);
    console.log(res);
    //TODO
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
                  <QuestionEdit question={question} key={index} removeQuestion={this.removeQuestion} />
                ))}
              </React.Fragment>
              <br />
              {this.state.addingQuestion ? (
                <QuestionAdd cancelAddQuestion={this.cancelAddQuestion} saveQuestion={this.saveQuestion} />
              ) : (
                <React.Fragment>
                  {/* <div className="row">
                    <div className="col s12">
                      <nav>
                        <div className="nav-wrapper purple darken-4">
                          <form>
                            <div className="input-field">
                              <input id="search_question" type="search" onInput={this.searchQuestion} />
                              <label className="label-icon" htmlFor="search">
                                <i className="material-icons">search</i>
                              </label>
                              <i className="material-icons">close</i>
                            </div>
                          </form>
                        </div>
                      </nav>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col">
                      <button
                        className="waves-effect btn blue darken-2"
                        onClick={() => {
                          this.setState({ addingQuestion: true });
                        }}
                      >
                        <i className="material-icons left">add</i>Add Question
                      </button>
                    </div>
                    <div className="col">
                      {this.state.test.questions.length > 0 ? (
                        <button className="waves-effect btn green light-2" onClick={this.saveTest}>
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
                </React.Fragment>
              )}
            </div>
            <br />
            <br />
          </React.Fragment>
        ) : (
          <div
            className="flex_center"
            style={{
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
