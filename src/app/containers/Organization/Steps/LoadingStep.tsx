/**@format */

import { css } from "@emotion/react";
import { Col, Row, Space, Typography } from "antd";
import { BeatLoader } from "react-spinners";

const { Text } = Typography;
export const LoadingStep = () => {
  return (
    <>
      <Row gutter={[0, 18]}  className="loading_block">
        <Col span={24} >
          <Space direction="vertical" className="center_text" >
            <Text className="final_text">Your Product is being configured...</Text>
            <Text className="warning_text">Do not close this tab</Text>
            <BeatLoader
              color="blue"
              size={10}
              css={css`
                padding: 85px;
              `}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
};
