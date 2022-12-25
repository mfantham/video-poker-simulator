import { Card } from "../types/card";
import { Hand } from "../types/hand";
import { valueToFaceCard } from "./valueToFaceCard";
import { Suit } from "../types/suit";

export const handToString = (hand: Hand): string => {
  const str = hand.reduce((prev: String, card: Card) => {
    return (
      prev + `${valueToFaceCard(card.value, true)}${suitToLetter(card.suit)}`
    );
  }, "");
  return str.substring(0, str.length);
};

const suitToLetter = (suit: Suit): string => {
  switch (suit) {
    case Suit.CLUB:
      return "C";
    case Suit.DIAMOND:
      return "D";
    case Suit.HEART:
      return "H";
    case Suit.SPADE:
      return "S";
  }
};
