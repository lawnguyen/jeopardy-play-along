import React, { useState } from "react";
import "bulma/css/bulma.min.css";

interface JeopardyRoundProps {
  setScore: (score: number) => void;
  score: number;
  values: number[];
  roundName: string;
}

const JeopardyRound: React.FC<JeopardyRoundProps> = ({ setScore, score, values, roundName }) => {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [isDailyDouble, setIsDailyDouble] = useState<boolean>(false);
  const [wager, setWager] = useState<number>(0);

  const handleValueSelect = (value: number) => {
    setCurrentValue(value);
    setIsDailyDouble(false);
    setWager(0);
  };

  const handleDailyDouble = () => {
    setIsDailyDouble(true);
    setCurrentValue(null);
  };

  const handleRight = () => {
    if (isDailyDouble && (wager > score || wager <= 0)) return;
    setScore(score + (isDailyDouble ? wager : currentValue!));
    resetSelection();
  };

  const handleWrong = () => {
    if (isDailyDouble && (wager > score || wager <= 0)) return;
    setScore(score - (isDailyDouble ? wager : currentValue!));
    resetSelection();
  };

  const resetSelection = () => {
    setCurrentValue(null);
    setIsDailyDouble(false);
    setWager(0);
  };

  return (
    <div className="section has-text-centered">
      <h3 className="title is-4">{roundName}</h3>
      <div className="buttons is-centered">
        {values.map((value) => (
          <button 
            key={value} 
            className={`button is-large ${currentValue === value ? "is-primary" : "is-primary is-light"}`} 
            onClick={() => handleValueSelect(value)}
          >
            ${value}
          </button>
        ))}
      </div>
      <button className="button is-warning is-large mt-3" onClick={handleDailyDouble}>Daily Double</button>
      {isDailyDouble && (
        <div className="field mt-3">
          <label className="label">Enter Wager</label>
          <div className="control">
            <input
              className="input is-large"
              type="number"
              value={wager === 0 ? "" : wager}
              onChange={(e) => setWager(Number(e.target.value))}
            />
          </div>
        </div>
      )}
      <div className="buttons is-centered mt-3">
        <button className="button is-success is-large" onClick={handleRight} disabled={!currentValue && !isDailyDouble}>Right</button>
        <button className="button is-danger is-large" onClick={handleWrong} disabled={!currentValue && !isDailyDouble}>Wrong</button>
      </div>
    </div>
  );
};

interface FinalJeopardyProps {
  setScore: (score: number) => void;
  score: number;
}

const FinalJeopardy: React.FC<FinalJeopardyProps> = ({ setScore, score }) => {
  const [wager, setWager] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");

  const handleRight = () => {
    if (wager > score || wager <= 0) return;
    setScore(score + wager);
    resetFinal();
  };

  const handleWrong = () => {
    if (wager > score || wager <= 0) return;
    setScore(score - wager);
    resetFinal();
  };
  
  const resetFinal = () => {
    setWager(0);
    setAnswer("");
  };

  return (
    <div className="section has-text-centered">
      <h3 className="title is-4">Final Jeopardy</h3>
      <div className="field">
        <label className="label">Wager</label>
        <div className="control">
          <input className="input is-large" type="number" value={wager === 0 ? "" : wager} onChange={(e) => setWager(Number(e.target.value))} />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input className="input is-large" type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
      </div>
      <div className="buttons is-centered mt-3">
        <button className="button is-success is-large" onClick={handleRight}>Right</button>
        <button className="button is-danger is-large" onClick={handleWrong}>Wrong</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [view, setView] = useState<string>("regular");
  
  return (
    <div className="container mt-5">
      <h1 className="title has-text-centered">Jeopardy Play-Along</h1>
      <h2 className="subtitle has-text-centered" style={{ fontSize: "3rem", fontWeight: "bold" }}>Total Score: {score}</h2>
      <div className="has-text-centered mb-4">
        <button className="button is-danger is-small" onClick={() => setScore(0)}>Reset Score</button>
      </div>
      <nav className="tabs is-centered">
        <ul>
          <li className={view === "regular" ? "is-active" : ""}><a onClick={() => setView("regular")}>Regular Jeopardy</a></li>
          <li className={view === "double" ? "is-active" : ""}><a onClick={() => setView("double")}>Double Jeopardy</a></li>
          <li className={view === "final" ? "is-active" : ""}><a onClick={() => setView("final")}>Final Jeopardy</a></li>
        </ul>
      </nav>
      {view === "regular" && <JeopardyRound setScore={setScore} score={score} values={[200, 400, 600, 800, 1000]} roundName="Regular Jeopardy" />}
      {view === "double" && <JeopardyRound setScore={setScore} score={score} values={[400, 800, 1200, 1600, 2000]} roundName="Double Jeopardy" />}
      {view === "final" && <FinalJeopardy setScore={setScore} score={score} />}
    </div>
  );
};

export default App;
