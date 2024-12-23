import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
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
const COINS_PER_BET_ORDER = [0.25, 0.5, 1, 2, 5];

type AnalysisState = {
  holdsTable: HoldsTable;
  analysisTime: number;
  handIdx: number;
  variant: VARIANT;
};

interface AppState {
  variant: VARIANT;
  nHands: N_HANDS;
  deck: Deck;
  coins: number;
  betSize: number;
  coinsPerBet: number;
  currentHands: HandInfo[];
  dealtHandInfo: HandInfo;
  holds: Array<boolean>;
  stage: Stages;
  wins: Win[];
  pay: {
    payAmount: number;
    payRemaining: number;
  };
  showAnalysis: boolean;
  analysis: AnalysisState;
  statsHistory: Array<AnalysisState>;
  speed: number;
  volume: number;
}

const [initialHand, initialDeck]: [Hand, Deck] = deal();
const { sortedHand: initialHandSorted, sortIndex: initialHandSortOrder } =
  sortHand(initialHand);

export const initialState: AppState = {
  variant: VARIANT.DEUCES_WILD, // TODO: Pull from url
  nHands: N_HANDS.ONE, // TODO: Pull from url
  deck: initialDeck,
  coins: 1000,
  betSize: 1,
  coinsPerBet: 1,
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
  analysis: {
    holdsTable: [],
    analysisTime: 0,
    handIdx: -1,
    variant: VARIANT.NONE,
  },
  statsHistory: [],
  speed: 2,
  volume: 0,
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentHandByIdx: (state, { payload: newHandIdx }) => {
      state.currentHands[0].handIdx = newHandIdx;
      state.currentHands[0].hand = handIdxToHand(newHandIdx);
      const { sortedHand, sortIndex } = sortHand(state.currentHands[0].hand);
      state.currentHands[0].sortedHand = sortedHand;
      state.currentHands[0].handSortOrder = sortIndex;
    },
    setCurrentHand: (state, { payload: hand }: { payload: Hand }) => {
      state.currentHands[0].hand = hand;
      state.currentHands[0].handIdx = handToHandIdx(hand);
      const { sortedHand, sortIndex } = sortHand(state.currentHands[0].hand);
      state.currentHands[0].sortedHand = sortedHand;
      state.currentHands[0].handSortOrder = sortIndex;
    },
    setCurrentHands: (state, { payload: hands }: { payload: Hand[] }) => {
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
    setDealtHand: (state, { payload: hand }: { payload: Hand }) => {
      state.dealtHandInfo.hand = hand;
      state.dealtHandInfo.handIdx = handToHandIdx(hand);
      const { sortedHand, sortIndex } = sortHand(state.dealtHandInfo.hand);
      state.dealtHandInfo.sortedHand = sortedHand;
      state.dealtHandInfo.handSortOrder = sortIndex;
    },
    setCurrentDeck: (state, { payload: newDeck }) => {
      state.deck = newDeck;
    },
    setVariant: (state, { payload: newVariant }) => {
      state.variant = newVariant;
    },
    setNHands: (state, { payload: nHands }) => {
      state.nHands = nHands;
    },
    increment: (state) => {
      state.coins += 1;
    },
    decrement: (state) => {
      state.coins -= 1;
    },
    incrementByAmount: (state, { payload: amount }) => {
      state.coins += amount;
    },
    decrementByAmount: (state, { payload: amount }) => {
      state.coins -= amount;
    },
    setStage: (state, { payload: stage }) => {
      state.stage = stage;
    },
    resetHolds: (state) => {
      state.holds = [false, false, false, false, false];
    },
    toggleHold: (state, { payload: idx }) => {
      state.holds[idx] = !state.holds[idx];
    },
    setWin: (
      state,
      {
        payload: { winId, handIdx },
      }: { payload: { winId: number; handIdx?: number } }
    ) => {
      // @ts-ignore
      const winAmount = payout(winId, state.variant);
      // @ts-ignore: winId is a number, not the required enum
      const name = winName(winId, state.variant);
      state.wins[handIdx ?? 0] = { winId, winAmount, winName: name };
    },
    setWins: (state, { payload: winIds }: { payload: number[] }) => {
      winIds.forEach((winId, idx) => {
        // @ts-ignore
        const winAmount = payout(winId, state.variant);
        // @ts-ignore: winId is a number, not the required enum
        const name = winName(winId, state.variant);
        state.wins[idx] = { winId, winAmount, winName: name };
      });
    },
    clearWins: (state) => {
      state.wins = [];
    },
    setPayout: (state, { payload: payoutAmount }: { payload: number }) => {
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
    incrementCoinsPerBet: (state) => {
      const currentCPBIndex =
        COINS_PER_BET_ORDER.indexOf(state.coinsPerBet) ?? 0;
      const newCPBIndex = (currentCPBIndex + 1) % COINS_PER_BET_ORDER.length;
      state.coinsPerBet = COINS_PER_BET_ORDER[newCPBIndex];
    },
    toggleShowAnalysis: (state) => {
      state.showAnalysis = !state.showAnalysis;
    },
    incrementSpeed: (state) => {
      state.speed = (state.speed + 1) % 4;
    },
    incrementVolume: (state) => {
      state.volume = (state.volume + 1) % 3;
    },
    setCurrentAnalysis: (
      state,
      {
        payload: { analysis, analysisTime, handIdx, variant },
      }: {
        payload: {
          analysis: HoldsTable;
          analysisTime: number;
          handIdx: number;
          variant: VARIANT;
        };
      }
    ) => {
      state.analysis = {
        holdsTable: analysis,
        analysisTime,
        handIdx: handIdx,
        variant: variant,
      };
    },
  },
});

export const reducers = combineReducers({ game: gameSlice.reducer });
export const {
  incrementByAmount,
  decrementByAmount,
  setVariant,
  setNHands,
  setCurrentHand,
  setCurrentHandByIdx,
  setCurrentHands,
  setDealtHand,
  setCurrentDeck,
  setStage,
  resetHolds,
  toggleHold,
  setWin,
  setWins,
  clearWins,
  setPayout,
  setMaxBet,
  incrementBet,
  incrementCoinsPerBet,
  toggleShowAnalysis,
  incrementSpeed,
  incrementVolume,
  setCurrentAnalysis,
} = gameSlice.actions;
