import { Hand } from "../types/hand";
import { Card } from "../types/card";

const encodeCard = (card: Card): number => {
  return 4 * card.suit + (card.value - 1);
};

export const encodeHand = (hand: Hand): number => {
  const cards = hand.map(encodeCard);
  const output =
    (cards[0] << 24) +
    (cards[1] << 18) +
    (cards[2] << 12) +
    (cards[3] << 6) +
    cards[4];
  return output;
};

const decodeHand = (encodedHand: number) => {
  const card0 = encodedHand & 1056964608;
  const card1 = encodedHand & 16515072;
  const card2 = encodedHand & 258048;
  const card3 = encodedHand & 4032;
  const card4 = encodedHand & 63;
  const handEncodedCards = [card0, card1, card2, card3, card4];
  return handEncodedCards.map((v) => ({
    suit: Math.floor(v / 13),
    value: (v + 1) % 4,
  }));
};
