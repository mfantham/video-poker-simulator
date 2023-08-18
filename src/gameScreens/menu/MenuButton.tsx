import { CSSProperties, ReactNode, useCallback, useEffect } from "react";
import styled from "styled-components";

const BUTTON_WIDTH = "130px";
const BUTTON_HEIGHT = "50px";

const ForegroundButton = styled.div<{ disabled: boolean; lockedOn: boolean }>`
  font-family: "Rubik", sans-serif;
  font-weight: 500;
  font-variant: small-caps;
  padding-bottom: 5px;
  border: ${(p) => (p.lockedOn ? "in" : "out")}set #ffffff77 5px;
  width: ${BUTTON_WIDTH};
  height: ${BUTTON_HEIGHT};
  font-size: 32px;
  z-index: 1;
  user-select: none;
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
  text-wrap: nowrap;

  color: blue;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #000000bb;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) => (p.disabled ? "background: #333333cc;" : "cursor: pointer;")}

  &:active {
    border: inset #ffffff77 5px;
  }
`;

const BackgroundButton = styled.div`
  width: ${BUTTON_WIDTH};
  height: ${BUTTON_HEIGHT};
  z-index: 0;
  background: linear-gradient(166deg, #fff700, #ffbd00);
  pointer-events: none;
  overflow: hidden;

  &:has(div:active) {
    background: linear-gradient(166deg, #eee600, #eeac00);
  }
`;

export const MenuButton = ({
  onClick,
  children,
  disabled = false,
  lockedOn = false,
  keyCode,
  title = "",
  style,
}: {
  onClick: () => any;
  children: ReactNode | ReactNode[];
  disabled?: boolean;
  lockedOn?: boolean;
  keyCode?: string | string[];
  title?: string;
  style?: CSSProperties;
}) => {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (keyCode) {
        if (Array.isArray(keyCode)) {
          if (keyCode.includes(e.code)) {
            onClick();
          }
        } else {
          if (e.code === keyCode) {
            onClick();
          }
        }
      }
    },
    [keyCode, onClick]
  );
  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [handleKeyUp]);

  return (
    <BackgroundButton style={style}>
      <ForegroundButton
        onClick={disabled ? () => null : onClick}
        disabled={disabled}
        lockedOn={lockedOn}
        title={title}
      >
        {!disabled && children}
      </ForegroundButton>
    </BackgroundButton>
  );
};
