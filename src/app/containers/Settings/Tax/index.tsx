/**@format */

import { TaxTabs } from "./Tabs";
import { useTabs } from "app/Hooks";

const Tax = () => {
  const { current, handleChange } = useTabs();

  return (
    <>
      <TaxTabs handleChange={handleChange} current={current} />
    </>
  );
};

export default Tax;
