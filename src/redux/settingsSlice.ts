import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const MAX_BET = 5;
const COINS_PER_BET_ORDER = [0.25, 0.5, 1, 2, 5];

export interface SettingsState {
  coinsPerBet: number;
  speed: number;
  volume: number;
  warnMistakes: boolean;
  overlayOptimalPlay: boolean;
  webGPUAnalysis: boolean;
}

const initialState: SettingsState = {
  coinsPerBet: 1,
  speed: 2,
  volume: 0,
  warnMistakes: false,
  overlayOptimalPlay: false,
  webGPUAnalysis: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    incrementCoinsPerBet: (state) => {
      // replicate logic from your old reducer
      const currentCPBIndex =
        COINS_PER_BET_ORDER.indexOf(state.coinsPerBet) ?? 0;
      const newCPBIndex = (currentCPBIndex + 1) % COINS_PER_BET_ORDER.length;
      state.coinsPerBet = COINS_PER_BET_ORDER[newCPBIndex];
    },
    incrementSpeed: (state) => {
      state.speed = (state.speed + 1) % 4; // same logic you had before
    },
    incrementVolume: (state) => {
      state.volume = (state.volume + 1) % 3; // same logic you had before
    },
    toggleWarnMistakes: (state) => {
      state.warnMistakes = !state.warnMistakes;
    },
    toggleOverlayOptimalPlay: (state) => {
      state.overlayOptimalPlay = !state.overlayOptimalPlay;
    },
    toggleWebGPUAnalysis: (state) => {
      state.webGPUAnalysis = !state.webGPUAnalysis;
    },
  },
});

export const {
  incrementCoinsPerBet,
  incrementSpeed,
  incrementVolume,
  toggleWarnMistakes,
  toggleOverlayOptimalPlay,
  toggleWebGPUAnalysis,
} = settingsSlice.actions;

export default settingsSlice.reducer;
