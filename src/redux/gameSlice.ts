import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../types/deck";
import { Hand } from "../types/hand";
import { deal } from "../mechanics/deal";
import { HoldsTable } from "../types/Hold";
import { N_HANDS, VARIANT } from "../types/variant";
import { HandInfo, Stages, Win } from "./types";
import { handToHandIdx } from "../utils/handToHandIdx";
import { winName, payout } from "../payoutCalculations";
import { handIdxToHand } from "../utils/handIdxToHand";
import { sortHand } from "../utils/sortHand";

const MAX_BET = 5;
const [initialHand, initialDeck] = deal();
const { sortedHand: initialHandSorted, sortIndex: initialHandSortOrder } =
  sortHand(initialHand);

export interface AnalysisState {
  holdsTable: HoldsTable;
  analysisTime: number;
  handIdx: number;
  variant: VARIANT;
}

export interface GameState {
  variant: VARIANT;
  nHands: N_HANDS;
  deck: Deck;
  // coins: number; <-- MOVED to stats
  betSize: number;
  // coinsPerBet: number; <-- MOVED to settings
  currentHands: HandInfo[];
  dealtHandInfo: HandInfo;
  holds: boolean[];
  stage: Stages;
  wins: Win[];
  pay: {
    payAmount: number;
    payRemaining: number;
  };
  showAnalysis: boolean;
  showWarning: boolean;
  analysis: AnalysisState;
  // statsHistory: AnalysisState[]; <-- MOVED to stats or remove if you'd prefer
  // speed: number; <-- MOVED to settings
  // volume: number; <-- MOVED to settings
  // warnMistakes: boolean; <-- MOVED to settings
  // overlayOptimalPlay: boolean; <-- MOVED to settings
}

const initialState: GameState = {
  variant: VARIANT.DEUCES_WILD,
  nHands: N_HANDS.ONE,
  deck: initialDeck,
  betSize: 1,
  currentHands: [
    {
      hand: initialHand,
      handIdx: handToHandIdx(initialHand),
      sortedHand: initialHandSorted,
      handSortOrder: initialHandSortOrder,
    },
  ],
  dealtHandInfo: {
    hand: initialHand,
    handIdx: handToHandIdx(initialHand),
    sortedHand: initialHandSorted,
    handSortOrder: initialHandSortOrder,
  },
  holds: [false, false, false, false, false],
  stage: Stages.PREGAME,
  wins: [{ winId: 0, winAmount: 0, winName: "" }],
  pay: { payAmount: 0, payRemaining: 0 },
  showAnalysis: false,
  showWarning: false,
  analysis: {
    holdsTable: [],
    analysisTime: 0,
    handIdx: -1,
    variant: VARIANT.NONE,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentHandByIdx: (state, action) => {
      const newHandIdx = action.payload;
      state.currentHands[0].handIdx = newHandIdx;
      state.currentHands[0].hand = handIdxToHand(newHandIdx);
      const { sortedHand, sortIndex } = sortHand(state.currentHands[0].hand);
      state.currentHands[0].sortedHand = sortedHand;
      state.currentHands[0].handSortOrder = sortIndex;
    },
    setCurrentHand: (state, action: PayloadAction<Hand>) => {
      state.currentHands[0].hand = action.payload;
      state.currentHands[0].handIdx = handToHandIdx(action.payload);
      const { sortedHand, sortIndex } = sortHand(state.currentHands[0].hand);
      state.currentHands[0].sortedHand = sortedHand;
      state.currentHands[0].handSortOrder = sortIndex;
    },
    setCurrentHands: (state, action: PayloadAction<Hand[]>) => {
      const hands = action.payload;
      const newHands: HandInfo[] = [];
      hands.forEach((hand) => {
        const { sortedHand, sortIndex } = sortHand(hand);
        newHands.push({
          hand,
          handIdx: handToHandIdx(hand),
          sortedHand,
          handSortOrder: sortIndex,
        });
      });
      state.currentHands = newHands;
    },
    setDealtHand: (state, action: PayloadAction<Hand>) => {
      const hand = action.payload;
      state.dealtHandInfo.hand = hand;
      state.dealtHandInfo.handIdx = handToHandIdx(hand);
      const { sortedHand, sortIndex } = sortHand(hand);
      state.dealtHandInfo.sortedHand = sortedHand;
      state.dealtHandInfo.handSortOrder = sortIndex;
    },
    setCurrentDeck: (state, action: PayloadAction<Deck>) => {
      state.deck = action.payload;
    },
    setVariant: (state, action: PayloadAction<VARIANT>) => {
      state.variant = action.payload;
    },
    setNHands: (state, action: PayloadAction<N_HANDS>) => {
      state.nHands = action.payload;
    },
    setStage: (state, action: PayloadAction<Stages>) => {
      state.stage = action.payload;
    },
    resetHolds: (state) => {
      state.holds = [false, false, false, false, false];
    },
    toggleHold: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      state.holds[idx] = !state.holds[idx];
    },
    setWin: (
      state,
      action: PayloadAction<{ winId: number; handIdx?: number }>
    ) => {
      const { winId, handIdx } = action.payload;
      const winAmount = payout(winId, state.variant);
      const name = winName(winId, state.variant);
      state.wins[handIdx ?? 0] = { winId, winAmount, winName: name };
    },
    setWins: (state, action: PayloadAction<number[]>) => {
      const winIds = action.payload;
      winIds.forEach((winId, idx) => {
        const winAmount = payout(winId, state.variant);
        const name = winName(winId, state.variant);
        state.wins[idx] = { winId, winAmount, winName: name };
      });
    },
    clearWins: (state) => {
      state.wins = [];
    },
    setPayout: (state, action: PayloadAction<number>) => {
      const payoutAmount = action.payload;
      state.pay = { payAmount: payoutAmount, payRemaining: payoutAmount };
    },
    incrementBet: (state) => {
      const incremented = state.betSize + 1;
      if (incremented > MAX_BET) {
        state.betSize = 1;
      } else {
        state.betSize = incremented;
      }
    },
    setMaxBet: (state) => {
      state.betSize = MAX_BET;
    },
    toggleShowAnalysis: (state) => {
      state.showAnalysis = !state.showAnalysis;
    },
    setShowWarning: (state, action: PayloadAction<boolean>) => {
      state.showWarning = action.payload;
    },
    setCurrentAnalysis: (
      state,
      action: PayloadAction<{
        analysis: HoldsTable;
        analysisTime: number;
        handIdx: number;
        variant: VARIANT;
      }>
    ) => {
      const { analysis, analysisTime, handIdx, variant } = action.payload;
      state.analysis = {
        holdsTable: analysis,
        analysisTime,
        handIdx,
        variant,
      };
    },
  },
});

export const {
  setCurrentHandByIdx,
  setCurrentHand,
  setCurrentHands,
  setDealtHand,
  setCurrentDeck,
  setVariant,
  setNHands,
  setStage,
  resetHolds,
  toggleHold,
  setWin,
  setWins,
  clearWins,
  setPayout,
  incrementBet,
  setMaxBet,
  toggleShowAnalysis,
  setShowWarning,
  setCurrentAnalysis,
} = gameSlice.actions;

export default gameSlice.reducer;
