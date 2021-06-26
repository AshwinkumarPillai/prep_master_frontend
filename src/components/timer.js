import React, { Component } from "react";

export default class Timer extends Component {
  timer;
  constructor(props) {
    super(props);
    this.state = { hours: "", minutes: "", seconds: "" };
  }

  componentDidMount() {
    this.getRemainingTime(this.props.endTime);
    this.timer = setInterval(() => {
      this.getRemainingTime(this.props.endTime);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getRemainingTime(endTime) {
    let remMilliSec = endTime - new Date().getTime();
    this.setTime(remMilliSec);
  }

  setTime = (milli) => {
    let seconds = Math.floor((milli / 1000) % 60);
    let minutes = Math.floor((milli / (1000 * 60)) % 60);
    let hours = Math.floor((milli / (1000 * 60 * 60)) % 24);

    if (hours === 0 && minutes === 0 && seconds === 0) {
      this.props.submitTest();
      return;
    }
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    this.setState({ hours, minutes, seconds });
  };

  render() {
    return (
      <React.Fragment>
        <div id="clockdiv">
          <div>
            <span className="hours">{this.state.hours}</span>
            <div className="smalltext">Hours</div>
          </div>
          <div>
            <span className="minutes">{this.state.minutes}</span>
            <div className="smalltext">Minutes</div>
          </div>
          <div>
            <span className="seconds">{this.state.seconds}</span>
            <div className="smalltext">Seconds</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
