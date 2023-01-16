import { Stages } from "../../redux/types";
import { useBetSize, useStage, useWin } from "../../redux/hooks";

export const GameStatus = () => {
  const stage = useStage();
  const { winAmount, winName } = useWin();
  const betSize = useBetSize();
  const winPay = betSize * winAmount;

  switch (stage) {
    case Stages.PREGAME:
      return <div>Click Deal to start</div>;
    case Stages.DEALT:
      return <div>{winAmount > 0 ? <>{winName}</> : <>&nbsp;</>}</div>;
    case Stages.PAYING:
      if (winAmount) {
        return (
          <div>
            {winName}, You win {winPay}!
          </div>
        );
      } else {
        return <div>No win :(</div>;
      }
  }

  return <div> </div>;
};
