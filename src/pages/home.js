import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { fetchAllTests } from "../api/auth";

class Home extends Component {
  constructor(props) {
    super(props);
    let loggedIn = localStorage.getItem("user") ? true : false;
    this.state = { tests: [], loggedIn };
  }

  componentDidMount() {
    this.fetchTests();
  }

  async fetchTests() {
    let resp = await fetchAllTests();
    if (resp.data.status === 200) await this.setState({ tests: resp.data.tests });
  }

  selectTest = (testId) => {
    if (localStorage.getItem("user")) {
      this.props.history.push(`/test/${testId}`);
    } else {
      alert("You need to login to continue!");
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop: "10vh" }}>
          <div className="row">
            {this.state.tests.length > 0 ? (
              this.state.tests.map((test, key) => {
                return (
                  <div
                    className="col s12 m4 z-depth-3 testCard"
                    key={key}
                    onClick={() => this.selectTest(test._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card indigo darken-1">
                      <div className="card-content white-text">
                        <span className="card-title" style={{ color: "#ffea00", textTransform: "capitalize" }}>
                          {test.name}
                        </span>
                        <p>
                          <span style={{ color: "#f48fb1" }}>Number of questions :</span> {test.questions.length}
                        </p>
                        <p>
                          <span style={{ color: "#f48fb1" }}>Time Limit: </span>
                          {test.time_limit === -1 ? "No limit" : `${test.time_limit} minutes`}
                        </p>
                        {!this.state.loggedIn ? (
                          <span>
                            <i className="material-icons right">lock</i>
                            <br />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="center"> Loading...</div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Home);
