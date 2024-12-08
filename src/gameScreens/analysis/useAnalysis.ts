import { useEffect } from "react";
import {
  useCurrentAnalysis,
  useDealtHand,
  useSetAnalysisState,
  useStage,
  useVariant,
} from "../../redux/hooks";
import { Stages } from "../../redux/types";
import { evaluateHand } from "../../strategy/evaluateHand";
import { VARIANT } from "../../types/variant";

export const useContinuousAnalysis = () => {
  const stage = useStage();
  const variant = useVariant();
  const dealtHand = useDealtHand();
  const currentAnalysis = useCurrentAnalysis();

  const setAnalysis = useSetAnalysisState();

  const handIdx = dealtHand.handIdx;

  useEffect(() => {
    if (stage === Stages.PREGAME) {
      return;
    }

    if (
      currentAnalysis.handIdx === handIdx &&
      currentAnalysis.variant === variant
    ) {
      return;
    }

    setAnalysis([], 0, -1, VARIANT.NONE); // Analysis table not valid for this new hand/variant!
    const tic = performance.now();
    evaluateHand(handIdx, variant).then((analysisTable) => {
      const toc = performance.now();
      const analysisTime = toc - tic;
      setAnalysis(analysisTable, analysisTime, handIdx, variant);
    });
  }, [
    stage,
    variant,
    handIdx,
    setAnalysis,
    currentAnalysis.handIdx,
    currentAnalysis.variant,
  ]);
};
