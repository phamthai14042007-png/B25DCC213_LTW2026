import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches',

  initialState: [],

  reducers: {
    setMatches: (state, action) => {
      return action.payload;
    },

    addMatch: (state, action) => {
      const newId =
        state.reduce(
          (maxId, match) => Math.max(maxId, match.id),
          0
        ) + 1;

      state.push({
        ...action.payload,
        id: newId,
      });
    },

    removeMatch: (state, action) => {
      return state.filter(
        (match) => match.id !== action.payload
      );
    },

    setGoals: (state, action) => {
      const { id, field, value } = action.payload;

      const match = state.find((item) => item.id === id);

      if (match) {
        match[field] = value;
      }
    },
  },
});

export const {
  setMatches,
  addMatch,
  removeMatch,
  setGoals,
} = matchesSlice.actions;

export const selectMatches = (state) => state.matches;

export default matchesSlice.reducer;