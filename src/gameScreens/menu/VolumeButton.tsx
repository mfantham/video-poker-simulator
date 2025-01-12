import styled from "styled-components";
import {
  useIncrementSpeed,
  useIncrementVolume,
  useSpeed,
  useVolume,
} from "../../redux/hooks";
import { MenuButton } from "./MenuButton";

const VolumeHolder = styled.div`
  color: white;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: none;
`;

export const VolumeButton = () => {
  const volume = useVolume();

  return (
    <VolumeHolder>
      <span className={"material-symbols-rounded"} style={{ fontSize: 48 }}>
        {volume < 1 ? "volume_mute" : volume < 2 ? "volume_down" : "volume_up"}
      </span>
    </VolumeHolder>
  );
};
