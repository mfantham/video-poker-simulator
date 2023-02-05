import { Hand } from "../../types/hand";
import { Payout, WIN_ENCODED, WinNames } from "./payout";
import { OptimizedHandCalculator } from "./OptimizedHandCalculator";
import { precomputePayout } from "./precomputePayout";
import { allPossibleHands } from "../../strategy/allPossibleHands";
import { indexOfCombination } from "../../strategy/combinations";

let paytable: number[] | null = null;

export const fetchPaytable = async () => {
  const response = await fetch("/paytables/jacksOrBetter.bin");
  const arrayResponse = new Uint8Array(await response.arrayBuffer());
  const decodedPaytable: number[] = Array.from(arrayResponse).map((v) => {
    // @ts-ignore
    return Payout[v];
  });
  paytable = decodedPaytable;
  return paytable;
};

export const getPaytable = async () => {
  if (paytable !== null) {
    return paytable;
  } else {
    return await fetchPaytable();
  }
};

export const calculatePayoutByIndex = (handIndex: number) => {
  if (paytable !== null) {
    return paytable[handIndex];
  } else {
    const hand = allPossibleHands[handIndex] as unknown as Hand;
    return calculatePayout(hand);
  }
};

export const calculatePayoutByHand = (hand: Hand) => {
  const handArray = hand.map((card) => card.idx);
  const handIndex = indexOfCombination(handArray);
  const payout = calculatePayoutByIndex(handIndex);
  return payout;
};

export const calculateWins = (hand: Hand) => {
  const calculator = new OptimizedHandCalculator(hand);

  if (calculator.isNaturalRoyalFlush()) {
    return WIN_ENCODED.ROYAL_FLUSH;
  }
  if (calculator.isStraightFlush()) {
    return WIN_ENCODED.STRAIGHT_FLUSH;
  }
  if (calculator.isFour()) {
    return WIN_ENCODED.FOUR_OF_A_KIND;
  }
  if (calculator.isFullHouse()) {
    return WIN_ENCODED.FULL_HOUSE;
  }
  if (calculator.isFlush()) {
    return WIN_ENCODED.FLUSH;
  }
  if (calculator.isStraight()) {
    return WIN_ENCODED.STRAIGHT;
  }
  if (calculator.isThree()) {
    return WIN_ENCODED.THREE_OF_A_KIND;
  }
  if (calculator.isTwoPair()) {
    return WIN_ENCODED.TWO_PAIR;
  }
  if (calculator.isJacksOrBetter()) {
    return WIN_ENCODED.JACKS_OR_BETTER;
  }
  return WIN_ENCODED.DEFAULT;
};

export const calculateNamedWins = (hand: Hand) => {
  const winEncoding = calculateWins(hand);
  return WinNames[winEncoding];
};

export const calculatePayout = async (hand: Hand) => {
  const winName = await calculateWins(hand);
  return Payout[winName];
};

// precomputePayout();
