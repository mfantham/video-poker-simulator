import styled from "styled-components";
import {
  useIncrementSpeed,
  useIncrementVolume,
  useSpeed,
  useVolume,
} from "../../redux/hooks";
import { MenuButton } from "./MenuButton";

const VolumeHolder = styled.div`
  font-size: 60px;
  color: white;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  user-select: none;
`;

export const VolumeButton = () => {
  const volume = useVolume();
  const incrementVolume = useIncrementVolume();

  return (
    <VolumeHolder onClick={incrementVolume}>
      <span className={"material-symbols-rounded"} style={{ fontSize: 60 }}>
        {volume < 1 ? "volume_mute" : volume < 2 ? "volume_down" : "volume_up"}
      </span>
    </VolumeHolder>
  );
};
