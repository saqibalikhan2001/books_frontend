import { removeOperators } from "./removeOperator";

export const convertInNumber = (value) => {
  const adjustmentValue = Number(`${value?.sign}${value?.value}` || 0);
  return adjustmentValue;
};
export const optimizeValues = (value) => {
  return {
    sign: (parseFloat(value ?? 0).toFixed(2) as any) >= 0 ? "+" : "-",
    value: removeOperators(parseFloat(value ?? 0).toFixed(2)),
  };
};
