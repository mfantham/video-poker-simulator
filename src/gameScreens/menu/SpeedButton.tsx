import { useIncrementSpeed, useSpeed } from "../../redux/hooks";
import { MenuButton } from "./MenuButton";
import styled from "styled-components";

const SpeedHolder = styled.div`
  font-size: 24px;
  padding-top: 5px;
  padding-left: 3px;
  letter-spacing: -3px;
`;

export const SpeedButton = () => {
  const speed = useSpeed();
  const incrementSpeed = useIncrementSpeed();

  return (
    <MenuButton onClick={incrementSpeed} keyCode={"KeyS"}>
      speed
      <SpeedHolder>
        <span style={{ color: speed > 0 ? "red" : "black" }}>{">"}</span>
        <span style={{ color: speed > 1 ? "red" : "black" }}>{">"}</span>
        <span style={{ color: speed > 2 ? "red" : "black" }}>{">"}</span>
      </SpeedHolder>
    </MenuButton>
  );
};
