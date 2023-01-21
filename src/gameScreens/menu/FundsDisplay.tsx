import { useCallback, useState } from "react";
import styled from "styled-components";
import { useCoins, useCoinsPerBet } from "../../redux/hooks";

const FundsDisplayHolder = styled.div`
  cursor: pointer;
  user-select: none;
  text-align: right;
`;

export const FundsDisplay = () => {
  const [displayCredits, setDisplayCredits] = useState(true);

  const handleClick = useCallback(() => {
    setDisplayCredits((s) => !s);
  }, []);

  const coins = useCoins();
  const coinsPerBet = useCoinsPerBet();

  const credits = coins / coinsPerBet;

  return (
    <FundsDisplayHolder onClick={handleClick}>
      {displayCredits ? <>Credits: {credits}</> : <>Bank: ${coins}</>}
    </FundsDisplayHolder>
  );
};
