import {Hand} from "./hand";

export const sortHand = (hand: Hand) => {
  const mutableHand = [...hand];
  const sortedHand = mutableHand.sort((a, b) => {
    return a.value - b.value;
  });
  return sortedHand;
};
