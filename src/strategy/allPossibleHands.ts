import { newDeck } from "../mechanics/deal";
import { choose, ithCombination } from "./combinations";

export const combinations = (
  array: Array<number>,
  nCombinations: number
): Array<Array<number>> => {
  // Recursive code adapted from https://rosettacode.org/wiki/Combinations
  let output = [];
  for (let i = 0; i < array.length; i++) {
    if (nCombinations === 1) {
      output.push([array[i]]);
    } else {
      const sub = combinations(
        array.slice(i + 1, array.length),
        nCombinations - 1
      );
      for (let subI = 0; subI < sub.length; subI++) {
        const next = sub[subI];
        next.unshift(array[i]);
        output.push(next);
      }
    }
  }
  return output;
};

const computeAllPossibleHands = () => {
  // Returns an array of length 52C5 = 2,598,960
  const deck = newDeck();
  const nOptions = choose(deck.length, 5);
  const allHands = new Array(nOptions).fill(0).map((_, idx) => {
    return ithCombination(idx, deck.length, 5);
  });
  return allHands;
};

export const allPossibleHands = computeAllPossibleHands();
