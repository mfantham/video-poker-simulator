import { Hand } from "../../types/hand";
import { sortCardsByValue } from "../../strategy/sortCardsByValue";

export class OptimizedHandCalculator {
  hand: Hand;
  sortedHand: Hand;
  handRepeats: Array<number>;
  repeatCounter: Array<number>;

  constructor(newHand: Hand) {
    this.hand = newHand;
    this.sortedHand = sortCardsByValue(this.hand) as unknown as Hand;

    this.handRepeats = new Array(14).fill(0);
    this.hand.forEach(({ value }) => this.handRepeats[value]++);
    this.repeatCounter = this.handRepeats
      .slice()
      .filter((c) => c)
      .sort()
      .reverse();
  }

  isRoyalStraight = (): boolean => {
    return (
      this.sortedHand[0].value === 1 &&
      this.sortedHand[1].value === 10 &&
      this.sortedHand[2].value === 11 &&
      this.sortedHand[3].value === 12 &&
      this.sortedHand[4].value === 13
    );
  };

  isFlush = (): boolean => {
    const suit0 = this.hand[0].suit;
    return !this.hand.some(({ suit }) => suit !== suit0);
  };

  isStraight = (): boolean => {
    if (this.isRoyalStraight()) {
      return true;
    }
    for (let i = 1; i < this.sortedHand.length; i++) {
      if (this.sortedHand[i].value !== 1 + this.sortedHand[i - 1].value) {
        return false;
      }
    }
    return true;
  };

  isFour = (): boolean => {
    return this.repeatCounter[0] === 4;
  };

  isThree = (): boolean => {
    return this.repeatCounter[0] === 3 && this.repeatCounter[1] < 2;
  };

  isFullHouse = (): boolean => {
    return this.repeatCounter[0] === 3 && this.repeatCounter[1] === 2;
  };

  isTwoPair = (): boolean => {
    return this.repeatCounter[0] === 2 && this.repeatCounter[1] === 2;
  };

  isPair = (): boolean => {
    return this.repeatCounter[0] === 2 && this.repeatCounter[1] < 2;
  };

  isJacksOrBetter = (): boolean => {
    return (
      this.handRepeats[1] === 2 ||
      this.handRepeats[11] === 2 ||
      this.handRepeats[12] === 2 ||
      this.handRepeats[13] === 2
    );
  };

  isStraightFlush = (): boolean => {
    return this.isFlush() && this.isStraight();
  };

  isNaturalRoyalFlush = (): boolean => {
    return this.isRoyalStraight() && this.isFlush();
  };
}
