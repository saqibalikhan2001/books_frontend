import { useBoolean } from "ahooks";

export const useBool = (state: boolean = false) => {
  const [bool, { toggle, setTrue, setFalse }] = useBoolean(state);

  return { bool, toggle, setTrue, setFalse } as const;
};
