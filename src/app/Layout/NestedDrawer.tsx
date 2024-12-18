/** @format */

import { Drawer, Row, Space, Typography, Col } from "antd";
import { Icons } from "app/shared";
import { ShareOrganization } from "app/containers/Organization/ShareOrganization";

const { VscClose } = Icons;

export const NestedDrawer = ({
  item,
  collapsed,
  closeDrawer,
  toggleInnerDrawer,
}: {
  item: any;
  toggleInnerDrawer;
  collapsed: boolean;
  refetch?: () => void;
  closeDrawer: () => void;
}) => {
  return (
    <>
      <Drawer
        width={350}
        maskClosable={!!collapsed}
        contentWrapperStyle={{
          top: "54px",
        }}
        bodyStyle={{ padding: "10px" }}
        headerStyle={{
          backgroundColor: "#f3f8fe",
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        }}
        title={
          <Space
            style={{
              display: "flex",
              alignItems: "inherit",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography style={{ textAlign: "end" }}>
              <VscClose size={25} onClick={closeDrawer} style={{ cursor: "pointer" }} />
            </Typography>
            <Row gutter={[8, 8]}>
              <Col span={24}>{item.name}</Col>
            </Row>
          </Space>
        }
        destroyOnClose
        placement="right"
        closable={false}
        onClose={closeDrawer}
        open={collapsed}
      >
        <ShareOrganization organization={item} toggleInnerDrawer={toggleInnerDrawer} />
      </Drawer>
    </>
  );
};
