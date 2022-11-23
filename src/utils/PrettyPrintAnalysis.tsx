import React from "react";
import { HoldsTable } from "../types/Hold";

export const PrettyPrintAnalysis = ({
  analysisTable,
}: {
  analysisTable: HoldsTable;
}) => {
  if (analysisTable.length === 0) {
    return null;
  }

  const rows = analysisTable.map(([holdPattern, holdStats]) => {
    const statsColumns = Object.values(holdStats).map((v, i) => {
      if (i === 2) return <td key={i}>{v.toFixed(0)}</td>;
      return <td key={i}>{v.toPrecision(4)}</td>;
    });
    return (
      <tr key={holdPattern}>
        <td>{holdPattern}</td>
        {statsColumns}
      </tr>
    );
  });
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
