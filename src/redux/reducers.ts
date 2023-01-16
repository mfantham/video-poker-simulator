import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { Deck } from "../types/deck";
import { Hand } from "../types/hand";
import { deal } from "../mechanics/deal";
import { VARIANT } from "../types/variant";
import { indexOfCombination } from "../strategy/combinations";
import { Stages } from "./types";
import { handToHandIdx } from "../utils/handToHandIdx";
import { winName, payout } from "../payoutCalculations";
import { handIdxToHand } from "../utils/handIdxToHand";

const MAX_BET = 5;
const COINS_PER_BET_ORDER = [0.25, 0.5, 1, 2, 5];

interface AppState {
  variant: VARIANT;
  deck: Deck;
  coins: number;
  betSize: number;
  coinsPerBet: number;
  currentHand: Hand;
  currentHandIdx: number;
  holds: Array<boolean>;
  stage: Stages;
  win: {
    winId: number;
    winAmount: number;
    winName: string;
  };
}

const [initialHand, initialDeck]: [Hand, Deck] = deal();

export const initialState: AppState = {
  variant: VARIANT.DEUCES_WILD,
  deck: initialDeck,
  coins: 1000,
  betSize: 1,
  coinsPerBet: 1,
  currentHandIdx: handToHandIdx(initialHand),
  currentHand: initialHand,
  holds: [false, false, false, false, false],
  stage: Stages.PREGAME,
  win: { winId: 0, winAmount: 0, winName: "" },
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentHandIdx: (state, { payload: newHandIdx }) => {
      state.currentHandIdx = newHandIdx;
      state.currentHand = handIdxToHand(newHandIdx);
    },
    setCurrentHand: (state, { payload: hand }) => {
      const handIdx = indexOfCombination(hand);
      state.currentHand = hand;
      state.currentHandIdx = handIdx;
    },
    setCurrentDeck: (state, { payload: newDeck }) => {
      state.deck = newDeck;
    },
    setVariant: (state, { payload: newVariant }) => {
      state.variant = newVariant;
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
    setWin: (state, { payload: winId }: { payload: number }) => {
      // @ts-ignore
      const winAmount = payout(winId, state.variant);
      // @ts-ignore: winId is a number, not the required enum
      const name = winName(winId, state.variant);
      state.win = { winId, winAmount, winName: name };
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
  },
});

export const reducers = combineReducers({ game: gameSlice.reducer });
export const {
  incrementByAmount,
  decrementByAmount,
  setVariant,
  setCurrentHand,
  setCurrentHandIdx,
  setCurrentDeck,
  setStage,
  resetHolds,
  toggleHold,
  setWin,
  setMaxBet,
  incrementBet,
  incrementCoinsPerBet,
} = gameSlice.actions;
