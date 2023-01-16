import { useIncrementBet, useSetMaxBet, useStage } from "../../redux/hooks";
import { Stages } from "../../redux/types";

export const BetIncrementButtons = () => {
  const incrementBet = useIncrementBet();
  const setMaxBet = useSetMaxBet();
  const stage = useStage();

  const enabled = stage === Stages.PAID || stage === Stages.PREGAME;

  return (
    <>
      <button disabled={!enabled} onClick={incrementBet}>
        bet one
      </button>
      <button disabled={!enabled} onClick={setMaxBet}>
        bet max
      </button>
    </>
  );
};
