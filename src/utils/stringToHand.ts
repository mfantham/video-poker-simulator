import { Hand } from "../types/hand";
import { stringToCard } from "./stringToCard";

export const stringToHand = (handString: string): Hand => {
  const handArray = [];
  for (let i = 0; i < handString.length; i += 2) {
    const cardString = handString.substring(i, i + 2);
    handArray.push(stringToCard(cardString));
  }
  return handArray as Hand;
};
