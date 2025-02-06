/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState, ReactNode } from 'react';
import 'bulma/css/bulma.min.css';
import AddToHomeScreenImage from './add-to-home-screen.png';

interface JeopardyRoundProps {
  setScore: (score: number) => void;
  score: number;
  values: number[];
  roundName: string;
}

const JeopardyRound: React.FC<JeopardyRoundProps> = ({
  setScore,
  score,
  values,
  roundName,
}) => {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [isDailyDouble, setIsDailyDouble] = useState<boolean>(false);
  const [wager, setWager] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_CLUE_VALUE = roundName === 'Double Jeopardy!' ? 2000 : 1000;

  const handleValueSelect = (value: number) => {
    setCurrentValue(value);
    setIsDailyDouble(false);
    setWager(0);
    setError(null);
  };

  const handleDailyDouble = () => {
    setIsDailyDouble(true);
    setCurrentValue(null);
    setError(null);
  };

  const handleRight = () => {
    const maxWager = score < MAX_CLUE_VALUE ? MAX_CLUE_VALUE : score;
    console.log(maxWager);
    console.log(score);
    if (isDailyDouble && (wager > maxWager || wager <= 0)) {
      setError(`Wager must be between 1 and ${maxWager}`);
      return;
    }
    setScore(score + (isDailyDouble ? wager : currentValue!));
    resetSelection();
  };

  const handleWrong = () => {
    const maxWager = score < MAX_CLUE_VALUE ? MAX_CLUE_VALUE : score;
    if (isDailyDouble && (wager > maxWager || wager <= 0)) {
      setError(`Wager must be between 1 and ${maxWager}`);
      return;
    }
    setScore(score - (isDailyDouble ? wager : currentValue!));
    resetSelection();
  };

  const handlePass = () => {
    resetSelection();
  };

  const resetSelection = () => {
    setCurrentValue(null);
    setIsDailyDouble(false);
    setWager(0);
    setError(null);
  };

  return (
    <div className="section pt-4 has-text-centered">
      <h4 className="title is-4">{roundName}</h4>
      <div className="buttons is-centered">
        {values.map((value) => (
          <button
            key={value}
            className={`button is-large ${
              currentValue === value ? 'is-primary is-active' : 'is-primary'
            }`}
            onClick={() => handleValueSelect(value)}
          >
            ${value}
          </button>
        ))}
      </div>
      <button
        className="button is-link is-dark is-large mt-3"
        onClick={handleDailyDouble}
      >
        🎲 Daily Double
      </button>
      {isDailyDouble && (
        <div className="field mt-3">
          <label className="label">Enter Wager</label>
          <div className="control">
            <input
              className="input is-large"
              type="number"
              value={wager === 0 ? '' : wager}
              onChange={(e) => setWager(Number(e.target.value))}
            />
          </div>
        </div>
      )}
      {error && <p className="has-text-danger">{error}</p>}
      <div className="buttons is-centered mt-3">
        <button
          className="button is-success is-large"
          onClick={handleRight}
          disabled={!currentValue && !isDailyDouble}
        >
          ✅ Right
        </button>
        <button
          className="button is-danger is-large"
          onClick={handleWrong}
          disabled={!currentValue && !isDailyDouble}
        >
          ❌ Wrong
        </button>
        <button
          className="button is-warning is-large"
          onClick={handlePass}
          disabled={!currentValue && !isDailyDouble}
        >
          ⏭️ Pass
        </button>
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
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleRight = () => {
    const maxWager = score;
    if (wager > maxWager || wager <= 0) {
      setError(
        maxWager === 0
          ? 'Nothing to wager'
          : `Wager must be between 1 and ${maxWager}`
      );
      setIsLocked(false);
      return;
    }
    setScore(score + wager);
    resetFinal();
  };

  const handleWrong = () => {
    const maxWager = score;
    if (wager > maxWager || wager <= 0) {
      setError(
        maxWager === 0
          ? 'Nothing to wager'
          : `Wager must be between 1 and ${maxWager}`
      );
      setIsLocked(false);
      return;
    }
    setScore(score - wager);
    resetFinal();
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const resetFinal = () => {
    setWager(0);
    setAnswer('');
    setError(null);
    setIsLocked(false);
  };

  return (
    <div className="section pt-4 has-text-centered">
      <h4 className="title is-4">Final Jeopardy!</h4>
      <div className="field">
        <label className="label">Wager</label>
        <div className="control">
          <input
            className="input is-large"
            type="number"
            value={wager === 0 ? '' : wager}
            onChange={(e) => setWager(Number(e.target.value))}
            disabled={isLocked}
          />
        </div>
        <button
          className="button is-small is-info is-light mt-2"
          onClick={handleLock}
          disabled={isLocked}
        >
          {isLocked ? '🔒 Wager locked' : '🔓 Lock in wager'}
        </button>
      </div>
      <div className="field">
        <label className="label">Answer</label>
        <div className="control">
          <input
            className="input is-large"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="has-text-danger">{error}</p>}
      <div className="buttons is-centered mt-3">
        <button className="button is-success is-large" onClick={handleRight}>
          ✅ Right
        </button>
        <button className="button is-danger is-large" onClick={handleWrong}>
          ❌ Wrong
        </button>
      </div>
    </div>
  );
};

const Modal: React.FC<{
  isActive: boolean;
  toggleModal: () => void;
  title: string;
  children: ReactNode;
}> = ({ isActive, toggleModal, title, children }) => (
  <div className={`modal ${isActive ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={toggleModal}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{title}</p>
        <button
          className="delete"
          aria-label="close"
          onClick={toggleModal}
        ></button>
      </header>
      <section className="modal-card-body">{children}</section>
      <footer className="modal-card-foot is-flex is-justify-content-end">
        <div className="buttons">
          <button className="button" onClick={toggleModal}>
            Close
          </button>
        </div>
      </footer>
    </div>
    <button
      className="modal-close is-large"
      aria-label="close"
      onClick={toggleModal}
    ></button>
  </div>
);

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [view, setView] = useState<string>('regular');
  const [isModalActive, setIsModalActive] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalActive(!isModalActive);
  };

  return (
    <div className="container">
      <div className="buttons  block">
        <button className="button is-text" onClick={toggleModal}>
          Use as an App
        </button>
        <button className="button is-text" onClick={toggleModal}>
          Use as an App
        </button>
      </div>
      <Modal
        isActive={isModalActive}
        toggleModal={toggleModal}
        title="Use as an App"
      >
        <p className="block">
          No need to download an app! You can use this web app as a standalone
          app on your phone.
        </p>
        <p>
          On iOS browsers, click the share button and select "Add to Home
          Screen".
        </p>
        <p className="block">
          Similarly, on Android browsers, find the "Add to Home Screen" or
          "Install App" option.
        </p>
        <img
          className="image block"
          src={AddToHomeScreenImage}
          alt="On iOS, click share and add to home screen"
        />
      </Modal>
      <h1
        className="title is-1 has-text-centered"
        style={{ fontWeight: 'bold' }}
      >
        Score: ${score}
      </h1>
      <div className="has-text-centered mb-4">
        <button
          className="button is-danger is-small"
          onClick={() => setScore(0)}
        >
          Reset
        </button>
      </div>
      <div className="tabs is-centered is-boxed">
        <ul>
          <li className={view === 'regular' ? 'is-active' : ''}>
            <a onClick={() => setView('regular')}>Jeopardy!</a>
          </li>
          <li className={view === 'double' ? 'is-active' : ''}>
            <a onClick={() => setView('double')}>Double Jeopardy!</a>
          </li>
          <li className={view === 'final' ? 'is-active' : ''}>
            <a onClick={() => setView('final')}>Final Jeopardy!</a>
          </li>
        </ul>
      </div>
      {view === 'regular' && (
        <JeopardyRound
          setScore={setScore}
          score={score}
          values={[200, 400, 600, 800, 1000]}
          roundName="Jeopardy!"
        />
      )}
      {view === 'double' && (
        <JeopardyRound
          setScore={setScore}
          score={score}
          values={[400, 800, 1200, 1600, 2000]}
          roundName="Double Jeopardy!"
        />
      )}
      {view === 'final' && <FinalJeopardy setScore={setScore} score={score} />}
    </div>
  );
};

export default App;
