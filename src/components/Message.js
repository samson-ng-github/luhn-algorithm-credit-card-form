import React from "react";

const Message = ({ message, finalValidationResult }) => {
  //Depending on if the final validation is successfully or not
  //the message will have a different modiflier class and font colour.
  let style;
  if (finalValidationResult === true) style = "message message--passed";
  else if (finalValidationResult === false) style = "message message--failed";

  return (
    <div className={style}>
      <p>{message}</p>
    </div>
  );
};

export default Message;
