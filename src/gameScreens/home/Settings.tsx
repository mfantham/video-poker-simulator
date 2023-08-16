import styled from "styled-components";
import { VolumeButton } from "../menu/VolumeButton";

const SettingsHolder = styled.div`
  a {
    color: #fff;
  }
`;

const VolumeHolder = styled.div`
  display: flex;
  align-items: center;
`;

export const Settings = () => {
  // More settings coming soon! e.g., change style, language, etc.
  return (
    <SettingsHolder>
      <h1>Settings</h1>
      <VolumeHolder>
        Volume: <VolumeButton />
      </VolumeHolder>
    </SettingsHolder>
  );
};
