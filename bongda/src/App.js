import GoalPlanner from './components/GoalPlanner';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import useFetch from './hooks/useFetch';

import useLocalStorage from './hooks/useLocalStorage';

import MatchRow from './components/MatchRow';

import useDebounce from './hooks/useDebounce';

import {
  TEAMS,
  ROUNDS,
  MAX_GOALS,
} from './data';

import {
  getTeamName,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

import { useSelector, useDispatch } from 'react-redux';

import { hasSaved } from './store';

import {
  selectMatches,
  setMatches,
  addMatch,
  removeMatch,
  setGoals,
} from './features/matchesSlice';

import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');

  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();

  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedRound, setSelectedRound] = useLocalStorage(
    'ltw_bongda_round',
    'all'
  );

  const [searchTeam, setSearchTeam] = useState('');

  const debouncedSearch = useDebounce(searchTeam, 300);
  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName;

      if (event.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchTeam('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [form, setForm] = useState({
    round: '1',
    home: '',
    away: '',
    homeGoals: '',
    awayGoals: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const homeSelectRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (data && !hasSaved) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);
  const roundMatches = useMemo(() => {
  if (selectedRound === 'all') {
    return matches;
  }

  return matches.filter(
    (match) => match.round === Number(selectedRound)
  );
}, [matches, selectedRound]);
const handleTeamShift = useCallback((event) => {
  setSearchTeam(event.target.value);
}, []);

  const filteredMatches = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    if (!keyword) {
      return roundMatches;
    }

    return roundMatches.filter((match) => {
    const homeName = getTeamName(match.home).toLowerCase();
    const awayName = getTeamName(match.away).toLowerCase();

    return (
      homeName.includes(keyword) ||
      awayName.includes(keyword)
    );
  });
}, [roundMatches, debouncedSearch]);

const standings = useMemo(() => {
  return calcStandings(matches);
}, [matches]);
const stats = useMemo(() => {
  return calcMatchStats(roundMatches);
}, [roundMatches]);
useEffect(() => {
  if (matches.length > 0) {
    document.title = `${standings[0]?.name} dẫn đầu – Giải bóng đá khoa`;
  } else {
    document.title = 'Giải bóng đá khoa';
  }
}, [matches.length, standings]);
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

  dispatch(addMatch({
    round: Number(form.round),
    home: Number(form.home),
    away: Number(form.away),
    homeGoals: Number(form.homeGoals),
    awayGoals: Number(form.awayGoals),
  }));
  showNotice(
    `Đã thêm trận ${getTeamName(Number(form.home))} - ${getTeamName(Number(form.away))}`
  );

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
const handleGoals = useCallback((id, field, value) => {
  dispatch(setGoals({ id, field, value }));
}, [dispatch]);

const handleRemove = useCallback((match) => {
  showNotice(
    `Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`
  );
  dispatch(removeMatch(match.id));
}, [dispatch, showNotice]);

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>GIẢI BÓNG ĐÁ KHOA</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

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
        <div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm kiếm tên đội bóng..." 
            value={searchTeam}
            onChange={handleTeamShift}
          />
          <p>Tìm thấy {filteredMatches.length} trận</p>
        </div>
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
              <th>Số lần render</th>
              <th>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {filteredMatches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                onGoals={handleGoals}
                onRemove={handleRemove}
              />
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={() => {
          if (data) {
            dispatch(setMatches(data));
            showNotice('Đã đặt lại dữ liệu mẫu');
          }
        }}
      >
        Đặt lại dữ liệu mẫu
      </button>
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
        <h2>Phân bố kết quả</h2>

        <div>
          {[
            { label: 'Đội nhà thắng', count: stats.counts.home },
            { label: 'Hòa', count: stats.counts.draw },
            { label: 'Đội khách thắng', count: stats.counts.away },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: '10px' }}>
              <span>{item.label}: {item.count}</span>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    height: '10px',
                    width: `${item.count * 24}px`,
                    backgroundColor: 'green',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Form thêm trận đấu */}
        <GoalPlanner />
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