import { useIncrementBet, useSetMaxBet, useStage } from "../../redux/hooks";
import { Stages } from "../../redux/types";
import { MenuButton } from "./MenuButton";

export const BetIncrementButtons = () => {
  const incrementBet = useIncrementBet();
  const setMaxBet = useSetMaxBet();
  const stage = useStage();

  const enabled = stage === Stages.PAID || stage === Stages.PREGAME;

  // These are the opposite way round to expected because of row-reverse above
  return (
    <>
      <MenuButton disabled={!enabled} onClick={setMaxBet} keyCode={"KeyM"}>
        bet max
      </MenuButton>
      <MenuButton disabled={!enabled} onClick={incrementBet} keyCode={"KeyN"}>
        bet one
      </MenuButton>
    </>
  );
};
