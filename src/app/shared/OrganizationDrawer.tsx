/**@fomrat */

import { Link } from "react-router-dom";
import { Col, Descriptions, Divider, Drawer, Row, Space, Tag, Typography } from "antd";
import { Icons } from ".";
import { routeNames } from "static";
import { useStore } from "app/Hooks";
import { TooltipX } from "./ToolTip";

const { AiOutlineCheckCircle, AiOutlineCloseCircle } = Icons;

const OrganizationDrawer = ({
  open,
  toggleDrawer,
}: {
  open: boolean;
  toggleDrawer: () => void;
}) => {
  const { current_organization_id, primary_organization } = useStore();

  return (
    <>
      <Drawer width={640} placement="right" closable={false} onClose={toggleDrawer} open={open}>
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography.Title level={4}>Organization Profile</Typography.Title>
          {primary_organization.platform_type === "books" && (
            <Typography.Title level={5} onClick={toggleDrawer}>
              <Link to={`${routeNames.ORGANIZATION_PROFILE}?org=${current_organization_id}`}>
                Edit Organization
              </Link>
            </Typography.Title>
          )}
        </Space>
        <Divider />
        <Row>
          <Col span={12}>
            <Descriptions title="Name">
              <Descriptions.Item>{primary_organization.name}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions title="Active">
              <Descriptions.Item>{`${!!primary_organization.is_active}`}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions title="Platform">
              <Descriptions.Item>{primary_organization.platform_type}</Descriptions.Item>
            </Descriptions>
          </Col>
          {primary_organization.platform_type === "ims,books" && (
            <Col span={12}>
              <Descriptions title="Shared">
                <Descriptions.Item>{`${!!primary_organization.is_shared}`}</Descriptions.Item>
              </Descriptions>
            </Col>
          )}
          <Divider />
          <Typography.Title level={5}>Module Permissions</Typography.Title>

          <Col span={24}>
            {primary_organization?.module_permissions?.map((val) => (
              <TooltipX
                title={val.status ? "Permission Granted" : "Permission Not Granted"}
                key={val.general_modules_id}
              >
                <Tag
                  icon={val.status ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
                  color={val.status ? "success" : "error"}
                  style={{ padding: "3px 10px", marginBottom: "10px" }}
                >
                  {val.name}
                </Tag>
              </TooltipX >
            ))}
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default OrganizationDrawer;
