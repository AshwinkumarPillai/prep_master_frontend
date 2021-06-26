import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { fetchUserTestHistroy } from "../api/auth";
import QuestionResult from "../components/question_result";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, test: null, userTestHistoryId: null, test_data: [], score: null };
  }

  componentDidMount() {
    this.loadResult();
  }

  async loadResult() {
    try {
      let arr = window.location.href.split("/");
      let userTestHistoryId = arr[arr.length - 1];
      this.setState({ userTestHistoryId });
      let res = await fetchUserTestHistroy({ userTestHistoryId });
      let resp = res.data;
      if (resp.status === 200) {
        let userTestHistory = resp.userTestHistory;
        await this.setState({
          test: userTestHistory.testId,
          test_data: userTestHistory.test_data,
          score: userTestHistory.score,
          loading: false,
        });
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
        {this.state.loading ? (
          <div className="flex_center" style={{ height: "100vh" }}>
            Loading...
          </div>
        ) : (
          <React.Fragment>
            <div className="container">
              <h3 style={{ textTransform: "capitalize" }}>{this.state.test.name}</h3>
              <h6>
                Score: {this.state.score} / {this.state.test_data.length}
              </h6>
              <hr />
              <React.Fragment>
                <div style={{ marginTop: "40px" }}>
                  {this.state.test_data.map((obj, index) => (
                    <React.Fragment key={index}>
                      <div className="card">
                        <QuestionResult question={obj.questionId} selectedOptions={new Set(obj.selectedOptions)} index={index + 1} />
                      </div>
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
              <br />
              <br />
              <button className="btn" onClick={() => this.props.history.push("/history")}>
                Close
              </button>
            </div>
          </React.Fragment>
        )}

        <br />
        <br />
      </React.Fragment>
    );
  }
}
export default withRouter(Result);
