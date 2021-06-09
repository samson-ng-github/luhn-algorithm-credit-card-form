import React, { useState } from "react";
import "App.css";

//Import Components
import Field from "./components/Field";
import Select from "./components/Select";
import Message from "./components/Message";
import SavedCard from "./components/SavedCard";

/* Overview

This is a practice project to build a credit card form usuing react.
After entering the details, the credit card number will be checked if it is valid
using the Luhn Algoritm. For more information abut the algorithm, please refer to:
https://www.youtube.com/watch?v=wsphC8V36i0

Other details will also be checked. The card holder's name can only accept alphabets, spaces and hyphens.
The CVV can only accept three numbers.
Upon clicking "Submit", there will be a message on top to tell you if the valiation has been successful.
You will also know which field has been successful by its color code and icon. Once valiation has passed,
the card details will be saved and displayed below the form. You can keep adding new keeps and delete old cards.

In addition, I have also given myself a challenge of not setting up the project using npm create-react-app.
Rather, I created it from scratch. I have had to find various tutorials to teach me how to install
all the dependencies, the babelrc and the webpack.config files.
There were many unexplained errors along the way. Fortunately I managed to solve them.*/

// The options in the Year dropdown are loaded dynamaically.
// This is how it is acquired.
var currentDate = new Date();
var currentYear = currentDate.getFullYear().toString();

//The card details will be saved in "card" state
//This this is the default card which is empty
const emptyCard = {
  "Card Number": "",
  "Display Number": "",
  "Card Holder": "",
  "Expiration Month": "0",
  "Expiration Year": "0",
  CVV: "",
  id: new Date().getTime().toString(),
};

//When The form is submitted, each field will be validated.
//The results will be saved in validationResults. These are the default empty values;
const emptyValidationResults = {
  "Card Number": "",
  "Card Holder": "",
  "Expiration Month": "",
  "Expiration Year": "",
  CVV: "",
};

