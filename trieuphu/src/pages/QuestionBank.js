import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

function QuestionBank({ questions, loading, error }) {
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const handleQueryShift = (event) => {
    setQuery(event.target.value);
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesLevel =
      level === "all" || String(question.level) === level;

    const matchesQuery = question.question
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    return matchesLevel && matchesQuery;
  });

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p>Không tải được câu hỏi</p>;
  }

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="question-filters">
        <label htmlFor="level-filter">Mức độ: </label>
        <select
          id="level-filter"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <label htmlFor="question-search"> Tìm kiếm: </label>
        <input
          id="question-search"
          type="text"
          value={query}
          onChange={handleQueryShift}
          placeholder="Nhập nội dung câu hỏi..."
        />
      </div>

      <p>Có {filteredQuestions.length} câu hỏi</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuestions.map((question, index) => (
            <tr key={question.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[question.level]}</td>
              <td>
                <Link to={`/questions/${question.id}`}>
                  {question.question}
                </Link>
              </td>
            </tr>
          ))}

          {filteredQuestions.length === 0 && (
            <tr>
              <td colSpan="3">Không tìm thấy câu hỏi phù hợp</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuestionBank;
