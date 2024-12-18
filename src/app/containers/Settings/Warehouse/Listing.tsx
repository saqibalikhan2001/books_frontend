import { useCallback } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { WrListingProps } from "./Type";
import { Icons, Toast } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";

const { Meta } = Card;
const { AiOutlineEdit, RiDeleteBinLine, TiTickOutline } = Icons;
const { WAREHOUSE } = endpoints;

export const Listing = ({
  toggle,
  refetch,
  has_permission,
  warehouses = [],
}: WrListingProps) => {
  const { callAxios, handleConfirm } = useAxios();
  const handleMarkPrimary = (id: number) => {
    callAxios({
      method: "put",
      url: `${WAREHOUSE}/${id}/markasprimary`,
    }).then((res) => {
      if (res) {
        Toast({
          message: "Warehouse Marked as Primary successfully",
        });
        refetch();
      }
    });
  };

  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, WAREHOUSE, refetch),
    [handleConfirm, refetch]
  );

  return (
    <>
      <Row gutter={[0, 24]}>
        {warehouses.map((val: any) => (
          <Col span={8} key={val.id}>
            <Card
              hoverable
              title={
                <Badge.Ribbon
                  text={val.is_primary ? "Primary" : ""}
                  color={val.is_primary ? "gold" : "white"}
                  style={
                    val.is_primary ? { top: "0", bottom: "0", right: "0" } : {}
                  }>
                  <Typography>{val.name}</Typography>
                </Badge.Ribbon>
              }
              style={{ maxWidth: 500, top: "20px" }}
              headStyle={{ paddingLeft: "24px", paddingRight: "0" }}
              actions={[
                val.platform_type === "books" && (
                  <Button
                    key="button"
                    size="small"
                    shape="circle"
                    icon={<AiOutlineEdit key="edit" />}
                    onClick={() => toggle(val.id)}
                  />
                ),
                !val.is_primary && val.platform_type === "books" && (
                  <Popconfirm
                    key="confirm"
                    placement="top"
                    title={
                      has_permission
                        ? `Delete "${val.name}" Warehouse ?`
                        : " Permission Denied"
                    }
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => has_permission && memoizeConfirm(val)}>
                    <Button size="small" key="deletebtn" shape="circle">
                      <RiDeleteBinLine />
                    </Button>
                  </Popconfirm>
                ),
                !val.is_primary ? (
                  <TooltipX key="tickbtn" title="Mark as Active">
                    <Popconfirm
                      key="confirm"
                      placement="bottom"
                      title={`Mark "${val.name}" Warehouse  as Primary?`}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleMarkPrimary(val.id)}>
                      <Button size="small" shape="circle">
                        <TiTickOutline />
                      </Button>
                    </Popconfirm>
                  </TooltipX >
                ) : null,
              ]}>
              <Meta
                title={
                  <Space direction="vertical">
                    <Typography>{val.email}</Typography>
                    <Tag color="geekblue">Platform</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    <Typography>{val.address}</Typography>
                    <Typography>{`${val.city}, ${val.state}`}</Typography>
                    <Typography>{val.country?.country_name}</Typography>
                    <Typography>{val.phone}</Typography>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};
