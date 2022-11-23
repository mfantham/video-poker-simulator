import { Hand } from "../types/hand";
import {
  isFour,
  isThree,
  isFullHouse,
  isTwoPair,
  isNaturalRoyalFlush,
  isStraightFlush,
  isFlush,
  isStraight,
  isJacksOrBetter,
  isPair,
} from "./winningHands";
import { Payout } from "./payout";

export const calculatePayout = (hand: Hand) => {
  if (isNaturalRoyalFlush(hand)) {
    return Payout.ROYAL_FLUSH;
  }
  if (isStraightFlush(hand)) {
    return Payout.STRAIGHT_FLUSH;
  }
  if (isFour(hand)) {
    return Payout.FOUR_OF_A_KIND;
  }
  if (isFullHouse(hand)) {
    return Payout.FULL_HOUSE;
  }
  if (isFlush(hand)) {
    return Payout.FLUSH;
  }
  if (isStraight(hand)) {
    return Payout.STRAIGHT;
  }
  if (isThree(hand)) {
    return Payout.THREE_OF_A_KIND;
  }
  if (isTwoPair(hand)) {
    return Payout.TWO_PAIR;
  }
  if (isJacksOrBetter(hand)) {
    return Payout.JACKS_OR_BETTER;
  }
  if (isPair(hand)) {
    return Payout.PAIR;
  }
  return Payout.DEFAULT;
};
