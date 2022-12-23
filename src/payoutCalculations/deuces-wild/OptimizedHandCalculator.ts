import { Hand } from "../../types/hand";
import { sortCards } from "../../types/sortHand";
import { Card } from "../../types/card";

/* 
Note evaluation order is important
 */
export class OptimizedHandCalculator {
  hand: Hand;
  deucelessHand: Array<Card>; // Could be any length 1-5
  handRepeats: Array<number>;
  repeatCounter: Array<number>;
  nDeuces: number;

  constructor(newHand: Hand) {
    this.hand = newHand;

    this.handRepeats = new Array(14).fill(0);
    this.deucelessHand = this.hand.filter(({ value }) => value !== 2);
    this.deucelessHand.forEach(({ value }) => this.handRepeats[value]++);
    this.repeatCounter = this.handRepeats
      .slice()
      .filter((c) => c)
      .sort()
      .reverse();
    this.nDeuces = this.hand.length - this.deucelessHand.length;
  }

  isNaturalRoyalFlush = (): boolean => {
    return this.deucelessHand.length === 5 && this.isRoyalFlush();
  };

  isFourDeuces = (): boolean => {
    return this.nDeuces === 4;
  };

  isRoyalStraight = (): boolean => {
    const royalValues = [1, 10, 11, 12, 13];
    const isRoyalStraight = this.deucelessHand.every(({ value }) =>
      royalValues.includes(value)
    );
    return isRoyalStraight;
  };

  isFlush = (): boolean => {
    const isFlush = this.deucelessHand.every(
      ({ suit }) => suit === this.deucelessHand[0].suit
    );
    return isFlush;
  };

  isRoyalFlush = (): boolean => {
    return this.isFlush() && this.isRoyalStraight();
  };

  isFive = (): boolean => {
    return this.repeatCounter[0] + this.nDeuces === 5;
  };

  isStraight = (): boolean => {
    if (this.isRoyalStraight()) {
      return true;
    }
    const sortedDeucelessHand = sortCards(this.deucelessHand);
    let deucesRemaining = this.nDeuces;
    let counter = sortedDeucelessHand[0].value;
    let i = 1;
    for (let j = 0; j < 4; j++) {
      const isNextValue = sortedDeucelessHand?.[i]?.value === 1 + counter;
      if (!isNextValue) {
        if (deucesRemaining === 0) {
          return false;
        } else {
          deucesRemaining--;
          counter++;
        }
      } else {
        i++;
        counter++;
      }
    }
    return true;
  };

  isFour = (): boolean => {
    return this.repeatCounter[0] + this.nDeuces === 4;
  };

  isThree = (): boolean => {
    return this.repeatCounter[0] + this.nDeuces === 3;
  };

  isFullHouse = (): boolean => {
    return (
      (this.repeatCounter[0] === 3 && this.repeatCounter[1] === 2) ||
      (this.repeatCounter[0] === 2 &&
        this.repeatCounter[1] === 2 &&
        this.nDeuces === 1)
    );
  };

  isStraightFlush = (): boolean => {
    return this.isFlush() && this.isStraight();
  };
}
