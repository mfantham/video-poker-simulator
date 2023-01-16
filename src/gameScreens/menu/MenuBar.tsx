import styled from "styled-components";
import { DealButton } from "./DealButton";
import { FundsDisplay } from "./FundsDisplay";

const MenuBarDiv = styled.div`
  position: fixed;
  bottom: 0;
  height: 50px;
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

export const MenuBar = () => {
  return (
    <MenuBarDiv>
      <DealButton />
      <FundsDisplay />
    </MenuBarDiv>
  );
};
