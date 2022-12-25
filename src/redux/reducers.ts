import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { Deck } from "../types/deck";
import { Hand } from "../types/hand";
import { deal } from "../mechanics/deal";
import { VARIANT } from "../types/variant";
import { indexOfCombination } from "../strategy/combinations";

enum Stages {
  PREGAME,
  DEALING,
  DEALT,
  PAYING,
  PAID,
}

interface AppState {
  variant: VARIANT;
  deck: Deck;
  coins: number;
  currentHandIdx: number;
  held: Array<boolean>;
}

const initialDeck: Deck = deal();

export const initialState: AppState = {
  variant: VARIANT.DEUCES_WILD,
  deck: initialDeck,
  coins: 1000,
  currentHandIdx: 0,
  held: [false, false, false, false, false],
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentHandIdx: (state, { payload: newHandIdx }) => {
      state.currentHandIdx = newHandIdx;
    },
    setCurrentHand: (state, { payload: hand }) => {
      const handIdx = indexOfCombination(hand);
      state.currentHandIdx = handIdx;
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
  },
});

export const reducers = combineReducers({ game: gameSlice.reducer });
export const {
  incrementByAmount,
  decrementByAmount,
  setVariant,
  setCurrentHand,
  setCurrentHandIdx,
} = gameSlice.actions;
