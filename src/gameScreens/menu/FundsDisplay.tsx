import { useCoins } from "../../redux/hooks";

export const FundsDisplay = () => {
  const coins = useCoins();
  return <div>Credits: {coins}</div>;
};
