/**@format */

import { TablePrefTabs } from "./TablePrefTabs";
import { useTabs } from "app/Hooks";

const TablePreferences = () => {
  const { current, handleChange } = useTabs(true);

  return (
    <>
      <TablePrefTabs handleChange={handleChange} current={current} />
    </>
  );
};

export default TablePreferences;
