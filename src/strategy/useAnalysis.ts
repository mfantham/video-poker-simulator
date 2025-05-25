import { useEffect } from "react";
import {
  useCurrentAnalysis,
  useCurrentHandIdx,
  useDealtHand,
  useSetAnalysisState,
  useStage,
  useVariant,
} from "../redux/hooks";
import { Stages } from "../redux/types";
import { evaluateHand } from "./evaluateHand";

export const useContinuousAnalysis = () => {
  const stage = useStage();
  const variant = useVariant();
  const dealtHand = useDealtHand();
  const currentAnalysis = useCurrentAnalysis();

  const setAnalysis = useSetAnalysisState();

  const handIdx = dealtHand.handIdx;
  const handExplorerHandIdx = useCurrentHandIdx();

  useEffect(() => {
    if (stage === Stages.PREGAME) {
      return;
    }

    const handIdxToAnalyse =
      stage === Stages.EXPLORER ? handExplorerHandIdx : handIdx;

    if (
      currentAnalysis.handIdx === handIdxToAnalyse &&
      currentAnalysis.variant === variant
    ) {
      return;
    }

    setAnalysis([], 0, handIdxToAnalyse, variant);

    const tic = performance.now();
    evaluateHand(handIdxToAnalyse, variant).then((analysisTable) => {
      const toc = performance.now();
      const analysisTime = toc - tic;
      setAnalysis(analysisTable, analysisTime, handIdxToAnalyse, variant);
    });
  }, [
    stage,
    variant,
    handIdx,
    setAnalysis,
    currentAnalysis.handIdx,
    currentAnalysis.variant,
    handExplorerHandIdx,
    currentAnalysis,
  ]);
};
