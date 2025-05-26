import { Checkbox, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import {
  useIncrementVolume,
  useOverlayOptimalPlay,
  useToggleOverlayOptimalPlay,
  useToggleWarnMistakes,
  useWarnMistakes,
  useWebGPUAnalysis,
  useToggleWebGPUAnalysis,
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
  cursor: pointer;
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
  label,
  title,
}: {
  toggle: () => void;
  value: boolean;
  label: string;
  title?: string;
}) => {
  return (
    <BooleanSwitchHolder title={title}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onClick={toggle}
            sx={{
              color: "white",
              "&.Mui-checked": {
                color: "white",
              },
              "& .MuiSvgIcon-root": { fontSize: 28 },
            }}
          />
        }
        label={label}
        sx={{ "& .MuiFormControlLabel-label": { fontSize: 27 } }}
      />
    </BooleanSwitchHolder>
  );
};

export const Settings = () => {
  // More settings coming soon! e.g., change style, language, etc.
  const warnMistakes = useWarnMistakes();
  const toggleWarnMistakes = useToggleWarnMistakes();
  const overlayOptimalPlay = useOverlayOptimalPlay();
  const toggleOverlayOptimalPlay = useToggleOverlayOptimalPlay();
  const webGPUAnalysis = useWebGPUAnalysis();
  const toggleWebGPUAnalysis = useToggleWebGPUAnalysis();
  const incrementVolume = useIncrementVolume();

  return (
    <SettingsHolder>
      <h1>Settings</h1>
      <SettingHolder>
        <BooleanSwitch
          value={warnMistakes}
          toggle={toggleWarnMistakes}
          label={"Warn on sub-optimal play"}
        />
      </SettingHolder>
      <SettingHolder>
        <BooleanSwitch
          value={overlayOptimalPlay}
          toggle={toggleOverlayOptimalPlay}
          label={"Overlay optimal play"}
        />
      </SettingHolder>
      <SettingHolder onClick={incrementVolume}>
        <VolumeButton />
        Volume
      </SettingHolder>
      <br />
      <br />
      <BooleanSwitch
        value={webGPUAnalysis}
        toggle={toggleWebGPUAnalysis}
        label={"WebGPU analysis"}
        title={"Improve hand analysis speed by 100X"}
      />
    </SettingsHolder>
  );
};
