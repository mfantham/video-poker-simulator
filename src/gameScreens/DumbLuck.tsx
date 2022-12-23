import React, { useCallback, useState } from "react";
import { GHand } from "../graphics/gHand";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { calculatePayout } from "../payoutCalculations/dumb-luck/calculatePayout";
import { deal } from "../mechanics/deal";
import { decrementByAmount, incrementByAmount } from "../redux/reducers";
import { costOfGame } from "../payoutCalculations/dumb-luck/payout";
import { HandExplorer } from "./HandExplorer";

export const DumbLuck = () => {
  const dispatch = useAppDispatch();
  // const hand = useAppSelector((s) => s.game.currentHand);
  const coins = useAppSelector((s) => s.game.coins);
  const [payout, setPayout] = useState(NaN);
  const [hand, setHand] = useState(deal());

  const handleDeal = useCallback(() => {
    const newHand = deal();
    dispatch(decrementByAmount(costOfGame));
    const newPayout = calculatePayout(newHand);
    setHand(newHand);
    setPayout(newPayout);
    dispatch(incrementByAmount(newPayout));
  }, []);

  return (
    <>
      {hand?.length && <GHand hand={hand} />}
      <p>Payout: {isNaN(payout) ? "" : payout}</p>
      <p>Total coins: {coins.toFixed(0)}</p>
      <button onClick={handleDeal}>deal</button>
    </>
  );
};
