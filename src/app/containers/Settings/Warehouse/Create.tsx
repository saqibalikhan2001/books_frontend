/** @format */

import { PageHeader } from "@ant-design/pro-layout";
import { Button, Space, Typography } from "antd";
import { endpoints } from "static";
import { WarehouseForm } from "./Form";
import { WrCreateProps } from "./Type";
import { Toast, Icons } from "app/shared";
import { useAxios, useLoading } from "app/Hooks";

const { FaWarehouse, VscAdd } = Icons;
const { Title } = Typography;
const { WAREHOUSE } = endpoints;

export const CreateWarehouse = ({
  ctry_list,
  refetch,
  has_permission,
}: WrCreateProps) => {
  const [loading] = useLoading();
  const { callAxios, bool, toggle } = useAxios();

  const onSubmit = (values: object) => {
    toggle();
    callAxios({
      method: "post",
      data: values,
      url: WAREHOUSE,
    }).then((res) => {
      if (res) {
        toggle();
        refetch();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <WarehouseForm
        bool={bool}
        toggle={toggle}
        loading={loading}
        onSubmit={onSubmit}
        ctry_list={ctry_list}
        has_permission={has_permission}
      />
      <PageHeader
        title={
          <Space>
            <FaWarehouse size={25} />
            <Title level={3}>Warehouses</Title>
          </Space>
        }
        extra={
          <Button
            key="1"
            icon={<VscAdd size={14} />}
            className="pr-color"
            onClick={toggle}>
            New Warehouse
          </Button>
        }
        style={{ borderBottom: "1px solid", paddingBottom: "0" }}
      />
    </>
  );
};
