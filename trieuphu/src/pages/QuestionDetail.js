import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, LETTERS } from "../data";

function QuestionDetail({ questions, loading, error }) {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p>Không tải được câu hỏi</p>;
  }

  const question = questions.find((item) => item.id === Number(id));

  if (!question) {
    return <p>Không tìm thấy câu hỏi</p>;
  }

  return (
    <div>
      <h2>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h2>

      <p>{question.question}</p>

      <ul>
        {question.options.map((option, index) => (
          <li
            key={index}
            style={{
              color: index === question.answer ? "green" : "inherit",
              fontWeight: index === question.answer ? "bold" : "normal",
            }}
          >
            {LETTERS[index]}. {option}
            {index === question.answer && " (Đáp án đúng)"}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
}

export default QuestionDetail;
