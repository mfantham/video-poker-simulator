import styled from "styled-components";
import { useBetSize } from "../../redux/hooks";

const BetDisplayHolder = styled.div`
  user-select: none;
`;

export const BetDisplay = () => {
  const betSize = useBetSize();

  return <BetDisplayHolder>Bet: {betSize}</BetDisplayHolder>;
};
