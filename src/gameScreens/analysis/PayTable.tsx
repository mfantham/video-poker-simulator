import styled from "styled-components";
import { useBetSize, useVariant } from "../../redux/hooks";
import { paytable } from "../../payoutCalculations";
import { useCallback, useState } from "react";

const PAY_COLUMN_WIDTH = "50px";
const PAY_COLUMNS = new Array(5).fill(PAY_COLUMN_WIDTH).join(" ");

const PayTableElement = styled.div`
  display: grid;
  width: 655px;
  border: 2px solid yellow;
  grid-template-columns: 1fr ${PAY_COLUMNS};
  font-size: 16px;
  margin: auto;
`;

const PayStringHolder = styled.div`
  position: relative;
  &:not(:hover) .material-symbols-rounded {
    display: none;
  }
  font-size: 24px;
`;

const ToggleCollapseButton = styled.span`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  user-select: none;
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

  const [collapse, setCollapse] = useState(true);
  const toggleCollapse = useCallback(() => setCollapse((s) => !s), []);

  if (collapse) {
    const winsString = [...nameWinTable]
      .reverse()
      .map(([_, win]) => `${win ? win * betSize : ""}`)
      .filter((x) => x)
      .join(", ");
    return (
      <PayStringHolder>
        {winsString}
        <ToggleCollapseButton
          className="material-symbols-rounded"
          style={{ cursor: "pointer" }}
          onClick={toggleCollapse}
        >
          add_circle
        </ToggleCollapseButton>
      </PayStringHolder>
    );
  }

  const rows = nameWinTable.map((row, rowIdx) => {
    const cells = row.map((cell, idx) => {
      if (row.includes(0)) return null;
      const textAlign: AlignSetting = idx === 0 ? "left" : "center";

      const cellStyle = {
        margin: "-2px 5px",
        textAlign: textAlign,
        gridColumn: `${idx + 1}/${idx + 2}`,
        gridRow: `${rowIdx + 1}/${rowIdx + 2}`,
        zIndex: 2,
      };
      return <div style={cellStyle}>{cell}</div>;
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
          style={{ cursor: "pointer" }}
          onClick={toggleCollapse}
        >
          do_not_disturb_on
        </ToggleCollapseButton>
      </PayTableElement>
    </PayStringHolder>
  );
};
