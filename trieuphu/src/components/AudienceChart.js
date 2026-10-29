
const AudienceChart = ({ percentages }) => {
  if (!percentages) return null;

  return (
    <div className="audience-chart">
      <h3>Kết quả bình chọn của khán giả</h3>

      {percentages.map((percentage, index) => {
        const letter = ["A", "B", "C", "D"][index];

        return (
          <div className="audience-row" key={letter}>
            <div className="audience-label">
              {letter}: {percentage}%
            </div>

            <div className="audience-bar-container">
              <div
                className="audience-bar"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AudienceChart;
