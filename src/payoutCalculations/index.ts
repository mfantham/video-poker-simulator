import { Hand } from "../types/hand";
import { VARIANT } from "../types/variant";

import { calculateWins as calculateWinsJacks } from "./jacks-or-better/calculatePayout";
import { calculateWins as calculateWinsDeuces } from "./deuces-wild/calculatePayout";

import {
  WinNames as WinNamesJacks,
  Payout as PayoutJacks,
} from "./jacks-or-better/payout";
import {
  WinNames as WinNamesDeuces,
  Payout as PayoutDeuces,
} from "./deuces-wild/payout";

export const calculateWins = (hand: Hand, variant: VARIANT) => {
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      return calculateWinsJacks(hand);
    case VARIANT.DEUCES_WILD:
      return calculateWinsDeuces(hand);
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
};

export const winName = (winId: number, variant: VARIANT) => {
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      // @ts-ignore
      return WinNamesJacks[winId];
    case VARIANT.DEUCES_WILD:
      // @ts-ignore
      return WinNamesDeuces[winId];
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
};

export const payout = (winId: number, variant: VARIANT) => {
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      // @ts-ignore
      return PayoutJacks[winId];
    case VARIANT.DEUCES_WILD:
      // @ts-ignore
      return PayoutDeuces[winId];
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
};
