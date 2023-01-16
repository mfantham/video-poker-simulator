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

interface AppState {
  variant: VARIANT;
  deck: Deck;
  coins: number;
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
} = gameSlice.actions;
