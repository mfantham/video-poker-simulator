import styled from "styled-components";
import { DealButton } from "./DealButton";
import { FundsDisplay } from "./FundsDisplay";
import { BetDisplay } from "./BetDisplay";
import { BetIncrementButtons } from "./BetIncrementButtons";

export const MenuBarDiv = styled.div`
  position: fixed;
  bottom: 0;
  height: 50px;
  display: flex;
  width: 50%;
  justify-content: space-between;
  align-items: center;
`;

export const MenuBar = () => {
  return (
    <MenuBarDiv>
      <DealButton />
      <BetIncrementButtons />
      <BetDisplay />
      <FundsDisplay />
    </MenuBarDiv>
  );
};
