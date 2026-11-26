import { TEAMS, POINTS } from './data';

// Lấy tên đội bóng theo ID
export const getTeamName = (teamId) => {
  const team = TEAMS.find((item) => item.id === Number(teamId));
  return team ? team.name : 'Không xác định';
};

// Xác định kết quả trận đấu
export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) {
    return 'home';
  }

  if (match.homeGoals < match.awayGoals) {
    return 'away';
  }

  return 'draw';
};

// Kiểm tra số bàn thắng hợp lệ
export const isValidGoals = (value) => {
  const goals = Number(value);

  return (
    value !== '' &&
    Number.isInteger(goals) &&
    goals >= 0 &&
    goals <= 20
  );
};

// Tính bảng xếp hạng
export const calcStandings = (matches) => {
  const standings = TEAMS.map((team) => ({
    id: team.id,
    name: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  matches.forEach((match) => {
    const home = standings.find((team) => team.id === match.home);
    const away = standings.find((team) => team.id === match.away);

    if (!home || !away) return;

    home.played++;
    away.played++;

    home.gf += match.homeGoals;
    home.ga += match.awayGoals;

    away.gf += match.awayGoals;
    away.ga += match.homeGoals;

    const result = getResult(match);

    if (result === 'home') {
      home.won++;
      home.points += POINTS.win;
      away.lost++;
    } else if (result === 'away') {
      away.won++;
      away.points += POINTS.win;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  standings.forEach((team) => {
    team.diff = team.gf - team.ga;
  });

  return standings.sort(
    (a, b) =>
      b.points - a.points ||
      b.diff - a.diff ||
      b.gf - a.gf ||
      a.name.localeCompare(b.name, 'vi')
  );
};

// Tính thống kê các trận đấu
export const calcMatchStats = (matches) => {
  const count = matches.length;

  const goals = matches.reduce(
    (total, match) => total + match.homeGoals + match.awayGoals,
    0
  );

  const counts = matches.reduce(
    (result, match) => {
      const type = getResult(match);
      result[type]++;
      return result;
    },
    { home: 0, draw: 0, away: 0 }
  );

  return {
    count,
    goals,
    average: count === 0 ? 0 : Number((goals / count).toFixed(2)),
    counts,
  };
};


export const calcNeeded = (standings, teamId, target, remaining) => {
  const team = standings.find(
    (item) => item.id === Number(teamId)
  );

  if (!team || target === '' || remaining === '') {
    return 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  }

  const targetPoints = Number(target);
  const remainingMatches = Number(remaining);

  if (
    !Number.isInteger(targetPoints) ||
    targetPoints < 0 ||
    !Number.isInteger(remainingMatches) ||
    remainingMatches < 1
  ) {
    return 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  }

  const need = targetPoints - team.points;

  if (need <= 0) {
    return 'Đội đã đạt mục tiêu';
  }

  if (need > 3 * remainingMatches) {
    return 'Không thể đạt mục tiêu này';
  }

  const wins = Math.max(
    0,
    Math.ceil((need - remainingMatches) / 2)
  );

  return `Cần thêm ${need} điểm ở ${remainingMatches} trận còn lại, tối thiểu ${wins} trận thắng`;
};