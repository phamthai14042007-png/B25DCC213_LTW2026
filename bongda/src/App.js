import React, {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import matchesReducer from './matchesReducer';
import useFetch from './hooks/useFetch';

import {
  TEAMS,
  ROUNDS,
  MAX_GOALS,
  RESULT_LABELS,
} from './data';

import {
  getTeamName,
  getResult,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');

  const [matches, dispatch] = useReducer(matchesReducer, []);

  const [selectedRound, setSelectedRound] = useState('all');

  const [form, setForm] = useState({
    round: '1',
    home: '',
    away: '',
    homeGoals: '',
    awayGoals: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const homeSelectRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'LOAD',
        payload: data,
      });
    }
  }, [data]);
  const filteredMatches = useMemo(() => {
  if (selectedRound === 'all') {
    return matches;
  }

  return matches.filter(
    (match) => match.round === Number(selectedRound)
  );
}, [matches, selectedRound]);

const standings = useMemo(() => {
  return calcStandings(matches);
}, [matches]);
const stats = useMemo(() => {
  return calcMatchStats(filteredMatches);
}, [filteredMatches]);
const handleFormChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  setFormErrors((prev) => ({
    ...prev,
    [name]: '',
  }));
};

const handleAddMatch = (e) => {
  e.preventDefault();

  const errors = {};

  if (!form.home) {
    errors.home = 'Hãy chọn đội nhà';
  }

  if (!form.away) {
    errors.away = 'Hãy chọn đội khách';
  } else if (form.home && form.home === form.away) {
    errors.away = 'Hai đội phải khác nhau';
  } else if (
    form.home &&
    matches.some(
      (match) =>
        (match.home === Number(form.home) &&
          match.away === Number(form.away)) ||
        (match.home === Number(form.away) &&
          match.away === Number(form.home))
    )
  ) {
    errors.away = 'Hai đội đã đá với nhau rồi';
  }

  if (!isValidGoals(form.homeGoals)) {
    errors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
  }

  if (!isValidGoals(form.awayGoals)) {
    errors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
  }

  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    return;
  }

  dispatch({
    type: 'ADD',
    payload: {
      round: Number(form.round),
      home: Number(form.home),
      away: Number(form.away),
      homeGoals: Number(form.homeGoals),
      awayGoals: Number(form.awayGoals),
    },
  });

  setForm({
    round: '1',
    home: '',
    away: '',
    homeGoals: '',
    awayGoals: '',
  });

  setFormErrors({});
  homeSelectRef.current?.focus();
};

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>GIẢI BÓNG ĐÁ KHOA</h1>

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p>Lỗi: {error}</p>}

      {/* Bộ lọc vòng đấu */}
      <h2>Lịch thi đấu</h2>

      <div className="round-filter">
        <label htmlFor="roundFilter">Chọn vòng đấu: </label>

        <select
          id="roundFilter"
          value={selectedRound}
          onChange={(e) => setSelectedRound(e.target.value)}
        >
          <option value="all">Tất cả</option>

          {ROUNDS.map((round) => (
            <option key={round} value={round}>
              Vòng {round}
            </option>
          ))}
        </select>
      </div>
      {filteredMatches.length === 0 ? (
        <p>Chưa có trận đấu nào</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vòng</th>
              <th>Đội nhà</th>
              <th>Tỷ số</th>
              <th>Đội khách</th>
              <th>Kết quả</th>
              <th>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {filteredMatches.map((match) => (
              <tr
                key={match.id}
                style={
                  getResult(match) === 'draw'
                    ? { backgroundColor: 'rgba(255, 193, 7, 0.25)' }
                    : {}
                }
              >
                <td>{match.round}</td>
                <td>{getTeamName(match.home)}</td>

                <td>
                  <input
                    type="number"
                    min="0"
                    max={MAX_GOALS}
                    aria-label={`Bàn thắng đội nhà trận ${match.id}`}
                    value={match.homeGoals}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!isValidGoals(value)) return;

                      dispatch({
                        type: 'SET_GOALS',
                        payload: {
                          id: match.id,
                          field: 'homeGoals',
                          value: Number(value),
                        },
                      });
                    }}
                  />

                  -

                  <input
                    type="number"
                    min="0"
                    max={MAX_GOALS}
                    aria-label={`Bàn thắng đội khách trận ${match.id}`}
                    value={match.awayGoals}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!isValidGoals(value)) return;

                      dispatch({
                        type: 'SET_GOALS',
                        payload: {
                          id: match.id,
                          field: 'awayGoals',
                          value: Number(value),
                        },
                      });
                    }}
                  />
                </td>

                <td>{getTeamName(match.away)}</td>

                <td>{RESULT_LABELS[getResult(match)]}</td>

                <td>
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE',
                        payload: match.id,
                      })
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Bảng xếp hạng */}
      <h2>Bảng xếp hạng</h2>

      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Đội</th>
            <th>Trận</th>
            <th>Thắng</th>
            <th>Hòa</th>
            <th>Thua</th>
            <th>BT</th>
            <th>BB</th>
            <th>HS</th>
            <th>Điểm</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((team, index) => (
            <tr
              key={team.id}
              style={
                index === standings.length - 1
                  ? { color: '#c62828' }
                  : {}
              }
            >
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.drawn}</td>
              <td>{team.lost}</td>
              <td>{team.gf}</td>
              <td>{team.ga}</td>
              <td>{team.diff > 0 ? `+${team.diff}` : team.diff}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Thống kê trận đấu */}
      <h2>Thống kê giải đấu</h2>

      <p>Số trận: {stats.count}</p>

      <p>Tổng số bàn thắng: {stats.goals}</p>

      <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>

      <p>
        Đội dẫn đầu: {standings[0]?.name} ({standings[0]?.points} điểm)
        {/* Form thêm trận đấu */}
        <h2>Thêm trận đấu mới</h2>

        <form onSubmit={handleAddMatch}>
          <div>
            <label htmlFor="round">Vòng đấu:</label>
            <select
              id="round"
              name="round"
              value={form.round}
              onChange={handleFormChange}
            >
              {ROUNDS.map((round) => (
                <option key={round} value={round}>
                  Vòng {round}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="home">Đội nhà:</label>
            <select
              id="home"
              name="home"
              ref={homeSelectRef}
              value={form.home}
              onChange={handleFormChange}
            >
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {formErrors.home && <p>{formErrors.home}</p>}
          </div>

          <div>
            <label htmlFor="away">Đội khách:</label>
            <select
              id="away"
              name="away"
              value={form.away}
              onChange={handleFormChange}
            >
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {formErrors.away && <p>{formErrors.away}</p>}
          </div>

          <div>
            <label htmlFor="homeGoals">Bàn thắng đội nhà:</label>
            <input
              id="homeGoals"
              name="homeGoals"
              type="number"
              min="0"
              max={MAX_GOALS}
              value={form.homeGoals}
              onChange={handleFormChange}
            />
            {formErrors.homeGoals && <p>{formErrors.homeGoals}</p>}
          </div>

          <div>
            <label htmlFor="awayGoals">Bàn thắng đội khách:</label>
            <input
              id="awayGoals"
              name="awayGoals"
              type="number"
              min="0"
              max={MAX_GOALS}
              value={form.awayGoals}
              onChange={handleFormChange}
            />
            {formErrors.awayGoals && <p>{formErrors.awayGoals}</p>}
          </div>

          <button type="submit">Thêm trận đấu</button>
        </form>
      </p>
    </div>
  );
}

export default App;