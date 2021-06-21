import React, { Component } from "react";

export default class question_edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.question.title,
      options: props.question.options,
      correctOption: props.question.correctOption,
      explanation: props.question.explanation,
      multiCorrect: props.question.multiCorrect,
      correctOptions: props.question.correctOptions,
    };
  }

  render() {
    return <div></div>;
  }
}
