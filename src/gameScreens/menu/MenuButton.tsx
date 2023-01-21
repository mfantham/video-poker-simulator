import styled from "styled-components";
import { ReactNode } from "react";

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

  color: blue;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #00000077;
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
  &:hover {
    linear-gradient(346deg, #00ffff, #0000cc);
  }
`;

export const MenuButton = ({
  onClick,
  children,
  disabled = false,
  lockedOn = false,
}: {
  onClick: () => any;
  children: ReactNode;
  disabled?: boolean;
  lockedOn?: boolean;
}) => {
  return (
    <BackgroundButton>
      <ForegroundButton
        onClick={disabled ? () => null : onClick}
        disabled={disabled}
        lockedOn={lockedOn}
      >
        {!disabled && children}
      </ForegroundButton>
    </BackgroundButton>
  );
};
