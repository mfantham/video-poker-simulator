import { CSSProperties, useCallback, useState } from "react";
import styled from "styled-components";

import { useBetSize, useVariant } from "../../redux/hooks";
import { paytable } from "../../payoutCalculations";
import { PayStringHolder, PayString } from "./PayString";

const PAY_COLUMN_WIDTH = "50px";
const PAY_COLUMNS = new Array(5).fill(PAY_COLUMN_WIDTH).join(" ");

const PayTableElement = styled.div`
  display: grid;
  backdrop-filter: brightness(0.5);
  max-width: 655px;
  border: 2px solid yellow;
  grid-template-columns: 1fr ${PAY_COLUMNS};
  font-size: 16px;
  margin: auto;
`;

const ToggleCollapseButton = styled.span`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  user-select: none;
`;

type PayTableCellStyle = {
  margin: string;
  textAlign: AlignSetting;
  gridColumn: string;
  gridRow: string;
  zIndex: number;
  overflow?: string;
  maxWidth?: string;
  whiteSpace?: CSSProperties["whiteSpace"];
  textOverflow?: string;
};

interface HighlightColumnProps {
  column: number;
  length: number;
}

const HighlightColumn = styled.div<HighlightColumnProps>`
  grid-column: ${(p) => `${p.column}/${p.column + 1}`};
  grid-row: 1 / ${(p) => p.length + 1};
  background: linear-gradient(155deg, #ff0000cc, #ff000077);
  z-index: 1;
`;

export const PayTable = () => {
  const variant = useVariant();
  const nameWinTable = paytable(variant);
  const betSize = useBetSize();

  const [collapse, setCollapse] = useState(true);
  const toggleCollapse = useCallback(() => setCollapse((s) => !s), []);

  if (collapse) {
    return (
      <PayString>
        <ToggleCollapseButton
          className="material-symbols-rounded"
          onClick={toggleCollapse}
        >
          add_circle
        </ToggleCollapseButton>
      </PayString>
    );
  }

  const rows = nameWinTable.map((row, rowIdx) => {
    const cells = row.map((cell, idx) => {
      if (row.includes(0)) return null;
      const textAlign: AlignSetting = idx === 0 ? "left" : "center";
      // const whiteSpace: WhiteSpace = "nowrap";

      const cellStyle: PayTableCellStyle = {
        margin: "-2px 5px",
        textAlign: textAlign,
        gridColumn: `${idx + 1}/${idx + 2}`,
        gridRow: `${rowIdx + 1}/${rowIdx + 2}`,
        zIndex: 2,
      };
      if (idx === 0) {
        // cellStyle.maxWidth = "100px";
        cellStyle.overflow = "hidden";
        cellStyle.textOverflow = "ellipsis";
        cellStyle.whiteSpace = "nowrap";
      }

      return (
        <div style={cellStyle} key={idx}>
          {cell}
        </div>
      );
    });
    return <>{cells}</>;
  });
  return (
    <PayStringHolder>
      <PayTableElement>
        {rows}
        <HighlightColumn column={betSize + 1} length={rows.length} />
        <ToggleCollapseButton
          className="material-symbols-rounded"
          onClick={toggleCollapse}
        >
          do_not_disturb_on
        </ToggleCollapseButton>
      </PayTableElement>
    </PayStringHolder>
  );
};
