import { Typography } from "antd";
import { Buttonx, Toast } from "app/shared";
import React from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "static";
import { useTypedDispatch } from "store";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { Logout } from "store/slices/authSlice";
import { ssoLogoutPath } from "utils";
import { getcookieAccountStatus } from "utils/Storage";
import Cookies from "universal-cookie";

export function AuthenticateAccount() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const sso_logout = ssoLogoutPath();
  const dispatch = useTypedDispatch();
  const accountStatus = getcookieAccountStatus();

  const handleClick = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "false") {
      dispatch(Logout({ url: endpoints.LOGOUT }))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch({ type: RESET_STATE_ACTION_TYPE });
            localStorage.clear();
            navigate(endpoints.LOGIN, { replace: true });
            Toast({ message: res.message });
          }
        });
    } else {
      cookies.remove("account_status", { path: "/" });
      window.location.href = sso_logout;
    }
  };

  const renderMessage = () => {
    if (accountStatus === "be_server_down")
      return (
        <>
          <Typography.Title level={3}>Server Connectivity</Typography.Title>
          <Typography>
            Our Servers are down right now. <br />
            We will be back soon.
          </Typography>
        </>
      );
    if (accountStatus === "inactive_account")
      return (
        <>
          <Typography.Title level={3}>Server Connectivity</Typography.Title>
          <Typography>
            Our database is down right now. <br />
            We will be back soon.
          </Typography>
        </>
      );
    if (accountStatus === "inactive_user")
      return <Typography.Title level={3}>Your account has been deactivated.</Typography.Title>;
    return;
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginTop: "100px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
          background: "#e7e7e7",
          border: "1px solid #e7e7e7",
          borderRadius: "12px",
        }}
      >
        {renderMessage()}
        <Buttonx
          wrapperCol={{
            offset: 5,
            span: 12,
          }}
          linkTo={""}
          size="small"
          btnText={"Back"}
          className="btn-form-size btn-primary"
          style={{ width: "100%", marginTop: "20px" }}
          clickHandler={handleClick}
        />
      </div>
    </div>
  );
}
