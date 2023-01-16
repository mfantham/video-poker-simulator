import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GHand } from "../../graphics/gHand";
import { evaluateHand } from "../../strategy/evaluateHand";
import { HoldsTable } from "../../types/Hold";
import { PrettyPrintAnalysis } from "../../utils/PrettyPrintAnalysis";
import { choose } from "../../strategy/combinations";
import { VariantSelector } from "../VariantSelector";
import { useEvaluateWin } from "../../strategy/evaluateWin";
import {
  useCurrentHandIdx,
  useSetCurrentHandIdx,
  useSetStage,
  useVariant,
} from "../../redux/hooks";
import { handIdxToHand } from "../../utils/handIdxToHand";
import { Stages } from "../../redux/types";
import {
  AnalysisHeaderHolder,
  AnalysisPageHolder,
  WinNameHolder,
} from "./AnalysisPageHolder";

const numberOfHands = choose(52, 5);

export const HandExplorer = () => {
  const variant = useVariant();
  const handIdx = useCurrentHandIdx();
  const setHandIdx = useSetCurrentHandIdx();
  const setStage = useSetStage();

  const [analysis, setAnalysis] = useState([] as HoldsTable);
  const [analysisTime, setAnalysisTime] = useState(0);

  useEffect(() => {
    setStage(Stages.EXPLORER);
  }, [setStage]);

  const runAnalysis = useCallback(
    async (handIndex: number) => {
      const tic = performance.now();
      const analysisTable = await evaluateHand(handIndex, variant);

      const toc = performance.now();
      setAnalysisTime(toc - tic);
      setAnalysis(analysisTable);
    },
    [variant]
  );

  const hand = useMemo(() => {
    const combinationHand = handIdxToHand(handIdx);
    setAnalysis([]); // Analysis table not valid for this hand!
    setAnalysisTime(0);
    runAnalysis(handIdx);
    return combinationHand;
  }, [handIdx, runAnalysis]);

  const winName = useEvaluateWin(hand);

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
        <WinNameHolder>{winName}</WinNameHolder>
      </AnalysisHeaderHolder>
      <GHand hand={hand} editable={true} />
      <PrettyPrintAnalysis analysisTable={analysis} />
      {analysisTime ? (
        <p>Analysis took {(analysisTime / 1000).toFixed(3)} s</p>
      ) : (
        <p>Analysing...</p>
      )}
    </AnalysisPageHolder>
  );
};
