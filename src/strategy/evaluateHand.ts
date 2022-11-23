import { Hand } from "../types/hand";
import { allPossibleHolds } from "./allPossibleHolds";
import { newDeck } from "../mechanics/deal";
import { combinations } from "./allPossibleHands";
import { calculatePayout } from "../jacks-or-better/calculatePayout";
import { HoldsTable, HoldStats } from "../types/Hold";
import { encodeHand } from "../webgpu/encodeHand";

export const evaluateHand = async (hand: Hand): Promise<HoldsTable> => {
  return new Promise((resolve) => {
    resolve(evaluateHandSync(hand));
  });
};

export const evaluateHandSync = (hand: Hand) => {
  const possibleHolds = allPossibleHolds(hand);
  const remainingDeck = removeHandFromDeck(hand);
  const remainingDeckIdxs = Array.from(Array(remainingDeck.length).keys());
  const allDrawOptions: Array<Array<Array<number>>> = [];
  for (let i = 1; i <= hand.length; i++) {
    // big array of arrays, length [47C1, 47C2, 47C3, 47C4, 47C5]
    allDrawOptions[i] = combinations(remainingDeckIdxs, i);
  }
  const nOptions = allDrawOptions.flat().length;
  const encodedHands = new Uint32Array(nOptions); // Encode hands for graphics card calculation
  let i = 0;

  const holdStats = possibleHolds.map((holdOption) => {
    const nDiscards = holdOption.reduce((acc, cur) => acc + (cur ? 0 : 1), 0);
    if (nDiscards === 0) {
      const payout = calculatePayout(hand);
      return {
        expectedPayout: payout,
        winProbability: payout > 0 ? 100 : 0,
        maxPossiblePayout: payout,
      };
    }
    // Otherwise, evaluate every possible replacement hand! Wow.
    let totalPayout = 0;
    let totalWins = 0;
    let max = 0;
    allDrawOptions[nDiscards].forEach((replacementCards) => {
      let r = 0;
      const replacementHand = holdOption.map((hold, idx) => {
        if (hold) {
          return hand[idx];
        } else {
          const replacementCard = remainingDeck[replacementCards[r]];
          r++;
          return replacementCard;
        }
      }) as unknown as Hand;
      // const payout = 0;
      const payout = calculatePayout(replacementHand);
      encodedHands[i] = encodeHand(replacementHand);
      i++;
      totalPayout += payout;
      if (payout > max) max = payout;
      totalWins += payout > 0 ? 1 : 0;
    });
    // divide by all draw options length
    const nDrawPossibilities = allDrawOptions[nDiscards].length;
    return {
      expectedPayout: totalPayout / nDrawPossibilities,
      winProbability: (100 * totalWins) / nDrawPossibilities,
      maxPossiblePayout: max,
    };
  });
  // console.log(encodedHands);

  const holdsTable: HoldsTable = possibleHolds.map((hold, idx) => {
    const holdString = hold.map((v) => (v ? 1 : 0)).join("");
    return [holdString, holdStats[idx]];
  });
  return holdsTable.sort((a, b) => b[1].expectedPayout - a[1].expectedPayout);
};

const removeHandFromDeck = (hand: Hand) => {
  const fullDeck = newDeck();
  const handIdxs = hand.map(({ idx }) => idx);
  const remainingDeck = fullDeck.filter(({ idx }) => !handIdxs.includes(idx));

  return remainingDeck;
};
