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
      if (winAmount > 0) {
        dispatchEvent(new CustomEvent("win-on-the-deal"));
        return <div>{winName}</div>;
      }
      return <div>&nbsp;</div>;
    case Stages.PAYING:
    case Stages.PAID:
      if (winAmount) {
        return (
          <div>
            {winName}, You win {winPay}!
          </div>
        );
      } else {
        return <div>No win :(</div>;
      }
    default:
      return <div>&nbsp;</div>;
  }
};
