import "./App.css";
import { useState, useEffect, useRef } from "react";
import FlashCardList from "./components/FlashCardList";

function App() {
  const [flashCards, setFlasCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const selectEl = useRef();
  const amountEl = useRef();

  // fetching categories for select option in header
  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  // function to transform double and single quotes in textarea so we can display correctly in UI
  function decodeString(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }
  // fetching category we selected and the number of questions we choose in input.
  function handleSubmit(e) {
    e.preventDefault();
    fetch(
      `https://opentdb.com/api.php?amount=${amountEl.current.value}&category=${selectEl.current.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFlasCards(
          data.results.map((item, index) => {
            const answer = decodeString(item.correct_answer);
            const options = [
              ...item.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];
            //  we return the object with id, question, correct answer, and other incorrect answers, and with useState sending info to FlashCards
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(item.question),
              answer: answer,
              options: options.sort(() => Math.random - 0.5),
            };
          })
        );
      });
  }
  return (
    <>
      <div className="wrapper">
        <form className="header" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" ref={selectEl}>
              {categories.map((category) => {
                return (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Number of Questions</label>
            <input
              type="number"
              defaultValue={10}
              min={1}
              max={50}
              step={1}
              id="amount"
              ref={amountEl}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn">
              Generate
            </button>
          </div>
        </form>
        <div className="container">
          <FlashCardList flashCards={flashCards} />
        </div>
      </div>
    </>
  );
}

export default App;
