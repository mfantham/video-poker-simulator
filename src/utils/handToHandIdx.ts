import { indexOfCombination } from "../strategy/combinations";
import { Hand } from "../types/hand";

export const handToHandIdx = (hand: Hand): number => {
  const handCardIdxes = hand.map((card) => card.idx);
  const handIdx = indexOfCombination(handCardIdxes);
  return handIdx;
};
