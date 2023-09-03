import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { Deck } from "../types/deck";
import { Hand } from "../types/hand";
import { deal } from "../mechanics/deal";
import { N_HANDS, VARIANT } from "../types/variant";
import { HandInfo, Stages } from "./types";
import { handToHandIdx } from "../utils/handToHandIdx";
import { winName, payout } from "../payoutCalculations";
import { handIdxToHand } from "../utils/handIdxToHand";
import { sortHand } from "../utils/sortHand";
import { SortIndex } from "../types/SortIndex";

const MAX_BET = 5;
const COINS_PER_BET_ORDER = [0.25, 0.5, 1, 2, 5];

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
  win: {
    winId: number;
    winAmount: number;
    winName: string;
  };
  showAnalysis: boolean;
  speed: number;
  volume: number;
}

const [initialHand, initialDeck]: [Hand, Deck] = deal();
const { sortedHand: initialHandSorted, sortIndex: initialHandSortOrder } =
  sortHand(initialHand);

export const initialState: AppState = {
  variant: VARIANT.DEUCES_WILD,
  nHands: N_HANDS.ONE,
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
  win: { winId: 0, winAmount: 0, winName: "" },
  showAnalysis: false,
  speed: 2,
  volume: 1,
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
    toggleShowAnalysis: (state) => {
      state.showAnalysis = !state.showAnalysis;
    },
    incrementSpeed: (state) => {
      state.speed = (state.speed + 1) % 4;
    },
    incrementVolume: (state) => {
      state.volume = (state.volume + 1) % 3;
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
  setDealtHand,
  setCurrentDeck,
  setStage,
  resetHolds,
  toggleHold,
  setWin,
  setMaxBet,
  incrementBet,
  incrementCoinsPerBet,
  toggleShowAnalysis,
  incrementSpeed,
  incrementVolume,
} = gameSlice.actions;
