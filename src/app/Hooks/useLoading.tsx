import { useBoolean } from "ahooks";

export const useLoading = (state: boolean = false) => {
  const [loading, { toggle, setTrue, setFalse }] = useBoolean(state);

  return [loading, toggle, setTrue, setFalse] as const;
};
