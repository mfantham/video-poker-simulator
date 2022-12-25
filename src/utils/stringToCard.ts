import { Card } from "../types/card";
import { faceCardToValue } from "./faceCardToValue";
import { letterToSuit } from "../types/suit";
import { suitValueToCardIdx } from "./suitValueToCardIdx";

export const stringToCard = (cardString: string): Card => {
  const [valueString, suitString] = cardString.split("");
  const value = faceCardToValue(valueString);
  const suit = letterToSuit(suitString);
  const idx = suitValueToCardIdx(suit, value);
  return { value, suit, idx };
};
