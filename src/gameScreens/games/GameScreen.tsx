import styled from "styled-components";
import { Stages } from "../../redux/types";
import React, { useEffect } from "react";
import {
  useBetSize,
  useCurrentHand,
  useSetStage,
  useStage,
} from "../../redux/hooks";
import { GHand } from "../../graphics/gHand";
import { MenuBar } from "../menu/MenuBar";
import { GameStatus } from "../menu/GameStatus";
import { PayTable } from "../analysis/PayTable";

const GameDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GameScreen = () => {
  const setStage = useSetStage();
  const stage = useStage();
  const hand = useCurrentHand();

  useEffect(() => {
    setStage(Stages.PREGAME);
  }, [setStage]);

  return (
    <GameDiv>
      <PayTable />
      <GameStatus />
      <GHand hand={hand} editable={false} holdable={stage === Stages.DEALT} />
      <MenuBar />
    </GameDiv>
  );
};
