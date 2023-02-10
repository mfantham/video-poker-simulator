import { Hand } from "../types/hand";
import { SortIndex } from "../types/SortIndex";

export const sortHand = (
  hand: Hand
): { sortedHand: Hand; inverseSortIndex: SortIndex; sortIndex: SortIndex } => {
  const handCardIdxes = hand.map((card) => card.idx);
  const sortedCardIdxes = [...handCardIdxes].sort((a, b) => b - a);
  const sortIndex = [-1, -1, -1, -1, -1] as SortIndex;
  const inverseSortIndex = [-1, -1, -1, -1, -1] as SortIndex;
  sortedCardIdxes.forEach((sortedIdx, idx) => {
    const initialIndex = handCardIdxes.indexOf(sortedIdx);
    inverseSortIndex[idx] = initialIndex;
    sortIndex[handCardIdxes.indexOf(sortedIdx)] = idx;
  });
  const sortedHand = inverseSortIndex.map((idx) => hand[idx]) as Hand;
  return { sortedHand, inverseSortIndex, sortIndex };
};
