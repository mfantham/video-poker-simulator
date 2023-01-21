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

const HighlightColumn = styled.div<{ column: number; length: number }>`
  grid-column: ${(p) => `${p.column}/${p.column + 1}`};
  grid-row: 1 / ${(p) => p.length + 1};
  background: linear-gradient(155deg, #ff0000cc, #ff000077);
  z-index: 1;
`;

export const PayTable = () => {
  const variant = useVariant();
  const nameWinTable = paytable(variant);
  const betSize = useBetSize();

  const rows = nameWinTable.map((row, rowIdx) => {
    const cells = row.map((cell, idx) => {
      if (row.includes(0)) return null;

      const cellStyle = {
        margin: "-2px 5px",
        textAlign: idx === 0 ? "left" : "center",
        gridColumn: `${idx + 1}/${idx + 2}`,
        gridRow: `${rowIdx + 1}/${rowIdx + 2}`,
        zIndex: 2,
      };
      // @ts-ignore TODO: lookup why textAlign isn't allowed
      return <div style={cellStyle}>{cell}</div>;
    });
    return <>{cells}</>;
  });
  return (
    <PayTableElement>
      {rows}
      <HighlightColumn column={betSize + 1} length={rows.length} />
    </PayTableElement>
  );
};
