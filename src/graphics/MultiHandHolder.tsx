import { ReactNode } from "react";
import styled from "styled-components";
import { N_HANDS } from "../types/variant";

interface MultiHandHolderProps {
  nHands: number;
  children: ReactNode | ReactNode[];
}

const MasterHand = styled.div``;

const ThreeHandHolder = styled.div`
  display: flex;
  flex-direction: column;
`;

const FiveHandHolder = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const TenHandHolder = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
`;

const HundredHandHolder = styled.div`
  display: grid;
  grid-template-rows: repeat(11, 1fr);
  grid-template-columns: repeat(9, 1fr);
`;

export const MultiHandHolder = ({ nHands, children }: MultiHandHolderProps) => {
  const [firstHand, otherHands] = Array.isArray(children)
    ? [children[0], children.slice(1)]
    : [children, []];

  const OtherHands = () => {
    switch (nHands) {
      case N_HANDS.ONE_HUNDRED:
        return <HundredHandHolder>{otherHands}</HundredHandHolder>;
      case N_HANDS.TEN:
        return <TenHandHolder>{otherHands}</TenHandHolder>;
      case N_HANDS.FIVE:
        return <FiveHandHolder>{otherHands}</FiveHandHolder>;
      case N_HANDS.THREE:
        return <ThreeHandHolder>{otherHands}</ThreeHandHolder>;
      case N_HANDS.ONE:
      default:
        return <></>;
    }
  };

  return (
    <MasterHand>
      {firstHand}
      <OtherHands />
    </MasterHand>
  );
};
