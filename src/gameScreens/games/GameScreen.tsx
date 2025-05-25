import { useEffect } from "react";
import styled from "styled-components";
import { Stages } from "../../redux/types";
import {
  useDealtHand,
  useNHands,
  useSetStage,
  useShowAnalysis,
  useShowWarning,
} from "../../redux/hooks";
import { HandDealer } from "../../graphics/HandDealer";
import { useContinuousAnalysis } from "../../strategy/useAnalysis";
import { SubOptimalWarning } from "../home/SubOptimalWarning";
import { MenuBar } from "../menu/MenuBar";
import { GameStatus } from "../menu/GameStatus";
import { PayTable } from "../analysis/PayTable";
import { AnalysisTable } from "../analysis/AnalysisTable";
import { N_HANDS } from "../../types/variant";

const GameDiv = styled.div<{ nHands?: N_HANDS }>`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(${(p) => (p.nHands ?? 1) + 2}, auto) 1fr;
  grid-template-columns: 1fr;
`;

export interface GameScreenProps {
  nHands?: N_HANDS;
}

export const GameScreen = () => {
  const setStage = useSetStage();
  const dealtHand = useDealtHand();
  const showAnalysis = useShowAnalysis();
  const nHands = useNHands();

  const analysisHandSortOrder = dealtHand.handSortOrder;

  useContinuousAnalysis();

  useEffect(() => {
    setStage(Stages.PREGAME);
  }, [setStage]);

  return (
    <GameDiv nHands={nHands}>
      <PayTable />
      {nHands === N_HANDS.ONE && <GameStatus />}
      <HandDealer nHands={nHands} />
      {showAnalysis && (
        <AnalysisTable
          handSortOrder={analysisHandSortOrder}
          abbreviatedHeadings={true}
        />
      )}
      <SubOptimalWarning />
      <MenuBar />
    </GameDiv>
  );
};
