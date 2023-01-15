import { Stages } from "../redux/types";
import { useStage, useWin } from "../redux/hooks";

export const GameStatus = () => {
  const stage = useStage();
  const { winAmount, winName } = useWin();

  switch (stage) {
    case Stages.PREGAME:
      return <div>Click Deal to start</div>;
    case Stages.DEALT:
      return <div>Select holds then Draw to continue</div>;
    case Stages.PAYING:
      if (winAmount) {
        return (
          <div>
            {winName}, You win {winAmount}!
          </div>
        );
      } else {
        return <div>No win :(</div>;
      }
  }

  return <div>{}</div>;
};
