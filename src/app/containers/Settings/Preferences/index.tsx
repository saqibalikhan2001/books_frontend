/**@format */

import { useTabs } from "app/Hooks";
import { PreferenceTabs } from "./PreferenceTabs";

const Preferences = () => {
  const { current, handleChange } = useTabs(true);

  return (
    <>
      <PreferenceTabs handleChange={handleChange} current={current} />
    </>
  );
};

export default Preferences;
