import { Hand } from "../../types/hand";
import { sortCardsByValue } from "../../strategy/sortCardsByValue";

const handValueRepeats = (hand: Hand): Array<number> => {
  let repeatCounter = new Array(14).fill(0);
  hand.forEach(({ value }) => repeatCounter[value]++);
  return repeatCounter
    .filter((c) => c)
    .sort()
    .reverse();
};

export const isFour = (hand: Hand): boolean => {
  const repeatsCount = handValueRepeats(hand);
  return repeatsCount[0] === 4;
};

export const isThree = (hand: Hand): boolean => {
  const repeatsCount = handValueRepeats(hand);
  return repeatsCount[0] === 3 && repeatsCount[1] < 2;
};

export const isFullHouse = (hand: Hand): boolean => {
  const repeatsCount = handValueRepeats(hand);
  return repeatsCount[0] === 3 && repeatsCount[1] === 2;
};

export const isTwoPair = (hand: Hand): boolean => {
  const repeatsCount = handValueRepeats(hand);
  return repeatsCount[0] === 2 && repeatsCount[1] === 2;
};

export const isPair = (hand: Hand): boolean => {
  const repeatsCount = handValueRepeats(hand);
  return repeatsCount[0] === 2 && repeatsCount[1] < 2;
};

export const isJacksOrBetter = (hand: Hand): boolean => {
  if (!isPair(hand)) {
    return false;
  }
  let repeatCounter = new Array(14).fill(0);
  hand.forEach(({ value }) => repeatCounter[value]++);
  return (
    repeatCounter[1] === 2 ||
    repeatCounter[11] === 2 ||
    repeatCounter[12] === 2 ||
    repeatCounter[13] === 2
  );
};

export const isNaturalRoyalFlush = (hand: Hand): boolean => {
  return isRoyalStraight(hand) && isFlush(hand);
};

export const isStraightFlush = (hand: Hand): boolean => {
  return isFlush(hand) && isStraight(hand);
};

export const isFlush = (hand: Hand): boolean => {
  const suit0 = hand[0].suit;
  return !hand.some(({ suit }) => suit !== suit0);
};

export const isRoyalStraight = (hand: Hand): boolean => {
  const sorted = sortCardsByValue(hand);
  return (
    sorted[0].value === 1 &&
    sorted[1].value === 10 &&
    sorted[2].value === 11 &&
    sorted[3].value === 12 &&
    sorted[4].value === 13
  );
};

export const isStraight = (hand: Hand): boolean => {
  if (isRoyalStraight(hand)) {
    return true;
  }
  const sorted = sortCardsByValue(hand);
  for (let i = 1; i < hand.length; i++) {
    if (sorted[i].value !== 1 + sorted[i - 1].value) {
      return false;
    }
  }
  return true;
};
