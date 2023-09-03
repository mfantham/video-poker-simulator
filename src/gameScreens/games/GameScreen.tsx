import { useEffect, useState } from "react";
import styled from "styled-components";
import { Stages } from "../../redux/types";
import {
  useDealtHand,
  useFullHand,
  useNHands,
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
  const stage = useStage();
  const { hand } = useFullHand();
  const dealtHand = useDealtHand();
  const showAnalysis = useShowAnalysis();
  const nHands = useNHands();

  const analysisHandIdx = dealtHand.handIdx;
  const analysisHandSortOrder = dealtHand.handSortOrder;

  console.log(dealtHand);

  useEffect(() => {
    setStage(Stages.PREGAME);
  }, [setStage]);

  return (
    <GameDiv nHands={nHands}>
      <PayTable />
      <GameStatus />
      <HandDealer hand={hand} nHands={nHands} />
      {showAnalysis && (
        <AnalysisTable
          handIdx={analysisHandIdx}
          handSortOrder={analysisHandSortOrder}
        />
      )}
      <MenuBar />
    </GameDiv>
  );
};
