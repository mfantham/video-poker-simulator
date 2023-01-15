import { Hand } from "../types/hand";
import { Suit } from "../types/suit";
import { Card } from "../types/card";
import { Deck } from "../types/deck";

const shuffle = (deck: Deck): Deck => {
  const shuffled = deck.slice();
  let i = deck.length;
  while (i--) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled;
};

export const newDeck = (): Deck => {
  type suitStrings = keyof typeof Suit;
  const deck = (Object.keys(Suit) as Array<keyof typeof Suit>)
    .filter((x) => isNaN(parseInt(x)))
    .map((suit: suitStrings) => {
      const values = new Array(13).fill(0);
      return values.map((_, idx) => {
        return { value: idx + 1, suit: Suit?.[suit] } as Card;
      });
    })
    .flat();
  const indexedDeck = deck.map((card, idx) => ({ ...card, idx }));
  return indexedDeck;
};

export const deal = (): [Hand, Deck] => {
  const deck = newDeck();
  const shuffled = shuffle(deck);
  const hand = shuffled.slice(0, 5) as Hand;
  return [hand, shuffled];
};
