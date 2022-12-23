import Select, { SingleValue } from "react-select";
import { useSetVariant, useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";
import { useCallback, useMemo } from "react";

type VariantOptionType = {
  value: VARIANT;
  label: VARIANT;
};

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
    <Select<VariantOptionType>
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
