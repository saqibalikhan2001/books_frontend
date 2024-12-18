/** @format */

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import { routeNames } from "static";
import { AppHeader, SideBar, SettingSideBar } from "app/shared";

const { Content, Footer } = Layout;

const settingPanel = [
  // routeNames.TAX,
  // routeNames.USERS,
  // routeNames.ACCOUNTS,
  routeNames.CURRENCY,
  routeNames.WAREHOUSE,
  // routeNames.PREFERENCES,
  routeNames.PAYMENT_METHODS,
  // routeNames.ORGANIZATION_PROFILE,
  // routeNames.ORGANIZATION_LISTING,
];

export const AppLayout = ({
  children,
  renderHeader,
}: {
  children: ReactNode;
  renderHeader: boolean;
}) => {
  const { pathname = routeNames.DASHBOARD } = useLocation();

  const sideBar = !settingPanel.includes(pathname) ? <SideBar /> : <SettingSideBar />;

  const userLayout = pathname === '/users' ? 'user-layout' : '';
  return (
    <>
      <Layout className={`custom-layout ${userLayout}`}>
        {/* <Header
          className="main_header"
        > */}
        <AppHeader renderHeader={renderHeader} />

        {/* </Header> */}
        <Layout>
          {renderHeader && <>{sideBar}</>}
          <Content>{children}</Content>
        </Layout>
        <Footer className="footer" style={{ display: "none" }}>
          Copyright ©{new Date().getFullYear()} SeeBiz Inc. <br />
          Terms & Conditions | Privacy Policy | +1 212 986 9911 | support@seebiz-books.com
        </Footer>
      </Layout>
    </>
  );
};
