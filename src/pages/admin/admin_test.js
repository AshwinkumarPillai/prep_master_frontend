import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import QuestionEdit from "../../components/question_edit";
import QuestionAdd from "../../components/question_add";

import { updateTest, fetchFullTestDetails, searchQuestion } from "../../api/auth";

import M from "materialize-css";

class admin_test extends Component {
  searchQuestionModalInstance;

  constructor(props) {
    super(props);
    this.state = {
      test: null,
      addingQuestion: false,
      searchQuestions: [],
      addSeachQuestionMap: new Map(),
    };
  }

  componentDidMount() {
    this.fetchTest();
  }

  async fetchTest() {
    let test = JSON.parse(localStorage.getItem("adminTest"));
    try {
      let res = await fetchFullTestDetails(test._id);
      let resp = res.data;
      if (resp.status === 200) {
        this.setState({ test: resp.test });
        let elems = document.querySelectorAll(".modal");
        let instances = M.Modal.init(elems, {});
        this.searchQuestionModalInstance = instances[0];
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
    try {
      let val = e.target.value;
      if (val.length < 5) return;
      let res = await searchQuestion(val);
      let resp = res.data;
      if (resp.status === 200) this.setState({ searchQuestions: resp.questions });
    } catch (error) {
      console.log(error);
    }
  };

  selectSearchedQuestion = (question) => {
    let addQmap = this.state.addSeachQuestionMap;
    if (!!addQmap.get(question._id)) addQmap.delete(question._id);
    else addQmap.set(question._id, question);
    this.setState({ addSeachQuestionMap: addQmap });
  };

  addSelectedQuestionsToTest = () => {
    let questions = [];
    for (const [key, value] of this.state.addSeachQuestionMap.entries()) {
      questions.push(value);
    }
    let test = this.state.test;
    test.questions.push(...questions);
    this.setState({ test });
    this.searchQuestionModalInstance.close();
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
                  <div id="searchQuestionModal" className="modal">
                    <div className="modal-content">
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
                      <table>
                        {this.state.searchQuestions.map((question, index) => (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked={!!this.state.addSeachQuestionMap.get(question._id)}
                                    onChange={() => this.selectSearchedQuestion(question)}
                                  />
                                  <span> {question.title}</span>
                                </label>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                      <div className="modal-footer">
                        <button className="btn indigo text-white" onClick={this.addSelectedQuestionsToTest}>
                          Add Selected
                        </button>
                        <button
                          className="btn red text-white"
                          onClick={() => {
                            this.searchQuestionModalInstance.close();
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
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
                      <button className="waves-effect btn purple darken-2 modal-trigger" data-target="searchQuestionModal">
                        <i className="material-icons left">search</i>Search Question
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
