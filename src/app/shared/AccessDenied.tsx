/**@format */

import { Result } from "antd";
// import { useNavigate } from "react-router-dom";

export const AccessDenied = ({ style }: any) => {
  // const navigate = useNavigate();

  return (
    <Result
      className="access_denied"
      status="403" // '403 | 404 | "500" | "success" | "error" | "info" | "warning" | undefined'
      title="Access Denied"
      subTitle="You don’t have Permission"
      style={style}
      extra={
        null
        // <Button type="primary" onClick={() => navigate(-1)}>
        //   Go Back
        // </Button>
      }
    />
  );
};
