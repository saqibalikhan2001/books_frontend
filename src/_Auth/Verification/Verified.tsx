import { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosCall } from "services";
import { Buttonx, Spinner, Status } from "app/shared";
import { useLoading, useGetSearchParam } from "app/Hooks";
import { endpoints, Content, Labels, routeNames } from "static";

const { LOGIN } = Labels;
const { LOGIN: login } = routeNames;
const { EMAIL_VERIFIED } = endpoints;
const { account_verified, congratulations } = Content;

const Button = () => (
  <Link to={login}>
    <Buttonx btnText={LOGIN} htmlType="button" />
  </Link>
);

export const Verification = () => {
  const [status, setStatus] = useState(false);
  const { param: token } = useGetSearchParam("token");
  const [loading, , setTrue, setFalse] = useLoading(false);
  const [errorMessage, setErrorMessage] = useState('');


  useLayoutEffect(() => {
    axiosCall({
      data: { register_confirm_token: token },
      method: "post",
      url: EMAIL_VERIFIED,
      isAuth: false,
    }).then((res) => {
      if (res) {
        setStatus(true);
        setTrue();
      } else {
        setStatus(true);
        setFalse();
      }
    }) .catch((error) =>
    {
      setErrorMessage(error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        "Error while invitation acceptance",);
      
  }
  );
  }, [token, setTrue, setFalse, setStatus]);

  return loading ? (
    <Status
      status="success"
      title={account_verified}
      subTitle={congratulations}
      extra={<Button key="btn" />}
    />
  ) : !status ? (
    <Spinner />
  ) : (
    <Status
      status="error"
      title={errorMessage}
      subTitle=""
      extra={<Button key="confirm-btn" />}
    />
  );
};
