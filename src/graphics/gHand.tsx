import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";
import { useBetSize, useHolds, useStage, useToggleHold } from "../redux/hooks";
import { Stages, Win } from "../redux/types";
import { HidePattern } from "../types/HidePattern";
import { useCallback, useEffect } from "react";
import { WinColors } from "./WinColors";

const HandHolder = styled.div<{ mini: boolean }>`
  display: flex;
  gap: ${(p) => (p.mini ? "2px" : "10px")};
  margin: auto;
`;

const WinInfo = styled.div<{ winName: string }>`
  border: 5px solid ${(p) => WinColors[p.winName] ?? "#333333"};
  padding: 5px 70px 5px 10px;
  width: 300px;
  position: absolute;
  margin: auto;
  background: #22222277;
  backdrop-filter: blur(5px);
  color: white;
  border-radius: 20px;
`;

const WinAmountText = styled.div<{ winName: string }>`
  width: 70px;
  background: ${(p) => WinColors[p.winName] ?? "#333333"}77;
  border: 5px solid ${(p) => WinColors[p.winName] ?? "#333333"};
  border-radius: 20px;
  position: absolute;
  right: -5px;
  top: -5px;
  bottom: -4.8px;
  padding-top: 5px;
`;

const WinInfoHolder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HandHolder2 = styled.div`
  display: flex;
  justify-content: center;
`;

export const GHand = ({
  hand,
  editable = false,
  holdable = false,
  hide = [false, false, false, false, false],
  mini = false,
  fixedHolds = undefined,
  win,
}: {
  hand: Hand;
  editable?: boolean;
  holdable?: boolean;
  hide?: HidePattern;
  mini?: boolean;
  fixedHolds?: HidePattern;
  win?: Win;
}) => {
  const toggleHold = useToggleHold();
  const holds = useHolds();
  const stage = useStage();
  const betSize = useBetSize();

  const hidden = stage === Stages.PREGAME;
  if (hidden) {
    hide = [true, true, true, true, true];
  }

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (holdable && ["1", "2", "3", "4", "5"].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        toggleHold(idx);
      }
    },
    [holdable, toggleHold]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  });

  const cards = hand.map((card, idx) => {
    const holdCallback = (idx: number) => {
      if (holdable) toggleHold(idx);
    };

    return (
      <GCard
        key={idx}
        mini={mini}
        card={card}
        hidden={hide[idx]}
        editable={editable}
        holdable={holdable}
        hold={fixedHolds?.[idx] ?? holds[idx]}
        holdCallback={() => holdCallback(idx)}
      />
    );
  });

  if (mini) {
    return <HandHolder mini={mini}>{cards}</HandHolder>;
  }

  return (
    <Grid2 width="100%">
      <Grid2
        container
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          position: "relative",
          maxWidth: { md: "650px" },
          margin: "auto",
        }}
      >
        {cards}
        {win && (
          <WinInfoHolder>
            <WinInfo winName={win.winName}>
              {win.winName}
              <WinAmountText winName={win.winName}>
                {win.winAmount * betSize}
              </WinAmountText>
            </WinInfo>
          </WinInfoHolder>
        )}
      </Grid2>
    </Grid2>
  );
};
