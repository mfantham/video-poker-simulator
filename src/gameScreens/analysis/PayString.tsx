import { ReactNode } from "react";
import styled from "styled-components";

import { useBetSize, useVariant } from "../../redux/hooks";
import { paytable } from "../../payoutCalculations";

export const PayStringHolder = styled.div`
  position: relative;
  &:not(:hover) .material-symbols-rounded {
    display: none;
  }
  font-size: 24px;
  max-width: 100vw;
  overflow: hidden;
`;

interface PayStringProps {
  children?: ReactNode;
}

export const PayString = ({ children }: PayStringProps) => {
  const variant = useVariant();
  const nameWinTable = paytable(variant);
  const betSize = useBetSize();

  const winsString = [...nameWinTable]
    .reverse()
    .map(([_, win]) => `${win ? win * betSize : ""}`)
    .filter((x) => x)
    .join(", ");
  return (
    <PayStringHolder>
      {winsString}
      {children}
    </PayStringHolder>
  );
};
