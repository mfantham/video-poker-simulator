// TODO: implement jackpot pays (max bet)

import { Hand } from "../types/hand";
import { VARIANT } from "../types/variant";

import {
  calculateWins as calculateWinsJacks,
  getPaytable as getAllPayoutsJacks,
} from "./jacks-or-better/calculatePayout";
import {
  calculateWins as calculateWinsDeuces,
  getPaytable as getAllPayoutsDeuces,
} from "./deuces-wild/calculatePayout";

import {
  Payout as PayoutJacks,
  WinNames as WinNamesJacks,
} from "./jacks-or-better/payout";
import {
  Payout as PayoutDeuces,
  WinNames as WinNamesDeuces,
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

export const calculatePayout = (hand: Hand, variant: VARIANT) => {
  let winId = undefined;
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      winId = calculateWinsJacks(hand);
      break;
    case VARIANT.DEUCES_WILD:
      winId = calculateWinsDeuces(hand);
      break;
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
  return payout(winId, variant);
};

export const paytable = (variant: VARIANT) => {
  // @ts-ignore
  let winAmounts = undefined;
  let winNames = undefined;
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      winNames = WinNamesJacks;
      winAmounts = PayoutJacks;
      break;
    case VARIANT.DEUCES_WILD:
      winNames = WinNamesDeuces;
      winAmounts = PayoutDeuces;
      break;
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
  const nameWinTable = Object.entries(winNames).map(([winId, winName]) => {
    // @ts-ignore
    const winAmount = winAmounts[winId];
    // TODO: handle jackpot
    return [
      winName,
      winAmount,
      winAmount * 2,
      winAmount * 3,
      winAmount * 4,
      winAmount * 5,
    ] as [string, number, number, number, number, number];
  });
  const sortedTable = nameWinTable.sort((a, b) => b[5] - a[5]);
  return sortedTable;
};

export const getAllPayouts = async (variant: VARIANT) => {
  switch (variant) {
    case VARIANT.JACKS_OR_BETTER:
      return await getAllPayoutsJacks();
    case VARIANT.DEUCES_WILD:
      return await getAllPayoutsDeuces();
    default:
      throw new Error(`unknown game variant: ${variant}`);
  }
};
