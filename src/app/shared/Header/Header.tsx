/** @format */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@ant-design/pro-layout";
import { theme, Space, Input, Avatar, Dropdown, Typography, Select, AutoComplete } from "antd";
import Listx from "./List";
import { Icons, Spinner } from "../";
import { endpoints, routeNames } from "static";

import { BookLogo } from "assets/svg/Books_logo";
import { useAxios, useDefaultOrganization, usePermissions, useStore } from "app/Hooks";
import { getStringValueFromSS, ImagePath, removeKeyFromSS, setKeyInSS } from "utils";
import { RootState, useTypedDispatch, useTypedSelector } from "store";
import { currentUserRole } from "store/slices/authSlice";
import { HelpAndSupport } from "../HelpAndSupport";

const { useToken } = theme;
const { CURRENT_USER_ROLE } = endpoints;
const { ADD_ITEM, ADD_CUSTOMER, ADD_INVOICE, DASHBOARD } = routeNames;

export const Headers = ({ toggle }: { toggle: () => void }) => {
  const { Option } = Select;
  const { token } = useToken();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const { primary_organization } = useStore();
  const { checkPermission } = usePermissions();
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Separate state for input value

  const [customerName, setCustomerName] = useState<any>();
  const handleVisible = () => setVisible(false);
  const [modules, setModules] = useState<string[]>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const { organizations, current_User_Organization } = useDefaultOrganization();
  const { created_by_platform } = primary_organization;
  const { organization_id } = useTypedSelector((state: RootState) => state.authReducer || {});
  const { access_token = "" } = useStore();
  const { callAxios } = useAxios();
  const [value, setValue] = useState({
    path: "/items",
    search: "",
  });

  const current_organization = organizations?.find(
    (org) => org?.organization_id === organization_id
  );
  useEffect(() => {
    if (access_token) {
      callAxios({
        data: { accessToken: access_token },
        method: "post",
        url: `/auth/accessToken`,
      }).then((res) => {
        setCustomerName(res?.user);
      });
    }
  }, [access_token]);
  const showDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  useEffect(() => {
    if (import.meta.env.VITE_SSO_ENABLE === "true") {
      organization_id && dispatch(currentUserRole({ url: CURRENT_USER_ROLE }));
    }
  }, [organization_id]);

  useEffect(() => {
    setModules(
      current_User_Organization?.organizations?.module_permissions
        ?.filter((val) => val.status)
        .map((val) => val.slug)
    );
    //eslint-disable-next-line
  }, [current_User_Organization?.organizations?.module_permissions]);

  // const handleVisible = useCallback((show: boolean) => setVisible(show), []); // comment for disable setting tab in header
  const items: any["items"] = [
    {
      type: "group",
      label: "General",
      children: [
        {
          key: "1",
          disabled: !checkPermission("UserCreate").has_UserCreate_permission,
          label: "Invite Users",
          icon: <Icons.VscAdd />,
          onClick: () => {
            setKeyInSS("userModal", true);
            navigate("/users");
          },
          hide: true,
        },
        {
          key: "2",
          label: "Product & Services",
          icon: <Icons.VscAdd />,
          onClick: () => navigate(ADD_ITEM),
          hide: modules?.includes("item"),
          disabled: !checkPermission("ItemCreate").has_ItemCreate_permission,
        },
        {
          key: "3",
          label: "Chart of accounts",
          icon: <Icons.VscAdd />,
          onClick: () => {
            removeKeyFromSS("params");
            setKeyInSS("accountModal", true);
            navigate("/accounts");
          },
          hide: modules?.includes("accounts"),
          disabled: !checkPermission("AccountsCreate").has_AccountsCreate_permission,
        },
      ].filter((x) => x.hide),
    },
    {
      type: "group",
      label: "Sales",
      children: [
        {
          key: "4",
          label: "Customers",
          icon: <Icons.VscAdd />,
          onClick: () => navigate(ADD_CUSTOMER),
          hide: modules?.includes("contact"),
          disabled: !checkPermission("CustomerCreate").has_CustomerCreate_permission,
        },
        {
          key: "5",
          label: "Estimates",
          icon: <Icons.VscAdd />,
          onClick: () => navigate("/estimates-new"),
          hide: modules?.includes("estimates"),
          disabled: !checkPermission("EstimatesCreate").has_EstimatesCreate_permission,
        },
        {
          key: "6",
          label: "Invoices",
          icon: <Icons.VscAdd />,
          onClick: () => navigate(ADD_INVOICE),
          hide: modules?.includes("invoices"),
          disabled: !checkPermission("InvoiceCreate").has_InvoiceCreate_permission,
        },
        {
          key: "7",
          label: "Payment receipts",
          icon: <Icons.VscAdd />,
          onClick: () => navigate("/new-paymentreceived"),
          hide: modules?.includes("payment-received"),
          disabled: !checkPermission("InvoicePaymentRecordCreate")
            .has_InvoicePaymentRecordCreate_permission,
        },
      ].filter((x) => x.hide),
    },
    {
      type: "group",
      label: "Purchase",
      children: [
        {
          key: "8",
          label: "Suppliers",
          icon: <Icons.VscAdd />,
          onClick: () => navigate("/new-supplier"),
          hide: modules?.includes("contact"),
          disabled: !checkPermission("SupplierCreate").has_SupplierCreate_permission,
        },
        {
          key: "9",
          label: "Bills",
          icon: <Icons.VscAdd />,
          onClick: () => navigate("/new-bill"),
          hide: modules?.includes("bills"),
          disabled: !checkPermission("BillCreate").has_BillCreate_permission,
        },
      ].filter((x) => x.hide),
    },
  ];
  const selectBefore = (
    <Select
      defaultValue={value.path}
      className="remove-btn-highlight"
      popupClassName="tax_dropdown payment_receipt_dropdown"
      onChange={(val) => setValue({ ...value, path: val })}
      style={{ backgroundColor: token.colorPrimary }}
      suffixIcon={
        <img
          alt="icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
        />
      }
    >
      <Option key="items" value="/items">
        Products
      </Option>
      <Option key="customers" value="/customer">
        Customers
      </Option>
      <Option key="suppliers" value="/supplier">
        Suppliers
      </Option>
      <Option key="estimates" value="/estimate">
        Estimates
      </Option>
      <Option key="invoices" value="/invoice">
        Invoices
      </Option>
      <Option key="payment-recepits" value="/paymentsreceived">
        Payment receipts
      </Option>
      <Option key="credit-notes" value="/creditnotes">
        Credit Notes
      </Option>
      <Option key="bills" value="/bills">
        Bills
      </Option>
      <Option key="bills-payments" value="/bill-payments">
        Bills payments
      </Option>
      <Option key="chart-of-accounts" value="/accounts">
        Charts of accounts
      </Option>
    </Select>
  );
  const handleSearch = async () => {
    const dataFromLS: any = getStringValueFromSS("params");
    const params = {
      ...dataFromLS,
      search: value.search,
    };
    await setKeyInSS("params", params);
    navigate(`${value.path}?search=${value.search}`);
    setValue({ ...value, search: "" });
    setSearchValue("");
  };
  const handleChangesearch = async (inputData) => {
    setLoading(true);
    let urlData = value.path === "/customer" ? "/customers" : "/suppliers";
    if (value.path === "/customer" || value.path === "/supplier") {
      setValue({ ...value, search: inputData });
      setSearchValue(inputData);
      if (!inputData) {
        setOptions([]);
        return;
      }
      callAxios({
        url: `${urlData}?search=${inputData}&view=5`,
      }).then(async (res) => {
        const response = res.contacts?.map((contact) => ({
          value: contact?.display_name,
          id: contact?.id,
        }));
        setOptions(response || []);
      });
    } else {
      setOptions([]);
      setLoading(false);
    }
    setLoading(false);
  };
  const onSelect = async (selectedValue: string, option) => {
    if (option?.id) {
      const dataFromLS = getStringValueFromSS("params");
      const params = {
        //@ts-ignore
        ...dataFromLS,
        search: selectedValue,
      };
      await setKeyInSS("params", params);
      navigate(`${value.path}/${option?.id}`);
      setValue({ ...value, search: "" });
      setSearchValue("");
    }
  };
  return (
    <>
      <div className="main_header">
        <PageHeader
          className="header-area"
          title={
            <span onClick={() => navigate(DASHBOARD)} className="cursor">
              <BookLogo />
            </span>
          }
          tags={
            <Space>
              <Dropdown
                trigger={["click"]}
                menu={{ style: { padding: "10px", display: "flex" }, items }}
              >
                <Typography className="plus_icon border d-flex align-center">
                  <img
                    alt="plus icon"
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                  />
                </Typography>
              </Dropdown>
              <Space id="dropdown_box" className="header_search">
                {selectBefore}
                <AutoComplete
                  //@ts-ignore
                  popupMatchSelectWidth={252}
                  style={{ width: 420 }}
                  options={options}
                  onSelect={(value, option) => onSelect(value, option)}
                  onSearch={handleChangesearch}
                  onChange={setSearchValue}
                  value={searchValue}
                  size="large"
                  dropdownRender={(menus) => {
                    if (loading && options.length === 0) {
                      return (
                        <div style={{ width: "100%", textAlign: "center", height: "100px" }}>
                          <Spinner size={"50px"} />
                        </div>
                      );
                    }

                    if (!loading && options.length === 0) {
                      return <div style={{ padding: 10, textAlign: "center" }}>No data found</div>;
                    }

                    return menus;
                  }}
                >
                  <Input
                    size="large"
                    placeholder="Search here"
                    //@ts-ignore
                    enterButton
                    onPressEnter={handleSearch}
                    onChange={(e) => setValue({ ...value, search: e.target.value })}
                    suffix={
                      <img
                        alt="search==here"
                        onClick={handleSearch}
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/search.svg`}
                      />
                    }
                  />
                </AutoComplete>
              </Space>
            </Space>
          }
          extra={[
            <div className="d-flex align-center header-right" key="main-div">
              {/* <div
                key="notif"
                //onClick={toggle}
                className="header-right-icon d-flex border align-center cursor"
              >
                {
                  <img
                    className="hover-effect"
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/notification.svg`}
                    alt="notification--icon"
                  />
                }
              </div> */}
              <div style={{ marginRight: "10px", fontSize: "16px" }}>
                <span style={{ fontWeight: "bold" }}>{`Hello, `}</span>
                {`${customerName?.name ?? ""}`}
              </div>
              <div className="header-right-icon d-flex border align-center cursor">
                <Listx visible={visible} handleVisible={handleVisible} />
              </div>
              <div
                onClick={showDrawer}
                className="header-right-icon d-flex border align-center cursor"
              >
                <img
                  alt="help--icon"
                  style={{ width: 20 }}
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/help.svg`}
                />
              </div>
              <div
                key="link"
                onClick={toggle}
                id="captureClick" //when there is any other drawer open rather than main drawer
                className="header-right-img header-right-icon d-flex border align-center cursor"
              >
                <Avatar
                  key="2"
                  src={
                    <img
                      src={
                        current_organization?.organizations?.logo
                          ? ImagePath(
                              current_organization?.organizations?.logo as string,
                              created_by_platform
                            )
                          : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                              import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_SMALL_IMAGE
                            }`
                      }
                      alt="user--icon"
                    />
                  }
                />
              </div>
            </div>,
          ]}
        />
        <HelpAndSupport
          //@ts-ignore
          showDrawer={showDrawer}
          closeDrawer={closeDrawer}
          isDrawerOpen={isDrawerOpen}
        />
      </div>
    </>
  );
};
