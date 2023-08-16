import styled from "styled-components";

import { DealButton } from "./DealButton";
import { FundsDisplay } from "./FundsDisplay";
import { BetDisplay } from "./BetDisplay";
import { BetIncrementButtons } from "./BetIncrementButtons";
import { ShowAnalysisButton } from "./ShowAnalysisButton";
import { SpeedButton } from "./SpeedButton";

const BUTTON_ROW_HEIGHT = "60px"; // button height + padding. calc?

const MenuBarHolder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

export const MenuBarTopRow = styled.div`
  left: 0;
  right: 0;
  bottom: ${BUTTON_ROW_HEIGHT};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const MenuBarButtonRow = styled.div`
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  flex-flow: row-reverse wrap-reverse;
  justify-content: space-between;
`;

export const MenuBar = () => {
  return (
    <MenuBarHolder>
      <MenuBarTopRow>
        <BetDisplay />
        <FundsDisplay />
      </MenuBarTopRow>
      <MenuBarButtonRow>
        <DealButton />
        <BetIncrementButtons />
        <SpeedButton />
        <ShowAnalysisButton />
      </MenuBarButtonRow>
    </MenuBarHolder>
  );
};
