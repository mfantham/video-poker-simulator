import { useAppSelector, useAppDispatch } from "./store";
import { useCallback } from "react";
import { VARIANT } from "../types/variant";
import {
  decrementByAmount,
  incrementBet,
  incrementByAmount,
  incrementCoinsPerBet,
  resetHolds,
  setCurrentDeck,
  setCurrentHand,
  setCurrentHandIdx,
  setMaxBet,
  setStage,
  setVariant,
  setWin,
  toggleHold,
  toggleShowAnalysis,
} from "./reducers";
import { Hand } from "../types/hand";
import { Stages } from "./types";
import { handIdxToHand } from "../utils/handIdxToHand";
import { Deck } from "../types/deck";

export const useStage = () => useAppSelector((state) => state.game.stage);
export const useSetStage = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    (newStage: Stages) => dispatch(setStage(newStage)),
    [dispatch]
  );
};

export const useCurrentHand = () =>
  useAppSelector((state) => state.game.currentHand);

export const useCurrentHandIdx = () =>
  useAppSelector((state) => state.game.currentHandIdx);
export const useVariant = () => useAppSelector((state) => state.game.variant);

export const useSetCurrentHand = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (hand: Hand) => {
      dispatch(setCurrentHand(hand));
    },
    [dispatch]
  );
};

export const useSetCurrentHandIdx = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (handIdx: number) => dispatch(setCurrentHandIdx(handIdx)),
    [dispatch]
  );
};

export const useSetVariant = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (variant: VARIANT) => dispatch(setVariant(variant)),
    [dispatch]
  );
};

export const useHolds = () => useAppSelector((state) => state.game.holds);
export const useResetHolds = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(resetHolds()), [dispatch]);
};
export const useToggleHold = () => {
  const dispatch = useAppDispatch();

  return useCallback((idx: number) => dispatch(toggleHold(idx)), [dispatch]);
};

export const useDeck = () => useAppSelector((state) => state.game.deck);
export const useSetDeck = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (deck: Deck) => dispatch(setCurrentDeck(deck)),
    [dispatch]
  );
};

export const useCoins = () => useAppSelector((state) => state.game.coins);
export const useIncrement = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (v: number) => dispatch(incrementByAmount(v ?? 1)),
    [dispatch]
  );
};
export const useDecrement = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (v: number) => dispatch(decrementByAmount(v ?? 1)),
    [dispatch]
  );
};

export const useSetWin = () => {
  const dispatch = useAppDispatch();

  return useCallback((winId: number) => dispatch(setWin(winId)), [dispatch]);
};

export const useWin = () => useAppSelector((state) => state.game.win);

export const useBetSize = () => useAppSelector((state) => state.game.betSize);
export const useCoinsPerBet = () =>
  useAppSelector((state) => state.game.coinsPerBet);

export const useSetMaxBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(setMaxBet()), [dispatch]);
};
export const useIncrementBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementBet()), [dispatch]);
};
export const useIncrementCoinsPerBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementCoinsPerBet()), [dispatch]);
};

export const useToggleShowAnalysis = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(toggleShowAnalysis()), [dispatch]);
};

export const useShowAnalysis = () =>
  useAppSelector((state) => state.game.showAnalysis);
