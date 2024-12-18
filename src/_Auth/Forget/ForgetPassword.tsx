/** @format */
// import { useLayoutEffect } from "react";
import { Toast } from "app/shared";
import { axiosCall } from "services";
import { SubmitProps } from ".";
import { ForgetPasswordForm } from ".";
import { useLoading } from "app/Hooks";
import { endpoints } from "static/routes";
import { ssoForgetPasswordPath } from "utils";

const { FORGET_PASSWORD } = endpoints;

export const ForgetPassword = () => {
  const [loading, toggle] = useLoading();
  const sso_forget = ssoForgetPasswordPath();
  if (import.meta.env.VITE_SSO_ENABLE === "true") window.location.href = sso_forget;

  // useLayoutEffect(() => {
  //   if (import.meta.env.VITE_SSO_ENABLE === "true") window.location.href = sso_forget;
  // }, [sso_forget]);

  const onSubmit = (data: SubmitProps) => {
    toggle();
    axiosCall({
      data,
      method: "post",
      url: FORGET_PASSWORD,
      isAuth: false,
    }).then((res) => {
      toggle();
      if (res) Toast({ message: res.message, type: "info" });
    });
  };

  return (
    <div className="ht-100">
      <ForgetPasswordForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
};
