import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosCall } from "services";
import { useLoading } from "app/Hooks";
import { setInvitationToken } from "utils/Storage";
import { Spinner, Status, Toast } from "app/shared";
import { endpoints, Content, routeNames } from "static";
import { ssoSignInPath, ssoSignUpPath } from "utils";

// const { SIGNUP } = Labels;
const { SINGUP: signUp } = routeNames;
const { INVITE_CONFIRMATION } = endpoints;
const { account_verified, congratulations } = Content;

// const Button = () => (
//   <Link to={signUp}>
//     <Buttonx btnText={SIGNUP} htmlType="button" />
//   </Link>
// );

export const InviteConfirmation = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const sso_signup_url = ssoSignUpPath();
  const sso_signin_url = ssoSignInPath();

  const [status, setStatus] = useState(false);
  const [loading, , setTrue, setFalse] = useLoading(false);
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    axiosCall({
      data: { token },
      method: "post",
      url: INVITE_CONFIRMATION,
      isAuth: false,
    })
      .then((res) => {
        if (res) {
          if (import.meta.env.VITE_SSO_ENABLE === "true") {
            setInvitationToken(token);
            if (res?.new_user) window.location.href = sso_signup_url;
            else window.location.href = sso_signin_url;
          }
          setStatus(true);
          setTrue();
          setTimeout(() => navigate(signUp, { state: { ...res, invitation_token: token } }), 1500);
        } else {
          setStatus(true);
          setFalse();
        }
      })
      .catch((error) => {
        setErrorMessage(
          error?.data?.errors?.token[0] ||
            error?.response?.message ||
            error?.message ||
            "Error while invitation acceptance"
        );
        Toast({
          message:
            error?.data?.errors?.token[0] ||
            error?.response?.message ||
            error?.message ||
            "Error while invitation acceptance",
          type: "error",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      });
    //eslint-disable-next-line
  }, [setTrue, setFalse, setStatus]);

  return loading ? (
    <Status status="success" title={account_verified} subTitle={congratulations} extra={null} />
  ) : !status ? (
    <Spinner directionSize={"100vh"} />
  ) : (
    <Status status="error" title={errorMessage} subTitle="" extra={null} />
  );
};
