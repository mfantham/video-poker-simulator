import styled from "styled-components";
import { BatchPlay } from "../../batchPlay/BatchPlay";

const AutoDiv = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  grid-template-columns: 1fr;
`;

export const AutoPlay = () => {
  return (
    <AutoDiv>
      <BatchPlay />
    </AutoDiv>
  );
};
