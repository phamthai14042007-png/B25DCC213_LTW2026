import React, { memo, useRef } from 'react';

import {
  MAX_GOALS,
  RESULT_LABELS,
} from '../data';

import {
  getResult,
  getTeamName,
  isValidGoals,
} from '../utils';

function MatchRow({ match, onGoals, onRemove }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <tr
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
            if (isValidGoals(value)) {
              onGoals(match.id, 'homeGoals', Number(value));
            }
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
            if (isValidGoals(value)) {
              onGoals(match.id, 'awayGoals', Number(value));
            }
          }}
        />
      </td>

      <td>{getTeamName(match.away)}</td>
      <td>{RESULT_LABELS[getResult(match)]}</td>
      <td>{renderCount.current}</td>

      <td>
        <button onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
}

export default memo(MatchRow);