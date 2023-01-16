import { PrettyPrintAnalysis } from "./PrettyPrintAnalysis";
import React, { useCallback, useEffect, useState } from "react";
import { evaluateHand } from "../../strategy/evaluateHand";
import { handIdxToHand } from "../../utils/handIdxToHand";
import { HoldsTable } from "../../types/Hold";
import { useCurrentHandIdx, useVariant } from "../../redux/hooks";

const AnalysisTime = ({ showTime = false, analysisTime = 0 }) => {
  if (!showTime) return null;
  if (analysisTime === 0) {
    return <p>Analysing ...</p>;
  }
  return <p>Analysis took {(analysisTime / 1000).toFixed(3)} s</p>;
};

export const AnalysisTable = ({ showTime = false }) => {
  const variant = useVariant();
  const handIdx = useCurrentHandIdx();

  const [analysis, setAnalysis] = useState([] as HoldsTable);
  const [analysisTime, setAnalysisTime] = useState(0);

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

  useEffect(() => {
    setAnalysis([]); // Analysis table not valid for this hand!
    setAnalysisTime(0);
    runAnalysis(handIdx);
  }, [handIdx, runAnalysis]);

  return (
    <>
      <PrettyPrintAnalysis analysisTable={analysis} />
      <AnalysisTime showTime={showTime} analysisTime={analysisTime} />
    </>
  );
};
