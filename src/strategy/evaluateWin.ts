import { Hand } from "../types/hand";
import { useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";

import { calculateNamedWins as calculateDeucesWildWins } from "../payoutCalculations/deuces-wild/calculatePayout";
import { calculateNamedWins as calculateJacksOrBetterWins } from "../payoutCalculations/jacks-or-better/calculatePayout";
// dumb luck next.

export const useEvaluateWin = (hand: Hand) => {
  const variant = useVariant();

  switch (variant) {
    case VARIANT.DEUCES_WILD:
      return calculateDeucesWildWins(hand);
    case VARIANT.JACKS_OR_BETTER:
      return calculateJacksOrBetterWins(hand);
    default:
      throw new Error("Unknown variant");
  }
};
