import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  return store;
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
