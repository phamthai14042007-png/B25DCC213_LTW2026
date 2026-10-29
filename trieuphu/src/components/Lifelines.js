const Lifelines = ({
  usedLifelines,
  onFiftyFifty,
  onAskAudience,
  onStop,
  status,
}) => {
  return (
    <div className="lifelines">
      <button
        type="button"
        onClick={onFiftyFifty}
        disabled={usedLifelines.fiftyFifty || status !== "answering"}
      >
        50:50
      </button>

      <button
        type="button"
        onClick={onAskAudience}
        disabled={usedLifelines.audience || status !== "answering"}
      >
        Hỏi khán giả
      </button>

      <button
        type="button"
        onClick={onStop}
        disabled={status !== "answering"}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;
