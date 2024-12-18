/** @format */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Icons } from "../";
import { routeNames, Labels } from "static";
import OrganizationDrawer from "../OrganizationDrawer";

const { Item } = Menu;
const { Sider } = Layout;

export const SettingSideBar = () => {
  const [open, setOpen] = useState(false);
  const { pathname = routeNames.DASHBOARD } = useLocation();

  const toggleDrawer = () => setOpen((visible) => !visible);
  return (
    <>
      <Sider
        collapsible
        collapsedWidth={60}
        style={{
          backgroundColor: "#fff",
          minHeight: "100vh",
          // borderTopColor: 'red',
          // borderTopStyle: 'solid',
          // borderTop: 10
        }}
      >
        <Typography>
          <Link to={routeNames.DASHBOARD}>
            <PageHeader
              style={{ backgroundColor: "#FFFFFF", color: "black" }}
              title={
                <Typography.Title level={5} style={{ color: "black", margin: 0 }}>
                  {Labels.BACK}
                </Typography.Title>
              }
              backIcon={<Icons.IoMdArrowRoundBack color="black" size={20} />}
              onBack={() => null}
            />
          </Link>
        </Typography>
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          style={{ backgroundColor: "#FFFFFF", color: "black" }}
        >
          <Item
            className="menu-item"
            onClick={toggleDrawer}
            key={Labels._ORGANIZATION_PROFILE}
            icon={<Icons.CgOrganisation size={18} />}
          >
            {Labels._ORGANIZATION_PROFILE}
          </Item>

          <Item className="menu-item" key={Labels._WAREHOUSE} icon={<Icons.FaWarehouse />}>
            <Link to={routeNames.WAREHOUSE}>{Labels._WAREHOUSE}</Link>
          </Item>

          <Item
            className="menu-item"
            key={Labels._CURRENCY}
            icon={<Icons.HiOutlineCurrencyDollar size={20} />}
          >
            <Link to={routeNames.CURRENCY}>{Labels._CURRENCY}</Link>
          </Item>
          {/* <Item key={Labels._TAXES} icon={<Icons.HiReceiptTax size={20} />}>
            <Link to={`${routeNames.TAX}?tab=1`}>{Labels._TAXES}</Link>
          </Item> */}
          <Item
            className="menu-item"
            key={Labels._ACCOUNTS}
            icon={<Icons.MdAccountBox size={20} />}
          >
            <Link to={`${routeNames.ACCOUNTS}?tab=1`}>{Labels._ACCOUNTS}</Link>
          </Item>
          <Item
            className="menu-item"
            key={Labels._PAYMENT_METHODS}
            icon={<Icons.MdOutlinePayments size={20} />}
          >
            <Link to={routeNames.PAYMENT_METHODS}>{Labels._PAYMENT_METHODS}</Link>
          </Item>
        </Menu>
      </Sider>
      <OrganizationDrawer toggleDrawer={toggleDrawer} open={open} />{" "}
    </>
  );
};
