import { SortIndex } from "../types/SortIndex";
import { Hand } from "../types/hand";

export enum Stages {
  PREGAME = 0,
  DEALING,
  DEALT,
  DRAWING,
  PAYING,
  PAID,
  MENUS,
  EXPLORER,
}

export type HandInfo = {
  hand: Hand;
  handIdx: number;
  sortedHand: Hand;
  handSortOrder: SortIndex;
};
