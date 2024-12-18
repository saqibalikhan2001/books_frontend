/**@format */

import { useEffect, useState } from "react";
import { getKeyFromLS, setValueInLS } from "utils";

export const handleTabs = () => {
  const value = getKeyFromLS("tab_key");
  const [current, setCurrent] = useState<any>();
  useEffect(() => {
    setCurrent(value);
  }, [value]);
  const handleChange = (activeKey: string) => {
    setCurrent(activeKey);
    setValueInLS("tab_key", activeKey);
  };

  return { current, handleChange };
};
