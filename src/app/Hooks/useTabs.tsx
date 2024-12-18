/**@format */

import { useState } from "react";
import { useSearchParam } from "./";

export const useTabs = (with_pagination?: boolean) => {
  const { param, setSearchParams } = useSearchParam("tab", with_pagination);
  const [current, setCurrent] = useState(param);

  const handleChange = (activeKey: string) => {
    setCurrent(activeKey);
    setSearchParams({ tab: activeKey });
  };

  return { current, handleChange };
};
