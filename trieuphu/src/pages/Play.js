import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";

const Play = ({ questions, playerName, onGameEnd }) => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [status, setStatus] = useState("answering");
  const [reason, setReason] = useState("");

  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
  });

  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [audiencePercentages, setAudiencePercentages] = useState(null);

  const question = questions[questionIndex];
  

useEffect(() => {
  document.title = `Câu ${questionIndex + 1}/${questions.length} – ${playerName}`;

  return () => {
    document.title = "Ai là triệu phú";
  };
}, [questionIndex, questions.length, playerName]);



  const handleFiftyFifty = () => {
    if (status !== "answering" || usedLifelines.fiftyFifty) return;

    const wrongAnswers = question.options
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== question.answer && !hiddenAnswers.includes(index)
      );

    const shuffled = [...wrongAnswers].sort(
      () => Math.random() - 0.5
    );
    const answersToHide = shuffled.slice(0, 2);

    setHiddenAnswers((previous) => [...previous, ...answersToHide]);
    setUsedLifelines((previous) => ({
      ...previous,
      fiftyFifty: true,
    }));
  };


const handleAskAudience = () => {
  if (status !== "answering" || usedLifelines.audience) return;

  const correctIndex = question.answer;
  const percentages = [0, 0, 0, 0];

  const visibleWrongAnswers = question.options
    .map((_, index) => index)
    .filter(
      (index) =>
        index !== correctIndex && !hiddenAnswers.includes(index)
    );

  const correctPercentage = Math.floor(Math.random() * 31) + 40;
  percentages[correctIndex] = correctPercentage;

  let remaining = 100 - correctPercentage;

  if (visibleWrongAnswers.length > 0) {
    const shuffled = [...visibleWrongAnswers].sort(
      () => Math.random() - 0.5
    );

    shuffled.forEach((index, position) => {
      if (position === shuffled.length - 1) {
        percentages[index] = remaining;
      } else {
        const maxValue = remaining;
        const value = Math.floor(Math.random() * (maxValue + 1));
        percentages[index] = value;
        remaining -= value;
      }
    });
  }

  setAudiencePercentages(percentages);
  setUsedLifelines((previous) => ({
    ...previous,
    audience: true,
  }));
};


const finishGame = useCallback((endReason, correctCount) => {
  const prize = calcPrize(correctCount, endReason);

  const result = {
    playerName,
    correctCount,
    prize,
    reason: endReason,
  };

  onGameEnd(result);

  navigate("/result", {
    replace: true,
    state: result,
  });
}, [navigate, playerName, onGameEnd]);



  
const handleAnswer = useCallback((answerIndex) => {
  if (status !== "answering") return;
  setSelectedAnswer(answerIndex);
  setReason(answerIndex === question.answer ? "correct" : "wrong");
  setStatus("locked");
}, [status, question]);
useEffect(() => {
  const handleKey = (event) => {
    if (status !== "answering") return;

    const key = event.key.toUpperCase();
    const answerIndex = ["A", "B", "C", "D"].indexOf(key);

    if (answerIndex === -1) return;
    if (hiddenAnswers.includes(answerIndex)) return;

    handleAnswer(answerIndex);
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("keydown", handleKey);
  };
}, [status, hiddenAnswers, handleAnswer]);


  useEffect(() => {
    if (status !== "answering") return undefined;

    const intervalId = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(intervalId);
          setReason("timeout");
          setStatus("revealed");
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, questionIndex]);

  useEffect(() => {
    if (status === "locked") {
      const timeoutId = setTimeout(() => {
        setStatus("revealed");
      }, 1000);

      return () => clearTimeout(timeoutId);
    }

    if (status === "revealed") {
      const timeoutId = setTimeout(() => {
        const isCorrect = reason === "correct";

        if (isCorrect) {
          if (questionIndex === questions.length - 1) {
            finishGame("win", questions.length);
          } else {
            setQuestionIndex((previousIndex) => previousIndex + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelectedAnswer(null);
            setReason("");
            setHiddenAnswers([]);
            setAudiencePercentages(null);
            setStatus("answering");
          }
        } else {
          finishGame(reason === "timeout" ? "timeout" : "wrong", questionIndex);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [status, reason, questionIndex, questions.length, finishGame]);

  if (!questions.length) {
    return <p>Đang tải câu hỏi...</p>;
  }

  return (
    <div className="play-page">
      <h1>Ai là triệu phú</h1>
      <p>Người chơi: {playerName}</p>

      <div className="game-layout">
        <div className="game-main">
          <Timer timeLeft={timeLeft} />
          <Lifelines
            usedLifelines={usedLifelines}
            onFiftyFifty={handleFiftyFifty}
            onAskAudience={handleAskAudience}
            onStop={() => finishGame("stop", questionIndex)}
            status={status}
          />
          <AudienceChart percentages={audiencePercentages} />
          <button
            type="button"
            onClick={() => finishGame("stop", questionIndex)}
            disabled={status !== "answering"}
          >
            Dừng cuộc chơi
          </button>

          <h2>
            Câu {questionIndex + 1}/{questions.length}
          </h2>

          <QuestionCard
            question={question}
            questionNumber={questionIndex + 1}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            status={status}
            hiddenAnswers={hiddenAnswers}
          />
        </div>

        <MoneyLadder currentQuestion={questionIndex + 1} />
      </div>
    </div>
  );
};

export default Play;
