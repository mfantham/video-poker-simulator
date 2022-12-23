import { newDeck } from "../../mechanics/deal";
import { allPossibleHands } from "../../strategy/allPossibleHands";
import { calculateWins } from "./calculatePayout";
import { Hand } from "../../types/hand";
import { download } from "../../utils/download";

export const precomputePayout = () => {
  const deck = newDeck();
  const payouts = allPossibleHands.map((handIndexed) => {
    const hand = handIndexed.map((cardIdx) => deck[cardIdx]) as unknown as Hand;
    return calculateWins(hand);
  });
  const uint8Payouts = new Uint8Array(payouts);
  console.log(uint8Payouts);
  download(uint8Payouts.buffer, "jacksOrBetter.bin");
};
