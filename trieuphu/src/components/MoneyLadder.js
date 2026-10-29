import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ currentQuestion }) => {
  return (
    <div className="money-ladder">
      <h3>Tiền thưởng</h3>

      <ol>
        {PRIZES.map((prize, index) => {
          const questionNumber = index + 1;
          const isCurrent = questionNumber === currentQuestion;
          const isMilestone = MILESTONES.includes(questionNumber);

          return (
            <li
              key={questionNumber}
              className={[
                isCurrent ? "current-prize" : "",
                isMilestone ? "milestone-prize" : "",
              ].filter(Boolean).join(" ")}
            >
              <span>Câu {questionNumber}</span>
              <span>{formatMoney(prize)}</span>
            </li>
          );
        }).reverse()}
      </ol>
    </div>
  );
};

export default MoneyLadder;
