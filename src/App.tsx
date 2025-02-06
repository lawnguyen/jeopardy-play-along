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
        className="button is-link is-dark is-large mb-3"
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
      <div className="buttons is-centered mt-5">
        <button
          className="button is-success is-medium"
          onClick={handleRight}
          disabled={!currentValue && !isDailyDouble}
        >
          <span className="emoji-only">✅</span>
          <span className="text-only">&nbsp;Right</span>
        </button>
        <button
          className="button is-danger is-medium"
          onClick={handleWrong}
          disabled={!currentValue && !isDailyDouble}
        >
          <span className="emoji-only">❌</span>
          <span className="text-only">&nbsp;Wrong</span>
        </button>
        <button
          className="button is-warning is-medium"
          onClick={handlePass}
          disabled={!currentValue && !isDailyDouble}
        >
          <span className="emoji-only">⏭️</span>
          <span className="text-only">&nbsp;Pass</span>
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
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  const validateWagerAndAnswer = () => {
    const maxWager = score;
    if (wager > maxWager || wager <= 0) {
      setError(
        maxWager === 0
          ? 'Nothing to wager'
          : `Wager must be between 1 and ${maxWager}`
      );
      setIsRevealed(true);
      return false;
    }

    if (answer.trim() === '') {
      setError('Answer cannot be empty');
      setIsRevealed(true);
      return false;
    }
    return true;
  };

  const handleRight = () => {
    if (!validateWagerAndAnswer()) {
      return;
    }
    if (isRevealed) {
      setScore(score + wager);
      resetFinal();
      return;
    } else {
      setError('Please reveal the wager and answer first');
    }
  };

  const handleWrong = () => {
    if (!validateWagerAndAnswer()) {
      return;
    }
    if (isRevealed) {
      setScore(score - wager);
      resetFinal();
      return;
    } else {
      setError('Please reveal the wager and answer first');
    }
  };

  const handleReveal = () => {
    if (!validateWagerAndAnswer()) {
      return;
    }
    setIsRevealed(!isRevealed);
    setError(null);
  };

  const resetFinal = () => {
    setWager(0);
    setAnswer('');
    setError(null);
    setIsRevealed(true);
  };

  return (
    <div className="section pt-4 has-text-centered">
      <h4 className="title is-4">Final Jeopardy!</h4>
      <div className="field">
        <label className="label">Wager</label>
        <div className="control">
          <input
            className="input is-large"
            type={isRevealed ? 'text' : 'password'}
            value={wager === 0 ? '' : wager}
            onChange={(e) => setWager(Number(e.target.value))}
            disabled={!isRevealed}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Answer</label>
        <div className="control">
          <input
            className="input is-large"
            type={isRevealed ? 'text' : 'password'}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!isRevealed}
          />
        </div>
      </div>
      <button
        className="button is-small is-info is-light mt-2"
        onClick={handleReveal}
      >
        {isRevealed ? '🔓 Hide wager and answer' : '🔒 Reveal wager and answer'}
      </button>
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
  <div className={`modal ${isActive ? 'is-active' : ''} pl-4 pr-4`}>
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
  const [isAppModalActive, setIsAppModalActive] = useState<boolean>(false);
  const [isHowToPlayModalActive, setIsHowToPlayModalActive] =
    useState<boolean>(false);

  const toggleAppModal = () => {
    setIsAppModalActive(!isAppModalActive);
  };

  const toggleHowToPlayModal = () => {
    setIsHowToPlayModalActive(!isHowToPlayModalActive);
  };

  return (
    <div className="container">
      <div className="buttons is-centered mb-4">
        <button className="button is-text" onClick={toggleHowToPlayModal}>
          How to Play Along
        </button>
        <button className="button is-text" onClick={toggleAppModal}>
          Use as an App
        </button>
      </div>
      <Modal
        isActive={isAppModalActive}
        toggleModal={toggleAppModal}
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
      <Modal
        isActive={isHowToPlayModalActive}
        toggleModal={toggleHowToPlayModal}
        title="How to Play Along"
      >
        <p className="block">
          Welcome to Jeopardy Play Along! Play solo or with friends - set your
          own ground rules and use this app to track your score.
        </p>
        <p className="block">Here are the basics:</p>
        <ol className="block pl-4">
          <li>Throw on an episode 📺</li>
          <li>
            Pick a Question Value - Click the dollar amount of the clue chosen.
          </li>
          <li>
            Answer the Clue (in the form of a question)
            <ul>
              <li>
                - Press the ✅ "Right" or the ❌ "Wrong" button to update your
                score based on your answer.
              </li>
              <li>- Press the ⏭️ "Pass" button to skip.</li>
            </ul>
          </li>
          <li>
            In Daily Double - Click the 🎲 "Daily Double" button to enter a
            wager. You may wager up to the maximum clue amount on the board if
            your score is below it. A true Daily Double is when you wager your
            entire score.
          </li>
          <li>
            Repeat Until Final Jeopardy - In Final Jeopardy, enter a wager, lock
            it in, and submit your answer.
          </li>
        </ol>
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
      <div className="tabs is-centered is-boxed is-fullwidth">
        <ul>
          <li className={view === 'regular' ? 'is-active' : ''}>
            <a onClick={() => setView('regular')}>Round One</a>
          </li>
          <li className={view === 'double' ? 'is-active' : ''}>
            <a onClick={() => setView('double')}>Round Two</a>
          </li>
          <li className={view === 'final' ? 'is-active' : ''}>
            <a onClick={() => setView('final')}>Final Round</a>
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
