import React, { Component } from "react";

import { fetchUserHistory } from "../api/auth";

export default class history extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, userHistory: null };
  }

  componentDidMount() {
    this.loadHistory();
  }

  async loadHistory() {
    try {
      let res = await fetchUserHistory({ userId: JSON.parse(localStorage.getItem("user"))._id });
      let resp = res.data;
      if (resp.status === 200) {
        let userHistory = resp.userHistory;
        this.setState({
          userHistory,
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
      alert("Error Retrieving history! Please try again.");
      this.props.history.push("/");
    }
  }

  getDate = (mdate) => {
    let fdate = mdate.split("T")[0];
    let [year, month, date] = fdate.split("-");
    return `${date} / ${month} / ${year}`;
  };

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
              <table className="highlight">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.userHistory.map((test, index) => (
                    <React.Fragment key={index}>
                      <tr style={{ cursor: "pointer" }} onClick={() => this.props.history.push(`/result/${test._id}`)}>
                        <td style={{ textTransform: "capitalize" }}>{test.testId.name}</td>
                        <td>
                          {test.score} / {test.test_data.length}
                        </td>
                        <td>{this.getDate(test.createdAt)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
