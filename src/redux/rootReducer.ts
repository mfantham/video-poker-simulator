import { combineReducers } from "redux";
import gameReducer from "./gameSlice";
import settingsReducer from "./settingsSlice";
import statsReducer from "./statsSlice";

export const rootReducer = combineReducers({
  game: gameReducer,
  settings: settingsReducer,
  stats: statsReducer,
});
