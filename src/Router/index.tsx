/** @format */
//@ts-nocheck
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./Route";
import { routeNames } from "static";
// import { RootState, useTypedSelector } from "store";
import { getcookieAccountStatus, getcookietoken } from "utils/Storage";

export const AppRoute = () => {
  const navigate = useNavigate();
  const token = getcookietoken();
  const accountStatus = getcookieAccountStatus();

  // useEffect(() => {
  //     if (accountStatus) navigate("/accountAuthenticate");

  // }, [])

  useEffect(() => {
    if (import.meta.env.VITE_SSO_ENABLE === "true") {
      const sso_check = JSON.parse(localStorage.getItem("sso_check") as any);
      //   console.log("after sso redirect to books ---> ", token, " -----> ", sso_check);
      //   for get user updated permissions
      //   this line is commented because our roles permissions are fetching directly after 403 status in store.tsx and useAxios.tsx
      //   organization_id && dispatch(currentUserRole({ url: CURRENT_USER_ROLE }));

      if (accountStatus) navigate("/accountAuthenticate");

      if (sso_check === null || !token) {
        localStorage.setItem("sso_check", "false");
        // console.log(
        //   "sso_check value is updated, due to token not found or sso_check value is not set in local_storage"
        // );
      }
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <AppRoutes />
    </>
  );
};
