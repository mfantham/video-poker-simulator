import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { newDeck } from "../mechanics/deal";
import { GHand } from "../graphics/gHand";
import { Hand } from "../types/hand";
import { evaluateHand } from "../strategy/evaluateHand";
import { HoldsTable } from "../types/Hold";
import logo from "../logo.svg";
import { PrettyPrintAnalysis } from "../utils/PrettyPrintAnalysis";
import { choose, ithCombination } from "../strategy/combinations";
import { VariantSelector } from "./VariantSelector";
import { useEvaluateWin } from "../strategy/evaluateWin";
import {
  useCurrentHandIdx,
  useSetCurrentHandIdx,
  useVariant,
} from "../redux/hooks";
import { HandString } from "../graphics/HandString";
import { precomputePayout } from "../payoutCalculations/deuces-wild/precomputePayout";

export const HandExplorer = () => {
  const variant = useVariant();
  const handIdx = useCurrentHandIdx();
  const setHandIdx = useSetCurrentHandIdx();

  const sortedDeck = useMemo(newDeck, []);

  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState([] as HoldsTable);
  const [analysisTime, setAnalysisTime] = useState(0);

  const hand = useMemo(() => {
    const combinationNumbers = ithCombination(handIdx, 52, 5);
    const combinationHand = [
      sortedDeck[combinationNumbers[0]],
      sortedDeck[combinationNumbers[1]],
      sortedDeck[combinationNumbers[2]],
      sortedDeck[combinationNumbers[3]],
      sortedDeck[combinationNumbers[4]],
    ] as Hand;
    setAnalysis([]); // Analysis table not valid for this hand!
    setAnalysisTime(0);
    return combinationHand;
  }, [handIdx]);

  const winName = useEvaluateWin(hand);

  const numberOfHands = choose(52, 5);

  const runAnalysis = useCallback(async () => {
    setAnalysing(true);
    const tic = performance.now();
    const analysisTable = await evaluateHand(hand, handIdx, variant);

    const toc = performance.now();
    setAnalysing(false);
    setAnalysisTime(toc - tic);
    setAnalysis(analysisTable);
  }, [hand, handIdx, variant]);

  return (
    <>
      <div>
        <VariantSelector />
        Hand
        <input
          type="number"
          min={0}
          max={numberOfHands - 1}
          value={handIdx}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setHandIdx(Number(e.target.value))
          }
        />
        <HandString />
        <br />
        {winName}
      </div>
      <GHand hand={hand} editable={true} />
      <button onClick={runAnalysis}>Analyse hand</button>
      {analysisTime ? (
        <p>Analysis took {(analysisTime / 1000).toFixed(3)} s</p>
      ) : null}
      {analysing ? (
        <img src={logo} className="App-logo" alt="loading spinner" />
      ) : null}
      <PrettyPrintAnalysis analysisTable={analysis} />
    </>
  );
};
