/** @format */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTypedDispatch } from "store";
import { endpoints, routeNames } from "../../static/routes";
import { RootState, useTypedSelector } from "../../store";
import { getcookietoken, removeCookies, removeCookieToken } from "../../utils/Storage";
import { Logout, apiService } from "../../store/slices/authSlice";
import { currentUserRole } from "store/slices/authSlice";
import { Spinner, Toast } from "app/shared";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { ssoLogoutPath, ssoSignInPath } from "utils";
const { CURRENT_USER_ROLE } = endpoints;

export const CheckLogin = () => {
  const navigate = useNavigate();

  const dispatch = useTypedDispatch();
  const {
    details,
    organization_id,
    users_organizations = [],
  } = useTypedSelector((state: RootState) => state.authReducer || {});
  const token = getcookietoken();
  const sso_signin = ssoSignInPath();
  const sso_logout = ssoLogoutPath();

  const handleClick = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "false") {
      dispatch(Logout({ url: endpoints.LOGOUT }))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch({ type: RESET_STATE_ACTION_TYPE });
            localStorage.clear();
            navigate(routeNames?.LOGIN, { replace: true });
            Toast({ message: res.message });
          }
        });
    } else {
      window.location.href = sso_signin;
    }
  };

  useEffect(() => {
    /*console.log(
      "inside check login ------------------------------- ",
      import.meta.env.VITE_SSO_ENABLE
    );*/
    if (import.meta.env.VITE_SSO_ENABLE === "true") {
      //console.log("2");
      // console.log("after sso redirect to books ---> ", token);
      organization_id && dispatch(currentUserRole({ url: CURRENT_USER_ROLE }));
      if (token) {
        dispatch(
          apiService({
            data: { accessToken: token },
            method: "post",
            url: `/auth/accessToken`,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("then---check login file----", res);
            if (res) localStorage.setItem("sso_check", "true");
            /*console.log(
                "users_organizations in check login----> ",
                users_organizations,
                details,
                organization_id
              );
              console.log("user resp ----> ", res.user.users_organizations, res.user?.platform_type);*/
            if (!users_organizations.length && !res.user.users_organizations.length) {
              //console.log("check login inside if 44 and navigate to register organization");
              navigate(routeNames.REGISTER_ORGANIZATION, {
                state: { from: routeNames.LOGIN },
              });
            } else if (details?.platform_type || res.user?.platform_type) {
              //console.log("check login inside else if 49");
              navigate(routeNames.DASHBOARD);
            } else {
              //console.log("check login inside else 64");
              navigate("/", { replace: true });
            }
          })
          //@ts-ignore
          .catch((err) => {
            removeCookieToken();
            removeCookies();
            // console.log({ erroToDispatch: err });
            window.location.href = sso_logout;
          });
      } else {
        handleClick();
      }
    }
    //eslint-disable-next-line
  }, [token, organization_id]);

  return (
    <>
      <Spinner directionSize={"100vh"} />
    </>
  );
};
