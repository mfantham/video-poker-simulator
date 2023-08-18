import styled from "styled-components";

export const AnalysisPageHolder = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr;
  position: absolute;
  inset: 0;
`;

export const AnalysisHeaderHolder = styled.div`
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WinNameHolder = styled.span`
  width: 220px;
  text-align: end;
`;
