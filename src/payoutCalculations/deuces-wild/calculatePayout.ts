import { Hand } from "../../types/hand";
import { Payout, WIN_ENCODING, WinNames } from "./payout";
import { OptimizedHandCalculator } from "./OptimizedHandCalculator";
import { precomputePayout } from "./precomputePayout";
import { allPossibleHands } from "../../strategy/allPossibleHands";
import { indexOfCombination } from "../../strategy/combinations";

let paytable: number[] | null = null;

export const fetchPaytable = async () => {
  const response = await fetch("/paytables/deucesWild.bin");
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
    return WIN_ENCODING.NATURAL_ROYAL_FLUSH;
  }
  if (calculator.isFourDeuces()) {
    return WIN_ENCODING.FOUR_DEUCES;
  }
  if (calculator.isRoyalFlush()) {
    return WIN_ENCODING.ROYAL_FLUSH;
  }
  if (calculator.isFive()) {
    return WIN_ENCODING.FIVE_OF_A_KIND;
  }
  if (calculator.isStraightFlush()) {
    return WIN_ENCODING.STRAIGHT_FLUSH;
  }
  if (calculator.isFour()) {
    return WIN_ENCODING.FOUR_OF_A_KIND;
  }
  if (calculator.isFullHouse()) {
    return WIN_ENCODING.FULL_HOUSE;
  }
  if (calculator.isFlush()) {
    return WIN_ENCODING.FLUSH;
  }
  if (calculator.isStraight()) {
    return WIN_ENCODING.STRAIGHT;
  }
  if (calculator.isThree()) {
    return WIN_ENCODING.THREE_OF_A_KIND;
  }
  return WIN_ENCODING.DEFAULT;
};

export const calculateNamedWins = (hand: Hand) => {
  const winEncoding = calculateWins(hand);
  return WinNames[winEncoding];
};

export const calculatePayout = async (hand: Hand) => {
  const winEncoding = await calculateWins(hand);
  return Payout[winEncoding];
};

// precomputePayout();
