import { Card } from "../types/card";

export const sortCardsByValue = (hand: Card[]) => {
  const mutableHand = [...hand];
  const sortedHand = mutableHand.sort((a, b) => {
    return a.value - b.value;
  });
  return sortedHand;
};
