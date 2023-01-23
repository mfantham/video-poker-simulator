import { useIncrementSpeed, useSpeed } from "../../redux/hooks";
import { MenuButton } from "./MenuButton";

export const SpeedButton = () => {
  const speed = useSpeed();
  const incrementSpeed = useIncrementSpeed();

  return (
    <MenuButton onClick={incrementSpeed}>
      speed
      <span style={{ color: speed > 0 ? "red" : "black" }}>{">"}</span>
      <span style={{ color: speed > 1 ? "red" : "black" }}>{">"}</span>
      <span style={{ color: speed > 2 ? "red" : "black" }}>{">"}</span>
    </MenuButton>
  );
};
