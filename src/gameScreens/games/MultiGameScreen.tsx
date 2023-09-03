import { useEffect, useState } from "react";
import styled from "styled-components";
import { Stages } from "../../redux/types";
import {
  useFullHand,
  useSetStage,
  useShowAnalysis,
  useStage,
} from "../../redux/hooks";
import { HandDealer } from "../../graphics/HandDealer";
import { MenuBar } from "../menu/MenuBar";
import { GameStatus } from "../menu/GameStatus";
import { PayTable } from "../analysis/PayTable";
import { AnalysisTable } from "../analysis/AnalysisTable";
import { SortIndex } from "../../types/SortIndex";
import { N_HANDS } from "../../types/variant";

const GameDiv = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  grid-template-columns: 1fr;
`;

export interface GameScreenProps {
  nHands?: N_HANDS;
}

export const MultiGameScreen = ({ nHands = N_HANDS.ONE }: GameScreenProps) => {
  const setStage = useSetStage();
  const stage = useStage();
  const { hand, handIdx, handSortOrder } = useFullHand();
  const showAnalysis = useShowAnalysis();

  const [analysisHandIdx, setAnalysisHandIdx] = useState<number>(handIdx);
  const [analysisHandSortOrder, setAnalysisHandSortOrder] =
    useState<SortIndex>(handSortOrder);

  useEffect(() => {
    if (stage === Stages.DEALT) {
      // Only update analysis table on deal
      setAnalysisHandIdx(handIdx);
      setAnalysisHandSortOrder(handSortOrder);
    }
  }, [stage, handIdx, handSortOrder]);

  useEffect(() => {
    setStage(Stages.PREGAME);
  }, [setStage]);

  return (
    <GameDiv>
      <GameStatus />
      <HandDealer hand={hand} nHands={nHands} />
      <MenuBar />
    </GameDiv>
  );
};
