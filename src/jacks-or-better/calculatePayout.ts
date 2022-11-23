import { Hand } from "../types/hand";
import { Payout } from "./payout";
import { OptimizedHandCalculator } from "./OptimizedHandCalculator";

export const calculatePayout = (hand: Hand) => {
  const calculator = new OptimizedHandCalculator(hand);

  if (calculator.isNaturalRoyalFlush()) {
    return Payout.ROYAL_FLUSH;
  }
  if (calculator.isStraightFlush()) {
    return Payout.STRAIGHT_FLUSH;
  }
  if (calculator.isFour()) {
    return Payout.FOUR_OF_A_KIND;
  }
  if (calculator.isFullHouse()) {
    return Payout.FULL_HOUSE;
  }
  if (calculator.isFlush()) {
    return Payout.FLUSH;
  }
  if (calculator.isStraight()) {
    return Payout.STRAIGHT;
  }
  if (calculator.isThree()) {
    return Payout.THREE_OF_A_KIND;
  }
  if (calculator.isTwoPair()) {
    return Payout.TWO_PAIR;
  }
  if (calculator.isJacksOrBetter()) {
    return Payout.JACKS_OR_BETTER;
  }
  return Payout.DEFAULT;
};
