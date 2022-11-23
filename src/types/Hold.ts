export type HoldStats = {
  expectedPayout: number;
  winProbability: number;
  maxPossiblePayout: number;
};
export type HoldResult = [string, HoldStats];
export type HoldsTable = Array<HoldResult>;
