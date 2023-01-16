import styled from "styled-components";
import { useBetSize, useVariant } from "../../redux/hooks";
import { paytable } from "../../payoutCalculations";

const PAY_COLUMN_WIDTH = "50px";
const PAY_COLUMNS = new Array(5).fill(PAY_COLUMN_WIDTH).join(" ");

const PayTableElement = styled.div`
  width: 100%;
  display: grid;
  border: 2px solid yellow;
  grid-template-columns: 1fr ${PAY_COLUMNS};
  font-size: 16px;
`;

export const PayTable = () => {
  const variant = useVariant();
  const nameWinTable = paytable(variant);
  const betSize = useBetSize();

  const rows = nameWinTable.map((row) => {
    const cells = row.map((cell, idx) => {
      const cellStyle = {
        textAlign: idx === 0 ? "left" : "center",
        background: idx === betSize ? "#ff0000aa" : "none",
      };
      // @ts-ignore TODO: lookup why textAlign isn't allowed
      return <div style={cellStyle}>{cell}</div>;
    });
    return <>{cells}</>;
  });
  return <PayTableElement>{rows}</PayTableElement>;
};
