import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRIZES, TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [status, setStatus] = useState("answering");
  const [reason, setReason] = useState("");

  const question = questions[questionIndex];

  const finishGame = useCallback((endReason, correctCount) => {
  navigate("/result", {
    replace: true,
    state: {
      playerName,
      correctCount,
      prize:
        endReason === "win"
          ? PRIZES[PRIZES.length - 1]
          : calcPrize(correctCount),
      reason: endReason,
    },
  });
}, [navigate, playerName]);

  const handleAnswer = (answerIndex) => {
    if (status !== "answering") return;

    setSelectedAnswer(answerIndex);
    setReason(answerIndex === question.answer ? "correct" : "wrong");
    setStatus("locked");
  };

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

          <h2>
            Câu {questionIndex + 1}/{questions.length}
          </h2>

          <QuestionCard
            question={question}
            questionNumber={questionIndex + 1}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            status={status}
          />
        </div>

        <MoneyLadder currentQuestion={questionIndex + 1} />
      </div>
    </div>
  );
};

export default Play;
