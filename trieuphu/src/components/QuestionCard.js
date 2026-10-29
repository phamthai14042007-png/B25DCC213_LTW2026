import { LETTERS } from "../data";
import AnswerButton from "./AnswerButton";

const QuestionCard = ({
  question,
  questionNumber,
  onAnswer,
  selectedAnswer,
  status,
}) => {
  if (!question) {
    return <p>Không tìm thấy câu hỏi.</p>;
  }

  return (
    <section className="question-card">
      <h2>Câu {questionNumber}/15</h2>
      <p className="question-text">{question.question}</p>

      <div className="answer-grid">
        {question.options.map((option, index) => {
          let className = "";

          if (selectedAnswer === index && status === "locked") {
            className = "selected";
          }

          if (status === "revealed" && index === question.answer) {
            className = "correct";
          } else if (
            status === "revealed" &&
            selectedAnswer === index &&
            selectedAnswer !== question.answer
          ) {
            className = "wrong";
          }

          return (
            <AnswerButton
              key={index}
              letter={LETTERS[index]}
              option={option}
              onClick={() => onAnswer(index)}
              disabled={status !== "answering"}
              className={className}
            />
          );
        })}
      </div>
    </section>
  );
};

export default QuestionCard;
