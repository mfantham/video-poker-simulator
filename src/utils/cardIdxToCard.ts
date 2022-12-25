import { Card } from "../types/card";

export const cardIdxToCard = (idx: number): Card => {
  const suit = Math.floor(idx / 13);
  const value = (idx % 13) + 1;
  return { suit, value, idx } as Card;
};
