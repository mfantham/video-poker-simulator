import { HoldsTable } from "../types/Hold";
import { runGpuAnalysis } from "../webgpu/runGpuAnalysis";
import { VARIANT } from "../types/variant";
import { intToHoldString } from "../utils/intToHoldString";
import { getAllPayouts } from "../payoutCalculations";

export const evaluateHand = async (
  handIndex: number,
  variant: VARIANT
): Promise<HoldsTable> => {
  return new Promise((resolve) => {
    resolve(evaluateHandSync(handIndex, variant));
  });
};

let MEMO_PAYOUT_TABLE: Partial<Record<VARIANT, number[] | null>> = {};

const memoPayoutTable = async (variant: VARIANT) => {
  if (MEMO_PAYOUT_TABLE[variant] === undefined) {
    MEMO_PAYOUT_TABLE[variant] = await getAllPayouts(variant);
  }
  return MEMO_PAYOUT_TABLE[variant] as number[];
};

export const evaluateBestHolds = async (
  handIndex: number,
  variant: VARIANT
) => {
  const allPayouts = await memoPayoutTable(variant);
  const gpuAnalysisResult = await runGpuAnalysis(handIndex, allPayouts);
  let bestExpectedPayout = 0;
  let bestHoldId = -1;
  gpuAnalysisResult.holdIds.forEach((holdId) => {
    const totalPayout = gpuAnalysisResult.totalPayout[holdId];
    const totalSwaps = gpuAnalysisResult.totalSwaps[holdId];
    const expectedPayout = totalPayout / totalSwaps;
    if (expectedPayout > bestExpectedPayout) {
      bestExpectedPayout = expectedPayout;
      bestHoldId = holdId;
    }
  });
  return { bestExpectedPayout, bestHold: intToHoldString(bestHoldId) };
};

export const evaluateHandSync = async (handIndex: number, variant: VARIANT) => {
  const allPayouts = await memoPayoutTable(variant);
  const gpuAnalysisResult = await runGpuAnalysis(handIndex, allPayouts);

  const holdStats = gpuAnalysisResult.holdIds.map((holdId) => {
    const totalPayout = gpuAnalysisResult.totalPayout[holdId];
    const totalSwaps = gpuAnalysisResult.totalSwaps[holdId];
    const totalWins = gpuAnalysisResult.totalWins[holdId];
    const maxPayout = gpuAnalysisResult.maxPayout[holdId];
    const holdName = intToHoldString(holdId);

    return {
      holdName,
      expectedPayout: totalPayout / totalSwaps,
      winProbability: (100 * totalWins) / totalSwaps,
      maxPossiblePayout: maxPayout,
    };
  });

  const holdsTable: HoldsTable = holdStats.map(({ holdName, ...rest }) => {
    return [holdName, rest];
  });
  return holdsTable.sort((a, b) => b[1].expectedPayout - a[1].expectedPayout);
};
