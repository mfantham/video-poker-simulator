import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StatsState {
  coins: number;
  statsHistory: Array<any>;
}

export const initialState: StatsState = {
  coins: 1000,
  statsHistory: [],
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    increment: (state) => {
      state.coins += 1;
    },
    decrement: (state) => {
      state.coins -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
    },
    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.coins -= action.payload;
    },
    addStatsHistory: (state, action: PayloadAction<any>) => {
      state.statsHistory.push(action.payload);
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  addStatsHistory,
} = statsSlice.actions;

export default statsSlice.reducer;
