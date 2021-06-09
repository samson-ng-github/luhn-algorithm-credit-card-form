import React from "react";

const SavedCard = (props) => {
  const { id, last4digits, cardHolder, removeCard } = props;
  return (
    <div className="saved-cards__item">
      <div>XXXX XXXX XXXX {last4digits}</div>
      <div>{cardHolder}</div>
      <i
        className="material-icons saved-cards__item__icon"
        onClick={() => {
          removeCard(id);
        }}
      >
        delete_forever
      </i>
    </div>
  );
};

export default SavedCard;
