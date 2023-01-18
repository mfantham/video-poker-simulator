import React, { ChangeEvent, useEffect } from "react";
import { GHand } from "../../graphics/gHand";
import { choose } from "../../strategy/combinations";
import { VariantSelector } from "../VariantSelector";
import {
  useCurrentHand,
  useCurrentHandIdx,
  useSetCurrentHandIdx,
  useSetStage,
  useVariant,
} from "../../redux/hooks";
import { Stages } from "../../redux/types";
import {
  AnalysisHeaderHolder,
  AnalysisPageHolder,
  WinNameHolder,
} from "./AnalysisPageHolder";
import { AnalysisTable } from "./AnalysisTable";
import { calculateWins, payout, winName } from "../../payoutCalculations";

const numberOfHands = choose(52, 5);

export const HandExplorer = () => {
  const variant = useVariant();
  const handIdx = useCurrentHandIdx();
  const hand = useCurrentHand();
  const setHandIdx = useSetCurrentHandIdx();
  const setStage = useSetStage();

  useEffect(() => {
    setStage(Stages.EXPLORER);
  }, [setStage]);

  const winId = calculateWins(hand, variant);
  const winNameLocal = winName(winId, variant);
  const winAmount = payout(winId, variant);
  const winAmountText = winAmount > 0 ? `Wins ${winAmount} ⨉ bet` : "";

  return (
    <AnalysisPageHolder>
      <AnalysisHeaderHolder>
        <VariantSelector />
        <div>
          Hand{" "}
          <input
            type="number"
            min={0}
            max={numberOfHands - 1}
            value={handIdx}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setHandIdx(Number(e.target.value))
            }
            style={{ fontSize: 24 }}
          />
        </div>
        {/*<HandString />*/}
        <WinNameHolder>
          {winNameLocal}
          <br />
          {winAmountText}
        </WinNameHolder>
      </AnalysisHeaderHolder>
      <GHand hand={hand} editable={true} />
      <AnalysisTable showTime={true} handIdx={handIdx} />
    </AnalysisPageHolder>
  );
};
