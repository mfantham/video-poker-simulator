import { useCoinsPerBet, useIncrementCoinsPerBet } from "../../redux/hooks";
import styled from "styled-components";

const prettyPrintCoinsPerBet = (coinsPerBet: number) => {
  if (coinsPerBet < 1) {
    return `${coinsPerBet * 100}¢`;
  }
  return `$${coinsPerBet}`;
};

const IncrementButton = styled.div`
  user-select: none;
  color: red;
  cursor: pointer;
  background: linear-gradient(166deg, #fff700, #ffbd00);
  margin: auto;
  border-radius: 90px / 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #bc8b00ff;
  font-family: "Rubik", sans-serif;
  font-weight: 500;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #000000bb;
  font-size: 32px;
  width: 90px;
  height: 70px;
`;

export const CoinsPerBetButton = () => {
  const coinsPerBet = useCoinsPerBet();
  const incrementCoinsPerBet = useIncrementCoinsPerBet();
  const buttonText = prettyPrintCoinsPerBet(coinsPerBet);

  return (
    <IncrementButton onClick={incrementCoinsPerBet}>
      {buttonText}
    </IncrementButton>
  );
};
