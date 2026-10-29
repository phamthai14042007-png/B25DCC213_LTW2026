import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Layout from "./components/Layouts";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";
import "./App.css";

const BUILD_TAG = "tp-4186";

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ltw_trieuphu_history")
      ) || [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();

  const handleStart = () => {
    if (playerName.trim()) {
      navigate("/play");
   }
  };
  const handleClearHistory = () => {
    setHistory([]);
  };
  
const handleGameEnd = (result) => {
  const record = {
    id: `${Date.now()}-${Math.random()}`,
    name: result.playerName,
    prize: result.prize,
    correctCount: result.correctCount,
    playedAt: new Date().toLocaleString("vi-VN"),
  };

  setHistory((previousHistory) => [...previousHistory, record]);
};


  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", {
        signal: controller.signal,
      })
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
          return;
        }
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);
  
useEffect(() => {
  localStorage.setItem(
    "ltw_trieuphu_history",
    JSON.stringify(history)
  );
}, [history]);


  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            history={history}
            onClearHistory={handleClearHistory}
          />
        }
      >
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              onStart={handleStart}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            playerName.trim() ? (
              <Play 
                questions={questions}
                playerName={playerName}
                onGameEnd={handleGameEnd}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />

        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

void BUILD_TAG;

export default App;

