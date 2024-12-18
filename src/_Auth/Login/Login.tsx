/** @format */

import { useNavigate } from "react-router-dom";
import { LoginFormProps } from ".";
import { useBool, useStore } from "app/Hooks";
import { Spinner } from "app/shared";
import { ssoLogoutPath, ssoSignInPath } from "utils";
import { LoginForm } from "./LoginForm";
import { useTypedDispatch } from "store";
import { endpoints, routeNames } from "static";
import { apiService, currentUserRole } from "store/slices/authSlice";
import { useEffect } from "react";
//import {removeCookies} from "../../utils/Storage";
//import {RESET_STATE_ACTION_TYPE} from "../../store/action/resetState";
const { LOGIN } = endpoints;
const { DASHBOARD, REGISTER_ORGANIZATION, LOGIN: _LOGIN } = routeNames;

export const Login = () => {
  const { organization_id, access_token } = useStore();
  const navigate = useNavigate();
  const sso_url = ssoSignInPath();
  const dispatch = useTypedDispatch();
  const { bool, toggle } = useBool();
  const sso_logout_url = ssoLogoutPath();

  const anotherSession = JSON.parse(localStorage.getItem("anotherSession") as string);
  if (import.meta.env.VITE_SSO_ENABLE === "true") {
    if (anotherSession) {
      localStorage.clear();
      window.location.href = sso_logout_url;
    } else {
      window.location.href = sso_url;
    }
  }
  useEffect(() => {
    access_token && !organization_id && navigate("/register-organization");
  }, []);
  const onSubmit = (data: LoginFormProps) => {
    toggle();
    dispatch(apiService({ data, method: "post", url: LOGIN, isAuth: false }))
      .unwrap()
      .then((res) => {
        const { user = null } = res ? res : {};

        if (!user) {
          toggle();
          return;
        }
        if (user?.current_organization_id) {
          dispatch(
            currentUserRole({
              url: endpoints.CURRENT_USER_ROLE,
            })
          );
        }

        !user.users_organizations.length
          ? navigate(REGISTER_ORGANIZATION, { state: { from: _LOGIN } })
          : navigate(DASHBOARD);
      })
      .catch(() => {
        toggle();
      });
  };

  return (
    <div className="ht-100">
      {import.meta.env.VITE_SSO_ENABLE === "true" ? (
        <Spinner directionSize={"100vh"} />
      ) : (
        <LoginForm onSubmit={onSubmit} loading={bool} />
      )}
    </div>
  );
};
