import React from "react";

const question = (props) => {
  const selectOption = (optionId) => {
    if (props.question.multiCorrect) {
      let s = props.selectedOptions ? props.selectedOptions : new Set();
      if (props.selectedOptions && props.selectedOptions.has(optionId)) s.delete(optionId);
      else s.add(optionId);
      props.selectOption(props.question._id, s);
    } else {
      props.selectOption(props.question._id, new Set().add(optionId));
    }
  };

  return (
    <React.Fragment>
      <div className="card test_question_card indigo lighten-5" style={{ padding: "20px", backgroundColor: "white" }}>
        <div className="row">
          <div className="col s12 ">
            <h6>
              <span className="new badge black left" data-badge-caption="." style={{ marginRight: "8px" }}>
                {props.index}
              </span>
              {props.question.title}
            </h6>
          </div>
        </div>
        {props.imageUrl && (
          <div style={{ textAlign: "center", margin: "40px 10px" }}>
            <img src={props.imageUrl} alt="error displaying" className="responsive-img" />
          </div>
        )}

        <hr style={{ border: ".5px solid black" }} />
        <div>
          {props.question.multiCorrect ? (
            <React.Fragment>
              <p className="multiplAnsDesc" style={{ color: "red", fontWeight: "bold" }}>
                * Multiple answers possible
              </p>
              {props.question.options.map((option, index2) => (
                <React.Fragment key={index2}>
                  <p className="ptest">
                    <label>
                      <input
                        id={option.value + index2}
                        type="checkbox"
                        className="filled-in test_option_checkbox"
                        checked={props.selectedOptions !== undefined && props.selectedOptions.has(option._id)}
                        onChange={() => selectOption(option._id)}
                      />
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
              {props.question.options.map((option, index2) => (
                <React.Fragment key={index2}>
                  <p className="ptest">
                    <label>
                      <input
                        type="radio"
                        id={props.question.title + index2}
                        name={props.question.title}
                        className="with-gap test_option_radio"
                        checked={props.selectedOptions !== undefined && props.selectedOptions.has(option._id)}
                        onChange={() => selectOption(option._id)}
                      />
                      <span></span>
                    </label>
                    <label htmlFor={props.question.title + index2} className="customLabel">
                      {option.value}
                    </label>
                  </p>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </div>

        <br />
      </div>
    </React.Fragment>
  );
};

export default question;
