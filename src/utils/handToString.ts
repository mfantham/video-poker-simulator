import {Card} from "../types/card";
import {Hand} from "../types/hand";
import {valueToFaceCard} from "./valueToFaceCard";

export const handToString = (hand: Hand) : string => {
  const str = hand.reduce((prev: String, card: Card) => {
    return prev + `${valueToFaceCard(card.value)} ${card.suit}, `
  }, '');
  return str.substring(0, str.length - 2);
}