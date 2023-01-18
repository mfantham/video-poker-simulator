import React from "react";
import { HoldsTable } from "../../types/Hold";
import { intToHoldString } from "../../utils/intToHoldString";
import { SortIndex } from "../../types/SortIndex";

const DEFAULT_HOLDS_LENGTH = 32;

export const PrettyPrintAnalysis = ({
  analysisTable,
  holdsOrder,
}: {
  analysisTable: HoldsTable;
  holdsOrder?: SortIndex;
}) => {
  let rows = new Array(DEFAULT_HOLDS_LENGTH).fill(0).map((_, idx) => (
    <tr key={idx}>
      <td>{intToHoldString(idx)}</td>
      <td>&nbsp;</td>
    </tr>
  ));

  if (analysisTable?.length > 0) {
    rows = analysisTable.map(([holdPattern, holdStats]) => {
      const statsColumns = Object.values(holdStats).map((v, i) => {
        if (i === 2) return <td key={i}>{v.toFixed(0)}</td>;
        return <td key={i}>{v.toPrecision(5)}</td>;
      });
      const orderedPattern =
        holdsOrder?.length === 5
          ? holdsOrder.map((i) => holdPattern[i]).join("")
          : holdPattern;
      return (
        <tr key={holdPattern}>
          <td>{orderedPattern}</td>
          {statsColumns}
        </tr>
      );
    });
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Hold</th>
          <th>Expected win (coins)</th>
          <th>Chance of win %</th>
          <th>Max possible win</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
