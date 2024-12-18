/** @format */

import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "app/shared";
import { axiosCall } from "services";
import { ssoSignUpPath } from "utils";
import { useLoading } from "app/Hooks";
import { SignUpForm, SignUpSubmitProps } from "./";
import { endpoints, routeNames } from "static/routes";
interface LocationProps {
  name: string;
  email: string;
  invitation_token?: string;
}

const { LOGIN } = routeNames;
const { SIGNUP, REGISTER_NEW_USER } = endpoints;

export const SignUp: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sso_signup_url = ssoSignUpPath();
  const [loading, , setTrue, setFalse] = useLoading();
  const { email, name, invitation_token } = (location.state as LocationProps) || {};
  if (import.meta.env.VITE_SSO_ENABLE === "true") {
    window.location.href = sso_signup_url;
  }

  const onSubmit = (data: SignUpSubmitProps) => {
    data.password_confirmation = data.password;
    setTrue();
    if (email) {
      axiosCall({
        data: { ...data, invitation_token },
        method: "post",
        url: REGISTER_NEW_USER,
        isAuth: false,
      }).then((res) => {
        if (res) {
          setFalse();
          Toast({ message: res.message, type: "info" });
          setTimeout(() => {
            navigate(LOGIN);
          }, 1500);
        }
        setFalse();
      });
    } else {
      axiosCall({ data, method: "post", url: SIGNUP, isAuth: false })
        .then((res) => {
          if (res) {
            setFalse();
            Toast({ message: res.message, type: "info" });
            setTimeout(() => {
              navigate(LOGIN);
            }, 1500);
          }
          setFalse();
        })
        .catch(() => setFalse());
    }
  };

  return (
    <div className="ht-100">
      <SignUpForm onSubmit={onSubmit} loading={loading} email={email} name={name} />
    </div>
  );
};
