import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { fetchTestDetails } from "../api/auth";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", time_limit: -1, questions: [], loadedTest: false };
  }

  componentDidMount() {
    this.loadTest();
  }

  async loadTest() {
    try {
      let arr = window.location.href.split("/");
      let testId = arr[arr.length - 1];
      let res = await fetchTestDetails({ testId });
      let resp = res.data;
      if (resp.status === 200) {
        this.setState({ ...resp.test, loadedTest: true });
        return;
      }
      alert("Error! Please try again");
      this.props.history.push("/");
    } catch (error) {
      alert("Error! Please try again");
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loadedTest ? (
          <React.Fragment>
            <h4 className="center" style={{ textTransform: "capitalize" }}>
              {this.state.name}
            </h4>
            <div className="container">
              {this.state.questions.map((question, index) => (
                <React.Fragment key={index}>
                  <div className="card" style={{ padding: "20px" }}>
                    <div className="row">
                      <div className="col s1">
                        <h5>{index + 1}.</h5>
                      </div>
                      <div className="col s11">
                        <h5>{question.title}</h5>
                      </div>
                    </div>
                    {question.multiCorrect ? (
                      <React.Fragment>
                        {question.options.map((option, index2) => (
                          <div className="row" key={index2}>
                            <div className="col s1">
                              <p>
                                <label>
                                  <input type="checkbox" className="filled-in" />
                                  <span></span>
                                </label>
                              </p>
                            </div>
                            <div className="col s11">
                              <h6>{option.value}</h6>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {question.options.map((option, index2) => (
                          <div className="row" key={index2}>
                            <div className="col s1">
                              <p>
                                <label>
                                  <input className="with-gap" name="selectedOption" type="radio" />
                                  <span></span>
                                </label>
                              </p>
                            </div>
                            <div className="col s11">
                              <h6>{option.value}</h6>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    )}

                    <br />
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="container">
              <div className="row">
                <button className="btn blue darken-2 waves-effect">
                  Submit Test <i class="material-icons left">done_all</i>
                </button>
              </div>
            </div>
          </React.Fragment>
        ) : (
          "Loading Test..."
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Test);