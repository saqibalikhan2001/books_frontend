import { Tabs } from "antd";
import { TaxRate } from "./TaxRate";
import { TaxTabsProps } from "./Types";

const tabChildren = [
  {
    key: "1",
    label: "Tax Rates",
    children: <TaxRate />,
  },
  {
    key: "2",
    label: "Tax Settings",
    children: <>Tax Setting in progress</>,
  },
];

export const TaxTabs = ({ current, handleChange }: TaxTabsProps) => {
  return (
    <>
      <Tabs
        tabPosition="left"
        activeKey={current}
        items={tabChildren}
        onChange={handleChange}
      />
    </>
  );
};
