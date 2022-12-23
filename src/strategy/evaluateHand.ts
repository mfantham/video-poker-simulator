import { Hand } from "../types/hand";
import { getPaytable as getPaytableJacks } from "../payoutCalculations/jacks-or-better/calculatePayout";
import { getPaytable as getPaytableDeuces } from "../payoutCalculations/deuces-wild/calculatePayout";
import { HoldsTable } from "../types/Hold";
import { runGpuAnalysis } from "../webgpu/runGpuAnalysis";
import { VARIANT } from "../types/variant";

export const evaluateHand = async (
  hand: Hand,
  handIndex: number,
  variant: VARIANT
): Promise<HoldsTable> => {
  return new Promise((resolve) => {
    resolve(evaluateHandSync(handIndex, variant));
  });
};

export const evaluateHandSync = async (handIndex: number, variant: VARIANT) => {
  let paytable = null;

  switch (variant) {
    case VARIANT.DEUCES_WILD:
      paytable = await getPaytableDeuces();
      break;
    case VARIANT.JACKS_OR_BETTER:
      paytable = await getPaytableJacks();
      break;
    default:
      throw new Error("Could not find the requested variant.");
  }

  const gpuAnalysisResult = await runGpuAnalysis(handIndex, paytable);

  const holdStats = gpuAnalysisResult.holdIds.map((holdId) => {
    const totalPayout = gpuAnalysisResult.totalPayout[holdId];
    const totalSwaps = gpuAnalysisResult.totalSwaps[holdId];
    const totalWins = gpuAnalysisResult.totalWins[holdId];
    const maxPayout = gpuAnalysisResult.maxPayout[holdId];
    const holdName = holdId.toString(2).padStart(5, "0");

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
