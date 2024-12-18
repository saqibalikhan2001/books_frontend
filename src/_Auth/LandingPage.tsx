import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { endpoints, routeNames } from "static";
import { Buttonx, Spinner } from "app/shared";
//@ts-ignore
import { ssoLogoutPath, ssoSignInPath } from "utils";
import { useEffect, useState } from "react";
import { useAxios, useStore } from "app/Hooks";
import { useTypedDispatch } from "store";
import { Logout } from "store/slices/authSlice";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { getcookietoken, removeCookies, removeCookieToken } from "utils/Storage";

const { LOGIN } = routeNames;
const { LOGOUT } = endpoints;

export const LandingPage = () => {
  const navigate = useNavigate();
  // const sso_login = ssoSignInPath();
  const sso_logout = ssoLogoutPath();

  const { callAxios } = useAxios();
  const dispatch = useTypedDispatch();
  const cookies_token = getcookietoken();
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const { id_token = "", access_token = "" } = useStore();

  const handleClick = () => {
    navigate(`${import.meta.env.VITE_ENVIRONMENT_REDIRECT_URL}`);
    // if (import.meta.env.VITE_SSO_ENABLE === "true") {
    //   window.location.href = sso_login;
    // } else {
    // }
  };

  useEffect(() => {
    if (cookies_token || access_token) {
      callAxios({
        data: { accessToken: access_token || cookies_token },
        method: "post",
        url: `/auth/accessToken`,
      }).then((res) => {
        setLoading(false);
        if (!res) {
          setLoading(false);
          removeCookieToken();
          removeCookies();
          if (import.meta.env.VITE_SSO_ENABLE === "true") {
            window.location.href = sso_logout;
          }
          dispatch(Logout({ url: LOGOUT }))
            .unwrap()
            .then((res) => {
              if (res) {
                dispatch({ type: RESET_STATE_ACTION_TYPE });
                localStorage.clear();
                navigate(LOGIN, { replace: true });
              }
            });
        }
      });
    } else {
      navigate(`${import.meta.env.VITE_ENVIRONMENT_REDIRECT_URL}`);
    }
  }, [cookies_token, access_token]);

  return (
    <>
      {loading ? (
        <>
          <Spinner directionSize={"100vh"} />
        </>
      ) : (
        <>
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography.Title
              style={{ color: "darkblue", fontSize: "100px" }}
              className="hover-underline"
            >
              Welcome to Books live
            </Typography.Title>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Buttonx
              type="ghost"
              shape="default"
              btnText="Sign In"
              clickHandler={handleClick}
              className="btn-form-size btn-primary"
            />
          </div>
        </>
      )}
    </>
  );
};
