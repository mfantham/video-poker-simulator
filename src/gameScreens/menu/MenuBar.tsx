import styled from "styled-components";
import { DealButton } from "./DealButton";
import { FundsDisplay } from "./FundsDisplay";
import { BetDisplay } from "./BetDisplay";
import { BetIncrementButtons } from "./BetIncrementButtons";
import { ShowAnalysisButton } from "./ShowAnalysisButton";

const BUTTON_ROW_HEIGHT = "60px"; // button height + padding. calc?
const TOP_ROW_MENU_HEIGHT = "42px";

const MenuBarHolder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(10px);
  height: calc(${BUTTON_ROW_HEIGHT} + ${TOP_ROW_MENU_HEIGHT});
`;

export const MenuBarTopRow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${BUTTON_ROW_HEIGHT};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

export const MenuBarButtonRow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${BUTTON_ROW_HEIGHT};
  display: flex;
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
        <ShowAnalysisButton />
        <BetIncrementButtons />
        <DealButton />
      </MenuBarButtonRow>
    </MenuBarHolder>
  );
};
