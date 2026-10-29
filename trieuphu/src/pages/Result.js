import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { formatMoney } from "../data";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const { playerName, correctCount, prize, reason } = result;

  let title = "";

  if (reason === "win") {
    title = "Chúc mừng! Bạn đã trở thành triệu phú";
  } else if (reason === "wrong") {
    title = "Rất tiếc, bạn đã trả lời sai";
  } else if (reason === "timeout") {
    title = "Hết giờ!";
  } else if (reason === "stop") {
    title = "Bạn đã dừng cuộc chơi";
  }

  return (
    <div className="result-page">
      <h1>{title}</h1>

      <p>Người chơi: {playerName}</p>
      <p>Số câu trả lời đúng: {correctCount}/15</p>
      <p>Tiền thưởng: {formatMoney(prize)}</p>

      <button onClick={() => navigate("/play")}>
        Chơi lại
      </button>

      <button onClick={() => navigate("/")}>
        Về trang chủ
      </button>
    </div>
  );
}

export default Result;
