import { useAppSelector, useAppDispatch } from "./store";
import { useCallback } from "react";
import { VARIANT } from "../types/variant";
import { setVariant } from "./reducers";

export const useSetVariant = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (variant: VARIANT) => dispatch(setVariant(variant)),
    [dispatch]
  );
};

export const useVariant = () => useAppSelector((state) => state.game.variant);
