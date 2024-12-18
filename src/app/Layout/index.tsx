/** @format */

import { useStore } from "app/Hooks";
import { AppRoute } from "router";
import { AppLayout } from "./Layout";
import { useTypedSelector } from "store";
import { Spinner } from "app/shared";
import { useEffect } from "react";

export const MainLayout = () => {
  //@ts-ignore
  const { organization_id, users_organizations, id_token, access_token } = useStore();

  // const handleVisibilityChange = () => {
  //   const id = Number(localStorage.getItem("org_id"));
  //   const exist = users_organizations?.find((org) => org.id == id);
  //   //@ts-ignore
  //   if (exist && organization_id !== id) {
  //     console.log("i am called")
  //     window?.location?.reload();
  //   }
  // };

  const handleLogout = () => {
    const id = Number(localStorage.getItem("org_id"));
    const exist = users_organizations?.find((org) => org.id == id);
    //@ts-ignore
    if (exist && organization_id != id) {
      window?.location?.reload();
    }
  };

  // useEffect(() => {
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem("isTabVisible", "false");
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    const storedVisibility = localStorage.getItem("isTabVisible");
    const isOtherTabVisible = storedVisibility ? JSON.parse(storedVisibility) : true;

    if (!isOtherTabVisible) {
      handleLogout();
    }
  }, []);
  const { appLoader } = useTypedSelector((state: any) => state.loader);
  const auth = Boolean(id_token || access_token);
  const renderHeader = !!(auth && organization_id && !location.pathname.includes("/invite/accept"));

  return (
    <>
      {auth && (
        <>
          {appLoader ? (
            <Spinner directionSize={"100vh"} />
          ) : (
            <AppLayout renderHeader={renderHeader}>
              <AppRoute />
            </AppLayout>
          )}
        </>
      )}
      {!auth && <AppRoute />}
    </>
  );
};
