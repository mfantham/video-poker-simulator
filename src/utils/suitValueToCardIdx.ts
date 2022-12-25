import { Suit } from "../types/suit";

export const suitValueToCardIdx = (suit: Suit, value: number): number => {
  return 13 * suit + value - 1;
};
