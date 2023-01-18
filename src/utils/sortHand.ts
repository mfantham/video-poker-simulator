import { Hand } from "../types/hand";
import { SortIndex } from "../types/SortIndex";

export const sortHand = (
  hand: Hand
): { sortedHand: Hand; sortIndex: SortIndex } => {
  const handCardIdxes = hand.map((card) => card.idx);
  const sortedCardIdxes = [...handCardIdxes].sort((a, b) => b - a);
  const sortIndex = [-1, -1, -1, -1, -1] as SortIndex;
  sortedCardIdxes.forEach(
    (sortedIdx, idx) => (sortIndex[handCardIdxes.indexOf(sortedIdx)] = idx)
  );
  const sortedHand = sortIndex.map((idx) => hand[idx]) as Hand;
  return { sortedHand, sortIndex };
};
