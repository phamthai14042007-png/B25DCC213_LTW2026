const AnswerButton = ({
  letter,
  option,
  onClick,
  disabled,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`answer-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {letter}. {option}
    </button>
  );
};

export default AnswerButton;
