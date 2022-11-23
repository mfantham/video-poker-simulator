import { Hand } from "../types/hand";
import {
  isFlush,
  isFour,
  isFullHouse,
  isNaturalRoyalFlush,
  isStraightFlush,
  isThree,
} from "./winningHands";
import { Payout } from "./payout";

export const calculatePayout = (hand: Hand) => {
  if (!hand) {
    return Payout.DEFAULT;
  }

  if (isNaturalRoyalFlush(hand)) {
    return Payout.NATURAL_ROYAL_FLUSH;
  }
  // four deuces
  // wild royal flush
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
  if (isStraightFlush(hand)) {
    return Payout.STRAIGHT;
  }
  if (isThree(hand)) {
    return Payout.THREE_OF_A_KIND;
  }
  return Payout.DEFAULT;
};
