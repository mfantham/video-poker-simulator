import { ithCombination } from "../strategy/combinations";
import { Hand } from "../types/hand";
import { cardIdxToCard } from "./cardIdxToCard";

export const handIdxToHand = (idx: number): Hand => {
  const handCardIdxes = ithCombination(idx, 52, 5);
  const hand = handCardIdxes.map((cardIdx) => cardIdxToCard(cardIdx));
  return hand as Hand;
};
