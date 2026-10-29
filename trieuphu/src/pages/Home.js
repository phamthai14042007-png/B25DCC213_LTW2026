const Home = ({ playerName, setPlayerName, onStart, history }) => {
  const highestRecord = history.length
    ? history.reduce((highest, record) =>
        record.prize > highest.prize ? record : highest
      )
    : null;
  return (
    <div className="home-page">
      <h1>Ai là triệu phú</h1>
        {highestRecord && (
    <p>
      Kỷ lục: {highestRecord.prize.toLocaleString("vi-VN")} đ –{" "}
      {highestRecord.name}
    </p>
  )}
      <p>Trò chơi trắc nghiệm kiến thức Lập trình Web.</p>

      <label htmlFor="player-name">Tên người chơi:</label>
      <input
        id="player-name"
        type="text"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        placeholder="Nhập tên của bạn"
      />

      <button onClick={onStart} disabled={!playerName.trim()}>
        Bắt đầu chơi
      </button>
    </div>
  );
};

export default Home;
