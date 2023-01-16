import { Hand } from "../types/hand";
import { intToHoldString } from "../utils/intToHoldString";

export const allPossibleHolds = (hand: Hand): Array<Array<boolean>> => {
  // Count 0 - 31 in binary for all hold/swap combinations
  const handLength = hand.length;
  const countTo31Array = Array.from(Array(2 ** handLength).keys());
  const binaryOptions = countTo31Array.map((v) => {
    const binaryNumber = intToHoldString(v);
    const binaryOutput = Array(handLength).fill(false);
    for (let i = 0; i < handLength; i++) {
      if (binaryNumber?.[i] === "1") {
        binaryOutput[i] = true;
      }
    }
    return binaryOutput;
  });
  return binaryOptions;
};
