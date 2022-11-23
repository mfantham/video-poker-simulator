import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { Deck } from "../types/deck";
import { Hand } from "../types/hand";
import { deal } from "../mechanics/deal";

enum Stages {
  PREGAME,
  DEALING,
  DEALT,
  PAYING,
  PAID,
}

interface AppState {
  deck: Deck;
  coins: number;
  currentHand: Hand;
  held: Array<boolean>;
}

const initialDeck: Deck = deal();
const initialHand: Hand = [
  initialDeck[0],
  initialDeck[1],
  initialDeck[2],
  initialDeck[3],
  initialDeck[4],
];

export const initialState: AppState = {
  deck: initialDeck,
  coins: 1000,
  currentHand: initialHand,
  held: [false, false, false, false, false],
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
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
export const { incrementByAmount, decrementByAmount } = gameSlice.actions;
