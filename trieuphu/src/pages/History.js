import { useOutletContext } from "react-router-dom";
import { formatMoney } from "../data";

const History = () => {
  const { history, onClearHistory } = useOutletContext();

  const sortedHistory = [...history].sort(
    (a, b) => b.prize - a.prize
  );

  const totalPrize = history.reduce(
    (total, record) => total + record.prize,
    0
  );

  const highestPrize = history.reduce(
    (highest, record) => Math.max(highest, record.prize),
    0
  );

  return (
    <div className="history-page">
      <h1>Lịch sử chơi</h1>

      <p>Số lượt chơi: {history.length}</p>
      <p>Tiền thưởng cao nhất: {formatMoney(highestPrize)}</p>
      <p>Tổng tiền thưởng: {formatMoney(totalPrize)}</p>

      <button
        type="button"
        onClick={onClearHistory}
        disabled={history.length === 0}
      >
        Xóa lịch sử
      </button>

      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Tiền thưởng</th>
              <th>Thời gian</th>
            </tr>
          </thead>

          <tbody>
            {sortedHistory.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.correctCount}/15</td>
                <td>{formatMoney(record.prize)}</td>
                <td>{record.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;