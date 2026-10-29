const Timer = ({ timeLeft }) => {
  return (
    <div className={`timer ${timeLeft <= 10 ? "timer-danger" : ""}`}>
      Còn {timeLeft} giây
    </div>
  );
};

export default Timer;
