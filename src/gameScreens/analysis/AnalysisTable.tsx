import { useEffect, useState } from "react";
import styled from "styled-components";

import { PrettyPrintAnalysis } from "./PrettyPrintAnalysis";
import { evaluateHand } from "../../strategy/evaluateHand";
import { HoldsTable } from "../../types/Hold";
import { useNHands, useVariant } from "../../redux/hooks";
import { SortIndex } from "../../types/SortIndex";
import { handIdxToHand } from "../../utils/handIdxToHand";
import { N_HANDS } from "../../types/variant";
import { Dialog } from "@mui/material";

const AnalysisTimeHolder = styled.div`
  position: absolute;
  bottom: 0;
  backdrop-filter: blur(10px);
  width: 100%;
`;

const AnalysisTime = ({ showTime = false, analysisTime = 0 }) => {
  if (!showTime) return null;
  if (analysisTime === 0) {
    return <AnalysisTimeHolder>Analysing ...</AnalysisTimeHolder>;
  }
  return (
    <AnalysisTimeHolder>
      Analysis took {(analysisTime / 1000).toFixed(3)} s
    </AnalysisTimeHolder>
  );
};

export const AnalysisTable = ({
  showTime = false,
  handIdx,
  handSortOrder,
}: {
  showTime?: boolean;
  handIdx: number;
  handSortOrder?: SortIndex;
}) => {
  const variant = useVariant();
  const sortedHand = handIdxToHand(handIdx);
  const nHands = useNHands();

  const [analysis, setAnalysis] = useState([] as HoldsTable);
  const [analysisTime, setAnalysisTime] = useState(0);

  useEffect(() => {
    setAnalysis([]); // Analysis table not valid for this new hand/variant!
    setAnalysisTime(0);
    const tic = performance.now();
    evaluateHand(handIdx, variant).then((analysisTable) => {
      const toc = performance.now();
      setAnalysisTime(toc - tic);
      setAnalysis(analysisTable);
    });
  }, [variant, handIdx]);

  if (nHands > N_HANDS.ONE) {
    return (
      <Dialog open={true}>
        <PrettyPrintAnalysis
          analysisTable={analysis}
          holdsOrder={handSortOrder}
          sortedHand={sortedHand}
        />
      </Dialog>
    );
  }

  return (
    <>
      <PrettyPrintAnalysis
        analysisTable={analysis}
        holdsOrder={handSortOrder}
        sortedHand={sortedHand}
      />
      <AnalysisTime showTime={showTime} analysisTime={analysisTime} />
    </>
  );
};
