/**@format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, Input, Button, Popover, Typography, Divider, Dropdown } from "antd";
import { Icons } from "..";
import { routeNames } from "static";
import { ListTypes } from "./Types";
import { useStore } from "app/Hooks";
import OrganizationDrawer from "../OrganizationDrawer";

const data = [
  {
    title: "Organization Profile",
    // icon: <Icons.CgOrganisation size={18} />,
    link: routeNames.ORGANIZATION_PROFILE,
    org: true,
  },
  // {
  //   title: " Users & Roles",
  //   // icon: <Icons.AiOutlineUsergroupAdd size={18} />,
  //   link: routeNames.USERS,
  //   tab: true,
  // },
  {
    title: "Warehouses",
    // icon: <Icons.FaWarehouse size={18} />,
    link: routeNames.WAREHOUSE,
  },
  // {
  //   title: "Preferences",
  //   // icon: <Icons.MdOutlineRoomPreferences size={18} />,
  //   link: routeNames.PREFERENCES,
  //   tab: true,
  // },
  {
    title: "Currencies",
    // icon: <Icons.HiOutlineCurrencyDollar size={18} />,
    link: routeNames.CURRENCY,
  },
  {
    title: "Taxes",
    // icon: <Icons.HiReceiptTax size={18} />,
    link: routeNames.TAX,
    tab: true,
  },
  {
    title: "Accounts",
    // icon: <Icons.MdAccountBox size={18} />,
    link: routeNames.ACCOUNTS,
    tab: true,
  },
  {
    title: "Payment Methods",
    // icon: <Icons.MdOutlinePayments size={18} />,
    link: routeNames.PAYMENT_METHODS,
  },
];

const Listx = ({ visible, handleVisible }: ListTypes) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { current_organization_id, primary_organization } = useStore();

  const toggleDrawer = () => setOpen((visible) => !visible);
  const handleHoverEffect = () => setHover((hov) => !hov);
  const items: any["items"] = [
    {
      type: "group",
      label: "Settings",
      children: [
        {
          key: "1",
          label: "Preferences",
          // icon: <Icons.VscAdd />,
          onClick: () => {
            navigate("/preferences?tab=1");
          },
          hide: true,
        },
        {
          key: "2",
          label: "Pdf Preference",
          // icon: <Icons.VscAdd />,
          onClick: () => navigate("/pdf-preferences"),
          hide: true,
        },
      ].filter((x) => x.hide),
    },
  ];

  return (
    <>
      <Popover
        key="popover"
        content={
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item key={index} onClick={() => handleVisible(false)}>
                <List.Item.Meta
                  // avatar={item.icon}
                  title={
                    primary_organization?.id === current_organization_id && item.org ? (
                      <Button
                        type="link"
                        style={{
                          margin: "-16px",
                          color: hover ? "#1890fc" : "black",
                        }}
                        onClick={toggleDrawer}
                        onMouseEnter={handleHoverEffect}
                        onMouseLeave={handleHoverEffect}
                      >
                        {item.title}
                      </Button>
                    ) : (
                      <Link to={item.tab ? `${item.link}?tab=1` : `${item.link}`}>
                        {item.title}
                      </Link>
                    )
                  }
                />
              </List.Item>
            )}
          />
        }
        title={
          <Typography>
            Settings
            <Icons.VscClose
              size={20}
              onClick={() => handleVisible(false)}
              style={{ cursor: "pointer", float: "right" }}
            />
            <Divider />
            <Input.Search name="search" allowClear enterButton placeholder="Search Settings" />
          </Typography>
        }
        trigger="click"
        open={visible}
        color="#f3f8fe"
        placement="bottom"
        overlayStyle={{ position: "fixed", top: 0 }}
        overlayInnerStyle={{
          width: "300px",
          height: "calc(100vh - 70px)",
        }}
        arrowPointAtCenter
        onOpenChange={handleVisible}
      >
        <Dropdown trigger={["click"]} menu={{ style: { top:"15px", padding: "10px", display: "flex" }, items }}>
          <Icons.AiOutlineSetting
            size={22}
            className="setting_icon"
            onClick={() => {
              // e.stopPropagation();
              setDropdownVisible(!dropdownVisible);
            }}
          />
        </Dropdown>
      </Popover>

      <OrganizationDrawer toggleDrawer={toggleDrawer} open={open} />
    </>
  );
};

export default Listx;
