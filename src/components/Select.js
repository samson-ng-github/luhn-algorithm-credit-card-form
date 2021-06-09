import React from "react";

const Select = (props) => {
  const {
    label,
    name,
    size,
    default_value,
    first_value,
    value,
    onChange,
    validationResult,
  } = props;

  //the select options are generated dynamically,
  //based on the fist value and numebr of options (size) intended
  //It works for both Year and Month.
  let i = 0;
  let limit = parseInt(first_value) + parseInt(size);
  let options = [];

  for (i = parseInt(first_value); i < limit; i++) {
    if (i < 10)
      options[i] = (
        <option key={i} value={"0" + i}>
          {"0" + i}
        </option>
      );
    else
      options[i] = (
        <option key={i} value={i}>
          {i}
        </option>
      );
  }

  //Depending on if the field has passed or failed validation
  //it will have a different modiflier class and colour code.
  let validationStyle;
  if (validationResult === "PASSED") validationStyle = "--passed";
  else if (validationResult === "FAILED") validationStyle = "--failed";
  else validationStyle = "";

  return (
    <div className="select">
      <label className="label" htmlFor={name}>
        {label || name}
      </label>
      <i className={"material-icons input__icon" + validationStyle}>
        keyboard_arrow_down
      </i>
      <select
        className={"input input" + validationStyle}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      >
        <option value="0">{default_value}</option>
        {options}
      </select>
    </div>
  );
};

export default Select;
