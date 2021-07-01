import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { fetchTestDetails, saveUserTestHistory } from "../api/auth";

import Timer from "../components/timer";
import Question from "./question";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Loading...",
      testId: null,
      name: "",
      time_limit: -1,
      questions: [],
      loadedTest: false,
      endTime: 0,
      selectedOptions: new Map(),
    };
  }

  componentDidMount() {
    this.loadTest();
  }

  async loadTest() {
    try {
      let arr = window.location.href.split("/");
      let testId = arr[arr.length - 1];
      this.setState({ testId });
      let res = await fetchTestDetails(testId);
      let resp = res.data;
      if (resp.status === 200) {
        await this.setTestData(resp.test);
        let time_limit = resp.test.time_limit;
        let dt = new Date();
        if (time_limit > 0) {
          dt = new Date();
          dt.setMinutes(dt.getMinutes() + time_limit);
        }
        await this.setState({ ...resp.test, endTime: dt.getTime(), loadedTest: true });
        return;
      }
      alert("Error! Please try again");
      this.props.history.push("/");
    } catch (error) {
      alert(error.response.data.message);
      this.props.history.push("/");
    }
  }

  selectOption = (questionId, optionSet) => {
    let m = this.state.selectedOptions;
    m.set(questionId, optionSet);
    this.setState({ selectedOptions: m });
  };

  setTestData = async (test) => {
    let m = this.state.selectedOptions;
    test.questions.forEach((question) => {
      m.set(question._id, new Set());
    });
    await this.setState({ selectedOptions: m });
  };

  createSelectedOptionObjects(selectedOptions) {
    let obj = {};
    for (const [key, value] of selectedOptions.entries()) {
      obj[key] = [...value];
    }
    return obj;
  }

  submitTest = async () => {
    try {
      let data = {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        testId: this.state.testId,
        selectedOptionsMap: this.createSelectedOptionObjects(this.state.selectedOptions),
      };
      this.setState({ message: "Submitting Test...", loadedTest: false });
      let res = await saveUserTestHistory(data);
      if (res.data.status === 200) {
        this.setState({ message: "Fetching Result..." });
        let userTestHistoryId = res.data.userTestHistoryId;
        if (userTestHistoryId) this.props.history.push(`/result/${userTestHistoryId}`);
      }
    } catch (error) {
      console.log(error);
      this.setState({ loadedTest: true });
      alert(error.response.data.message);
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loadedTest ? (
          <React.Fragment>
            <h4 className="center" style={{ textTransform: "capitalize", marginBottom: "40px" }}>
              {this.state.name}
            </h4>
            {this.state.time_limit !== -1 && <Timer endTime={this.state.endTime} submitTest={this.submitTest} />}

            <div className="container">
              {this.state.questions.map((question, index) => {
                let img = question.image;
                let imageUrl = null;
                if (img) {
                  let ctype = img.contentType.split("/")[1];
                  let og = Buffer.from(img.data, "base64", "binary").toString("base64");
                  imageUrl = `data:image/${ctype};base64,${og}`;
                }
                return (
                  <Question
                    question={question}
                    selectOption={this.selectOption}
                    selectedOptions={this.state.selectedOptions.get(question._id)}
                    index={index + 1}
                    key={index}
                    imageUrl={imageUrl}
                  />
                );
              })}
            </div>
            <br />
            <div className="container">
              <div className="row">
                <button className="btn blue darken-2 waves-effect" onClick={this.submitTest}>
                  Submit Test
                  <i className="material-icons left">done_all</i>
                </button>
              </div>
            </div>
            <br />
          </React.Fragment>
        ) : (
          <div className="flex_center" style={{ height: "100vh" }}>
            {this.state.message}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Test);
