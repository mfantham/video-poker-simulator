import styled from "styled-components";
import {
  useOverlayOptimalPlay,
  useToggleOverlayOptimalPlay,
  useToggleWarnMistakes,
  useWarnMistakes,
} from "../../redux/hooks";
import { VolumeButton } from "../menu/VolumeButton";

const SettingsHolder = styled.div`
  a {
    color: #fff;
  }
`;

const SettingHolder = styled.div`
  display: flex;
  align-items: center;
`;

const BooleanSwitchHolder = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
`;

const BooleanSwitch = ({
  toggle,
  value,
}: {
  toggle: () => void;
  value: boolean;
}) => {
  return (
    <BooleanSwitchHolder onClick={toggle}>
      {value ? "YES" : "NO"}
    </BooleanSwitchHolder>
  );
};

export const Settings = () => {
  // More settings coming soon! e.g., change style, language, etc.
  const warnMistakes = useWarnMistakes();
  const toggleWarnMistakes = useToggleWarnMistakes();
  const overlayOptimalPlay = useOverlayOptimalPlay();
  const toggleOverlayOptimalPlay = useToggleOverlayOptimalPlay();

  return (
    <SettingsHolder>
      <h1>Settings</h1>
      <SettingHolder>
        Volume: <VolumeButton />
      </SettingHolder>
      <SettingHolder>
        Warn on sub-optimal play:{" "}
        <BooleanSwitch value={warnMistakes} toggle={toggleWarnMistakes} />
      </SettingHolder>
      <SettingHolder>
        Overlay optimal play:{" "}
        <BooleanSwitch
          value={overlayOptimalPlay}
          toggle={toggleOverlayOptimalPlay}
        />
      </SettingHolder>
    </SettingsHolder>
  );
};
