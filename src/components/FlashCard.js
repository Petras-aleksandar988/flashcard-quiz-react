import React from "react";
import { useState, useRef, useEffect } from "react";

export default function FlashCard({ flashCard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");
  const frontElement = useRef();
  const backElement = useRef();
  // defining height of each card itself
  function setHeightFn() {
    const frontHeight = frontElement.current.getBoundingClientRect().height;
    const backHeight = backElement.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }
  useEffect(setHeightFn, [
    flashCard.question,
    flashCard.answer,
    flashCard.options,
  ]);
  // resizing every card whenever we have to resize event.  With return we clean previous height and define a new one, so we can avoid an infinite loop
  useEffect(() => {
    window.addEventListener("resize", setHeightFn);
    return () => {
      window.removeEventListener("resize", setHeightFn);
    };
  }, []);
  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" ref={frontElement}>
        {flashCard.question}
        <div className="flashcard-options">
          {flashCard.options.map((option, index) => {
            return (
              <div key={index} className="flashcard-option">
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="back" ref={backElement}>
        {flashCard.answer}
      </div>
    </div>
  );
}
