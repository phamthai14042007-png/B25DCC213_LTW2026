import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TEAMS } from '../data';
import { calcStandings, calcNeeded } from '../utils';

import { selectMatches } from '../features/matchesSlice';

import {
  setTeamId,
  setTarget,
  setRemaining,
} from '../features/goalSlice';

const GoalPlanner = () => {
  const dispatch = useDispatch();

  const matches = useSelector(selectMatches);

  const { teamId, target, remaining } = useSelector(
    (state) => state.goal
  );

  const standings = useMemo(
    () => calcStandings(matches),
    [matches]
  );

  const result = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <section>
      <h2>Goal Planner - Mục tiêu điểm số</h2>

      <div>
        <label htmlFor="goalTeam">Chọn đội:</label>

        <select
          id="goalTeam"
          value={teamId}
          onChange={(e) => dispatch(setTeamId(e.target.value))}
        >
          {TEAMS.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="goalTarget">Điểm mục tiêu:</label>

        <input
          id="goalTarget"
          type="number"
          min="0"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="goalRemaining">Số trận còn lại:</label>

        <input
          id="goalRemaining"
          type="number"
          min="1"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>

      <p>{result}</p>
    </section>
  );
};

export default GoalPlanner;