const App = () => {
  //Load in the default values
  //"savedCards" is the array of successfully validated cards that will be displayed below
  //"message" is the message on top that appears to tell you if validation is successful
  const [card, setCard] = useState(emptyCard);
  const [savedCards, setSavedCards] = useState([]);
  const [validationResults, setValidationResults] = useState(
    emptyValidationResults
  );
  const [message, setMessage] = useState({
    isOpen: false,
    finalValidationResult: false,
    content: "",
    showSavedCards: false,
  });

  //Everytime something is typed into Card Number field,
  //non number characted will be filtered with regex and character length capped at 16
  //It will be copied to "Display Number" with spaces added (only for display purposes)
  //The original number will be saved as "Card Number" (used for real calculation later)
  const handleCardNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const display =
      value.slice(0, 4) +
      (value.length > 4 ? " " : "") +
      value.slice(4, 8) +
      (value.length > 8 ? " " : "") +
      value.slice(8, 12) +
      (value.length > 12 ? " " : "") +
      value.slice(12, 16);
    setCard({ ...card, "Card Number": value, "Display Number": display });
  };

  //For "Card Holder", all non alphabet characters are filtered.
  //However, spaces, hypens and apostrophes will remain as some people's names do have these punctuations.
  const handleCardHolder = (e) => {
    const value = e.target.value
      .replace(/[^a-z '-]/gi, "")
      .replace(/ +/, " ")
      .toUpperCase();
    setCard({ ...card, "Card Holder": value });
  };

  //Handler of the select fiels, the Year and Month.
  const handleSelect = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCard({ ...card, [name]: value });
  };

  //Handler of the CVV. Only numbers are allowed and capped at 3 numbers.
  const handleCCV = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCard({ ...card, CVV: value });
  };

  //Handler of the submit when all details typed in.
  //If the valildateCard() function returns true,
  //The message will set to appear, all the fields and results reset.
  //The card will be saved in "savedCards" and displated below.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("current id: " + card.id);

    if (valildateCard()) {
      setMessage({
        isOpen: true,
        finalValidationResult: true,
        content:
          "Thank you! Card validated and saved. Add another card if you like.",
        showSavedCards: true,
      });
      setSavedCards([...savedCards, card]);
      console.log(card);
      console.log("---new card---");

      let id = new Date().getTime().toString();
      setCard({ ...emptyCard, id });
      setValidationResults(emptyValidationResults);
      console.log("new id: " + id);
    } else
      setMessage({
        ...message,
        isOpen: true,
        finalValidationResult: false,
        content: "Error! Invalid card. Please try again.",
      });
  };

  //Here we determined if each field can be validated
  //Card Holder, Year and Month will be passsed as long as there is something
  //CVV will only be passed if it has 3 numbers.
  //Card number will have to go through the Luhn test in validateCardNumber() function.
  //The results are stored as string rather than booleans because there are three states:
  //Before validation: ""; Success: "PASSED"; Fail: "FAILED"
  //The input fields are styled based on these 3 states.
  //When a new card is saved, it is given a unique id
  const valildateCard = () => {
    let cardNumberResult,
      cardHolderResult,
      expirationMonthResult,
      expirationYearResult,
      cvvResult;

    if (validateCardNumber(card["Card Number"])) cardNumberResult = "PASSED";
    else cardNumberResult = "FAILED";
    if (card["Card Holder"]) cardHolderResult = "PASSED";
    else cardHolderResult = "FAILED";
    if (card["Expiration Month"] !== "0") expirationMonthResult = "PASSED";
    else expirationMonthResult = "FAILED";
    if (card["Expiration Year"] !== "0") expirationYearResult = "PASSED";
    else expirationYearResult = "FAILED";
    if (card["CVV"].length === 3) cvvResult = "PASSED";
    else cvvResult = "FAILED";

    setValidationResults({
      "Card Number": cardNumberResult,
      "Card Holder": cardHolderResult,
      "Expiration Month": expirationMonthResult,
      "Expiration Year": expirationYearResult,
      CVV: cvvResult,
    });

    if (
      cardNumberResult === "PASSED" &&
      cardHolderResult === "PASSED" &&
      expirationMonthResult === "PASSED" &&
      expirationYearResult === "PASSED" &&
      cvvResult === "PASSED"
    )
      return true;
    else return false;
  };

  //This is the Luhn algorithm
  //First we have to make sure the number is 14-16 characters long
  //Then we have to determine wheather the character length is odd or even
  //This helps us decide which numbers in the sequence to keep as it is
  //and which to double and break up and re-add
  //We then add together the two groups and see if it can be devided by 10
  //If so we have a match.
  const validateCardNumber = (number) => {
    if (number.length > 16 || number.length < 14) return false;

    let i = 0;
    let sum = 0;
    let isLengthEven = number.length % 2 ? false : true;
    if (!isLengthEven)
      for (i = 0; i < number.length; i++) {
        if (i % 2 === 0) sum += parseInt(number[i]);
        else sum += processDoubleDigit(parseInt(number[i]));
      }
    else
      for (i = 0; i < number.length; i++) {
        if (i % 2 === 0) sum += processDoubleDigit(parseInt(number[i]));
        else sum += parseInt(number[i]);
      }
    let isValid = sum % 10 ? false : true;
    console.log("sum = " + sum);

    return isValid;
  };

  //The function to calculate the sum of the second group
  const processDoubleDigit = (digit) => {
    let output = digit * 2;
    if (output >= 10) output -= 9;
    return output;
  };

  //This is the function to remove the saved cards below the form
  //It is passed into the each Saved Card component.
  //If there is no more saved cards remaining the whole saved card session will hide.
  const removeCard = (id) => {
    let newSavedCards = savedCards.filter((card) => card.id !== id);
    setSavedCards(newSavedCards);
    console.log("removed: " + id);
    if (savedCards.length === 1)
      setMessage({
        ...message,
        showSavedCards: false,
      });
  };

  return (
    <form className={"form"}>
      {/*Result message on top*/}
      {message.isOpen && (
        <Message
          message={message.content}
          finalValidationResult={message.finalValidationResult}
        />
      )}
      {/*The first two fields*/}
      <Field
        name="Card Number"
        value={card["Display Number"]}
        onChange={handleCardNumber}
        validationResult={validationResults["Card Number"]}
      />
      <Field
        name="Card Holder"
        value={card["Card Holder"]}
        onChange={handleCardHolder}
        validationResult={validationResults["Card Holder"]}
      />
      {/*The last thre fields, they are nested in various divs in
      order that they display responsively. In big screens, all three share one line.
      In medium screes, the line gets shorter.
      In small screens, the first two share one line and the last has its one line*/}
      <div className="form__expiration-cvv-div">
        <div className="form__expiration-div">
          <div className="form__expiration-month-div">
            <Select
              name="Expiration Month"
              label="Expiration Date"
              size="12"
              default_value={"Month"}
              first_value="01"
              value={card["Expiration Month"]}
              onChange={handleSelect}
              validationResult={validationResults["Expiration Month"]}
            />
          </div>
          <div className="form__expiration-year-div">
            <Select
              name="Expiration Year"
              label={<br />}
              size="4"
              default_value={"Year"}
              first_value={currentYear}
              value={card["Expiration Year"]}
              onChange={handleSelect}
              validationResult={validationResults["Expiration Year"]}
            />
          </div>
        </div>

        <div className="form__cvv-div">
          <Field
            name="CVV"
            value={card["CVV"]}
            onChange={handleCCV}
            validationResult={validationResults["CVV"]}
          />
        </div>
      </div>
      {/*Submit button. Changes colour on hover*/}
      <input
        className="button"
        type="submit"
        value="Submit"
        onClick={handleSubmit}
      />
      {/*Saved Cards section, which will only show when you have successfully entered the first card*/}
      {message.showSavedCards && <div className="saved-cards">SAVED CARDS</div>}
      {savedCards.map((card) => (
        <SavedCard
          key={card.id}
          id={card.id}
          last4digits={card["Card Number"].slice(12, 16)}
          cardHolder={card["Card Holder"]}
          removeCard={removeCard}
        />
      ))}
    </form>
  );
};

export default App;
