import { ReactNode } from "react";
import { ConfigProvider } from "antd";

export const Antd_theme_provider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "IBM Plex Sans",
          colorPrimary: "#005fdb",
          borderRadius: 4,
          fontWeightStrong: 400,
        },
        components: {
          Button: {
            colorPrimary: "#005fdb",
            fontSize:14,
            borderRadius:3
          },
          Card: {},
          Form: {},
          Grid: {},
          List: {},
          Menu: {},
          Tabs: {},
          Spin: {},
          Radio: {},
          Modal: {},
          Empty: {},
          Image: {},
          Input: {},
          Space: {},
          Steps: {},
          Table: {},
          Drawer: {},
          Select: {},
          Avatar: {},
          Layout: {},
          Popover: {},
          Divider: {},
          Calendar: {},
          Checkbox: {},
          Collapse: {},
          Dropdown: {},
          Popconfirm: {},
          DatePicker: {},
          InputNumber: {},
          Descriptions: {},
        },
      }}>
      {children}
    </ConfigProvider>
  );
};
