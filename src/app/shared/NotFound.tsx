/**@format */

import { useLottie } from "lottie-react";
import { Result, Space } from "antd";
import error_animation from "assets/lotties/error_404.json";
import { Buttonx } from "./Button";

const options = {
  loop: true,
  autoplay: true,
  animationData: error_animation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const NotFound = () => {
  const { View } = useLottie(options);
  return (
    <Space direction="vertical" style={{ margin: "auto 800px" }}>
      <>{View}</>
      <Result extra={<Buttonx type="link" linkTo="/dashboard" btnText="Back Home" />} />
    </Space>
  );
};
