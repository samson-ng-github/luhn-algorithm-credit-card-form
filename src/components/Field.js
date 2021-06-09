import React from "react";

const Field = (props) => {
  const { name, value, onChange, validationResult } = props;

  //Depending on if the field has passed or failed validation
  //it will have a different modiflier class and colour code.
  //A tick or an explamation mark will also appear.
  let validationStyle, displayTick, displayCross;
  if (validationResult === "PASSED") {
    validationStyle = "--passed";
    displayTick = true;
    displayCross = false;
  } else if (validationResult === "FAILED") {
    validationStyle = "--failed";
    displayTick = false;
    displayCross = true;
  } else {
    validationStyle = "";
    displayTick = false;
    displayCross = false;
  }

  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {name}
      </label>
      {displayTick && (
        <i className={"material-icons input__icon" + validationStyle}>
          check_circle
        </i>
      )}
      {displayCross && (
        <i className={"material-icons input__icon" + validationStyle}>error</i>
      )}
      <input
        className={"input input" + validationStyle}
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Field;
