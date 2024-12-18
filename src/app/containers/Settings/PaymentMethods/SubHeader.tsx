/**@format */

import { PageHeader } from "@ant-design/pro-layout";
import { Button, Space, Typography } from "antd";
import { Icons } from "app/shared";
import { Labels } from "static";

const { Title } = Typography;
const { MdOutlinePayments, VscAdd } = Icons;
const { NEW_PAYMENT_METHOD, _PAYMENT_METHODS } = Labels;

export const SubHeader = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <PageHeader
      title={
        <Space>
          <MdOutlinePayments size={25} />
          <Title level={3}>{_PAYMENT_METHODS}</Title>
        </Space>
      }
      extra={[
        <Button key="1" icon={<VscAdd size={14} />} className="pr-color" onClick={closeModal}>
          {NEW_PAYMENT_METHOD}
        </Button>,
      ]}
      style={{ borderBottom: "1px solid gray", paddingBottom: "0" }}
    />
  );
};
