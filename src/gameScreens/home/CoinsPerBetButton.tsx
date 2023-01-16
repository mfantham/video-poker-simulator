import { useCoinsPerBet, useIncrementCoinsPerBet } from "../../redux/hooks";

const prettyPrintCoinsPerBet = (coinsPerBet: number) => {
  if (coinsPerBet < 1) {
    return `ç${coinsPerBet * 100}`;
  }
  return `$${coinsPerBet}`;
};

export const CoinsPerBetButton = () => {
  const coinsPerBet = useCoinsPerBet();
  const incrementCoinsPerBet = useIncrementCoinsPerBet();
  const buttonText = prettyPrintCoinsPerBet(coinsPerBet);

  return <button onClick={incrementCoinsPerBet}>{buttonText}</button>;
};
