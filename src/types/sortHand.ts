import { Hand } from "./hand";
import { Card } from "./card";

export const sortHand = (hand: Hand) => {
  const mutableHand = [...hand];
  const sortedHand = mutableHand.sort((a, b) => {
    return a.value - b.value;
  });
  return sortedHand;
};

export const sortCards = (hand: Card[]) => {
  const mutableHand = [...hand];
  const sortedHand = mutableHand.sort((a, b) => {
    return a.value - b.value;
  });
  return sortedHand;
};
