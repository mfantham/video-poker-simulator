import { useAppSelector, useAppDispatch } from "./store";
import { useCallback } from "react";
import { VARIANT } from "../types/variant";
import { setCurrentHand, setCurrentHandIdx, setVariant } from "./reducers";
import { Hand } from "../types/hand";

export const useCurrentHandIdx = () =>
  useAppSelector((state) => state.game.currentHandIdx);
export const useVariant = () => useAppSelector((state) => state.game.variant);

export const useSetCurrentHand = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (hand: Hand) => {
      const handIndexes = hand.map((card) => card.idx);
      dispatch(setCurrentHand(handIndexes));
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
