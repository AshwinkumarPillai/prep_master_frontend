import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { authAdmin, fetchAllAdminTests, createTest, deleteTest, fetchArchivedTests, restoreTest, publishTest } from "../../api/auth";

import M from "materialize-css";

class admin extends Component {
  CreateTestModalInstance;
  ArchivedTestsModalInstance;
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      message: "Loading",
      tests: [],
      name: "",
      time_limit: undefined,
      loadingArchivedTests: true,
      archivedTests: [],
      loadingTests: true,
    };
  }

  componentDidMount() {
    this.checkAdmin();
  }

  async checkAdmin() {
    if (!localStorage.getItem("token")) {
      this.setState({ message: "You are not authorised to view this page" });
      return;
    }
    try {
      let resp = await authAdmin();
      if (resp.data.status === 200) {
        await this.setState({ isAdmin: true });
        let elems = document.querySelectorAll(".modal");
        let instances = M.Modal.init(elems, {});
        this.CreateTestModalInstance = instances[0];
        this.ArchivedTestsModalInstance = instances[1];
        this.fetchTests();
      } else this.setState({ message: "You are not authorised to view this page" });
    } catch (error) {
      this.setState({ message: "You are not authorised to view this page" });
    }
  }

  async fetchTests() {
    try {
      let resp = await fetchAllAdminTests();
      if (resp.data.status === 200) await this.setState({ tests: resp.data.tests });
      this.setState({ loadingTests: false });
    } catch (error) {
      console.log(error);
      this.setState({ loadingTests: false });
      alert(error.response.data.message);
    }
  }

  publishTest = async (testId, index) => {
    try {
      await this.setState({ loadingTests: true });
      let res = await publishTest({ testId });
      let resp = res.data;
      if (resp.status === 200) {
        let tests = this.state.tests;
        tests[index] = resp.test;
        await this.setState({ tests });
      }
      this.setState({ loadingTests: false });
    } catch (error) {
      this.setState({ loadingTests: false });
      alert(error.response.data.message);
      console.log(error);
    }
  };

  createTest = async () => {
    this.setState({ creatingTest: true });
    try {
      if (!this.state.name || (this.state.time_limit && this.state.time_limit < 0)) {
        alert("Please enter all required details");
        this.setState({ creatingTest: false });
        return;
      }
      let data = { name: this.state.name, time_limit: this.state.time_limit ? this.state.time_limit : -1 };
      let resp = await createTest(data);
      if (resp.data.status === 200) {
        this.setState({ tests: [...this.state.tests, resp.data.test] });
        this.CreateTestModalInstance.close();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
    this.setState({ creatingTest: false, name: "", time_limit: undefined });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  deleteTest = async (test) => {
    let delTest = window.confirm("Are you sure you want to delete the test: " + test.name);
    if (delTest) {
      let resp = await deleteTest({ testId: test._id });
      if (resp.data.status === 200) {
        this.setState({ tests: resp.data.tests });
      }
    }
  };

  editTest = (test) => {
    localStorage.setItem("adminTest", JSON.stringify(test));
    this.props.history.push("/admin/test_edit");
  };

  fetchArchivedTests = async () => {
    try {
      let res = await fetchArchivedTests();
      let resp = res.data;
      if (resp.status === 200) {
        await this.setState({ archivedTests: resp.tests });
      }
      this.setState({ loadingArchivedTests: false });
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      this.setState({ loadingArchivedTests: false });
    }
  };

  getDate = (mdate) => {
    let fdate = mdate.split("T")[0];
    let [year, month, date] = fdate.split("-");
    return `${date} / ${month} / ${year}`;
  };

  restoreTest = async (testId) => {
    try {
      await this.setState({ loadingArchivedTests: true });
      let res = await restoreTest({ testId });
      let resp = res.data;
      if (resp.status === 200) {
        await this.setState({ tests: resp.tests });
        await this.fetchArchivedTests();
      }
      await this.setState({ loadingArchivedTests: false });
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      await this.setState({ loadingArchivedTests: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isAdmin ? (
          <React.Fragment>
            <div className="container" style={{ marginTop: "10vh" }}>
              <div className="row">
                <div className="col s12 m6" style={{ marginTop: "10px" }}>
                  <button className="btn-medium waves-effect waves-light blue btn modal-trigger" data-target="createTestModal">
                    <i className="material-icons left">add</i>
                    Add Tests
                  </button>
                </div>
                <div className="col s12 m6" style={{ marginTop: "10px" }}>
                  <button
                    className="btn waves-effect waves-light green modal-trigger"
                    data-target="ArchivedTestListModal"
                    onClick={this.fetchArchivedTests}
                  >
                    <i className="material-icons left">visibility</i>
                    View Deleted Tests
                  </button>
                </div>
              </div>
            </div>
            {/* -------------------- Test Creation Modal -------------------- */}
            <div id="createTestModal" className="modal">
              <div className="modal-content">
                <h4>Create Test</h4>
                <br />
                <div className="input-field col s6">
                  <input id="test_name" type="text" name="name" className="validate" onChange={this.handleChange} value={this.state.name} />
                  <label htmlFor="first_name" className="text-blue">
                    Test Name
                  </label>
                </div>
                <div className="input-field col s6">
                  <input
                    id="test_limit"
                    type="number"
                    name="time_limit"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.time_limit}
                  />
                  <label htmlFor="first_name" className="text-blue">
                    Time Limit for test in Minutes (optional)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                {this.state.creatingTest ? (
                  <div className="center">
                    <div className="preloader-wrapper small active">
                      <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                          <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <button className="btn blue text-white" onClick={this.createTest}>
                      Create Test
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                      className="btn red text-white"
                      onClick={() => {
                        this.setState({ name: "", time_limit: undefined });
                        this.CreateTestModalInstance.close();
                      }}
                    >
                      Close
                    </button>
                  </React.Fragment>
                )}
              </div>
            </div>
            {/* -------------------------------------------------------------- */}

            {/* ------------------------ARCHIVED TEST VIEW MODEL------------------------------- */}

            <div id="ArchivedTestListModal" className="modal">
              <div className="modal-content">
                {this.state.loadingArchivedTests ? (
                  <div className="flex_center">Fetching tests...</div>
                ) : (
                  <React.Fragment>
                    {this.state.archivedTests.length > 0 ? (
                      <table className="highlight">
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Time Limit</th>
                            <th>Date</th>
                            <th>Restore test</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.archivedTests.map((test, index) => (
                            <React.Fragment key={index}>
                              {/* <tr style={{ cursor: "pointer" }} onClick={() => this.props.history.push(`/result/${test._id}`)}> */}
                              <tr>
                                <td style={{ textTransform: "capitalize" }}>{test.name}</td>
                                <td>{test.time_limit > 0 ? test.time_limit : "No Limit"}</td>
                                <td>{this.getDate(test.createdAt)}</td>
                                <td>
                                  <button className="btn green" onClick={() => this.restoreTest(test._id)}>
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex_center">No Archived Tests</div>
                    )}
                  </React.Fragment>
                )}
                <br />
                <br />
                <div className="modal-footer">
                  <button
                    className="btn red text-white"
                    onClick={() => {
                      this.ArchivedTestsModalInstance.close();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------------------- */}

            <hr />
            <br />
            <br />
            <React.Fragment>
              <div className="container">
                <div className="row">
                  {this.state.loadingTests ? (
                    <div className="flex_center">Loading...</div>
                  ) : (
                    <React.Fragment>
                      {this.state.tests.length > 0 ? (
                        this.state.tests.map((test, key) => {
                          return (
                            <div className="col s12 m4" key={key}>
                              <div className="card purple darken-3">
                                {test.status === "NEW" ? (
                                  <button
                                    className="btn indigo"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to publish the test: ${test.name} ?`)) {
                                        this.publishTest(test._id, key);
                                      }
                                    }}
                                  >
                                    Publish Test
                                  </button>
                                ) : (
                                  <button className="btn indigo disabled" disabled={true}>
                                    <i className="material-icons left">done_all</i>
                                    Published
                                  </button>
                                )}
                                <div className="card-content white-text">
                                  <span className="card-title">{test.name}</span>
                                  <p>Number of questions : {test.questions.length}</p>
                                  <p>Time Limit: {test.time_limit === -1 ? "No limit" : `${test.time_limit} minutes`}</p>
                                  <div className="right-align">
                                    <button
                                      className="btn-floating btn-medium waves-effect waves-light blue"
                                      onClick={() => this.editTest(test)}
                                    >
                                      <i className="material-icons">create</i>
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button
                                      className="btn-floating btn-medium waves-effect waves-light red"
                                      onClick={() => this.deleteTest(test)}
                                    >
                                      <i className="material-icons">delete_forever</i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="center"> "You have not created any tests! click the add button to create a test"</div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </React.Fragment>
          </React.Fragment>
        ) : (
          this.state.message
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(admin);
