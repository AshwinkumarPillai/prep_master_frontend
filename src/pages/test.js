import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { fetchTestDetails } from "../api/auth";

import Timer from "../components/timer";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", time_limit: -1, questions: [], loadedTest: false, endTime: 0 };
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
        let time_limit = resp.test.time_limit;
        let dt = new Date();
        if (time_limit > 0) {
          dt = new Date();
          dt.setMinutes(dt.getMinutes() + time_limit);
        }
        this.setState({ ...resp.test, loadedTest: true, endTime: dt.getTime() });
        return;
      }
      alert("Error! Please try again");
      this.props.history.push("/");
    } catch (error) {
      alert("Error! Please try again");
      // console.log(error);
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loadedTest ? (
          <React.Fragment>
            <h4 className="center" style={{ textTransform: "capitalize", marginBottom: "40px" }}>
              {this.state.name}
            </h4>
            {this.state.time_limit !== -1 && <Timer endTime={this.state.endTime} />}

            <div className="container">
              {this.state.questions.map((question, index) => (
                <React.Fragment key={index}>
                  <div className="card test_question_card orange lighten-3" style={{ padding: "20px" }}>
                    <div className="row">
                      <div className="col s12">
                        <h6>
                          <span className="new badge black left" data-badge-caption="." style={{ marginRight: "8px" }}>
                            {index + 1}
                          </span>
                          {question.title}
                        </h6>
                      </div>
                    </div>
                    <hr style={{ border: ".5px solid black" }} />
                    {question.multiCorrect ? (
                      <React.Fragment>
                        {question.options.map((option, index2) => (
                          <React.Fragment key={index2}>
                            <p className="ptest">
                              <label>
                                <input id={option.value + index2} type="checkbox" className="filled-in test_option_checkbox" />
                                <span></span>
                              </label>
                              <label htmlFor={option.value + index2} className="customLabel">
                                {option.value}
                              </label>
                            </p>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {question.options.map((option, index2) => (
                          <React.Fragment key={index2}>
                            <p className="ptest">
                              <label>
                                <input
                                  type="radio"
                                  id={question.title + index2}
                                  name={question.title}
                                  className="with-gap test_option_radio"
                                />
                                <span></span>
                              </label>
                              <label htmlFor={question.title + index2} className="customLabel">
                                {option.value}
                              </label>
                            </p>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    )}

                    <br />
                  </div>
                </React.Fragment>
              ))}
            </div>
            <br />
            <div className="container">
              <div className="row">
                <button className="btn blue darken-2 waves-effect">
                  Submit Test <i className="material-icons left">done_all</i>
                </button>
              </div>
            </div>
            <br />
          </React.Fragment>
        ) : (
          "Loading Test..."
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Test);
