/** @format */

import { useCallback, useState } from "react";
import { Headers } from "./Header";
import { MainDrawer } from "app/Layout/Drawer";

export const AppHeader = ({ renderHeader }: { renderHeader: boolean }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  const cacheToggle = useCallback(toggle, [collapsed]);
  return (
    <>
      {renderHeader && <Headers toggle={toggle} />}
      <MainDrawer cacheToggle={cacheToggle} collapsed={collapsed} />
    </>
  );
};
