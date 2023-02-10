import { Hand } from "./hand";

export type GameResult = {
  payout: number;
  expectedPayout: number;
  dealtHand: Hand;
  newHand: Hand;
};
