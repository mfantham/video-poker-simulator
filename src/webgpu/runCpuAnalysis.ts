import { ithCombination } from "../strategy/combinations";

const N_HANDS = 2598960; // 52C5: number of possible poker hands
const N_HOLDS = 32; // 2^5: number of possible hold combinations

export const runCpuAnalysis =  async (
    handIndex: number,
    paytableArray: number[]
  ) => {
    const output = new Uint32Array(N_HOLDS).fill(0);
    const holds = new Uint32Array(N_HOLDS).fill(0);
    const nWins = new Uint32Array(N_HOLDS).fill(0);
    const maxPayout = new Uint32Array(N_HOLDS).fill(0);
    const deckSize = 52;
    const handSize = 5;

    // Loop through all possible hands that can be formed (evaluation hands)
    for (let evaluationHandIdx = 0; evaluationHandIdx < N_HANDS; evaluationHandIdx++) {
      // 1. What hand is being evaluated? (This is evaluationHandIdx)
      // 2. What's the payout for this evaluation hand?
      // The paytableArray is an array of payouts for each hand index.
      // In the GPU version, this was `lookupPayTable[evaluationHandIdx]`.
      // We assume paytableArray is equivalent to lookupPayTable.
      const payout = paytableArray[evaluationHandIdx];

      // 3. Determine the holdMask based on the inputHand and the current evaluationHand.
      // Get the cards in the input hand (the hand dealt to the player)
      const inputHandCards = ithCombination(handIndex, deckSize, handSize);
      // Get the cards in the current evaluation hand (one of the N_HANDS possible outcomes)
      const evaluationHandCards = ithCombination(evaluationHandIdx, deckSize, handSize);

      let holdMask = 0;
      for (let i = 0; i < handSize; i++) {
        for (let j = 0; j < handSize; j++) {
          if (inputHandCards[i] === evaluationHandCards[j]) {
            // Card from input hand is present in evaluation hand, so it was held.
            // The bit mask logic from WGSL: (1u << (handSize - 1u - i))
            holdMask = holdMask | (1 << (handSize - 1 - i));
          }
        }
      }

      // 4. Update statistics based on this evaluation hand and hold mask.
      output[holdMask] += payout;
      holds[holdMask] += 1;
      if (payout > 0) {
        nWins[holdMask] += 1;
      }
      if (payout > maxPayout[holdMask]) {
        maxPayout[holdMask] = payout;
      }
    }

    return {
        holdIds: new Array(N_HOLDS).fill(0).map((_, i) => i),
        totalSwaps: holds, // Renamed from 'output' in WGSL, 'holds' in JS context
        totalPayout: output, // Renamed from 'result' in WGSL, 'output' in JS context
        totalWins: nWins,
        maxPayout: maxPayout,
      };
  }