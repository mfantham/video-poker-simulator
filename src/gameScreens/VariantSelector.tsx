import { useCallback, useMemo } from "react";
import Select, { SingleValue } from "react-select";
import styled from "styled-components";

import { useSetVariant, useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";

type VariantOptionType = {
  value: VARIANT;
  label: VARIANT;
};

const SelectorHolder = styled.div`
  min-width: 240px;
`;

export const VariantSelector = () => {
  const variant = useVariant();
  const setVariant = useSetVariant();
  const options = Object.values(VARIANT).map((v) => ({
    value: v,
    label: v,
  }));
  const onChange = useCallback(
    (option: SingleValue<VariantOptionType>) => {
      setVariant(option?.value ?? VARIANT.DEUCES_WILD);
    },
    [variant]
  );
  const value = useMemo(() => ({ value: variant, label: variant }), [variant]);

  return (
    <SelectorHolder>
      <Select<VariantOptionType>
        value={value}
        options={options}
        onChange={onChange}
      />
    </SelectorHolder>
  );
};
