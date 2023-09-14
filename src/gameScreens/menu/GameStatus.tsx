import { Stages } from "../../redux/types";
import { useBetSize, useNHands, useStage, useWin } from "../../redux/hooks";
import { N_HANDS } from "../../types/variant";

export const GameStatus = () => {
  const stage = useStage();
  const { winAmount, winName } = useWin();
  const nHands = useNHands();

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
      if (nHands > N_HANDS.ONE) {
        return <div>&nbsp;</div>;
      }
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
