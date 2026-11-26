const matchesReducer = (state, action) => {
  switch (action.type) {
    // Tải danh sách trận đấu
    case 'LOAD':
      return action.payload;

    // Thêm trận đấu mới
    case 'ADD': {
      const newId =
        state.reduce((maxId, match) => Math.max(maxId, match.id), 0) + 1;

      return [
        ...state,
        {
          ...action.payload,
          id: newId,
        },
      ];
    }

    // Xóa trận đấu
    case 'REMOVE':
      return state.filter((match) => match.id !== action.payload);

    // Cập nhật tỷ số
    case 'SET_GOALS':
      return state.map((match) =>
        match.id === action.payload.id
          ? {
              ...match,
              [action.payload.field]: action.payload.value,
            }
          : match
      );

    default:
      return state;
  }
};

export default matchesReducer;