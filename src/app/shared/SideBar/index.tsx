/** @format */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Divider, Layout, Menu, Skeleton } from "antd";
import { useAxios, useDefaultOrganization, useStore } from "app/Hooks";
import { routeNames, Labels, endpoints } from "static";
import { deleteKeyFromLS, getStringValueFromLS, setKeyInLS, setValueInLS } from "utils";
import { sidebarPosition, sidebarWidth } from "store/slices/sidebarSlice";
import { setDetails } from "store/slices/authSlice";
import { isEqual, isEmpty } from "lodash";
import { Icons, Toast } from "..";
import { useGetRolepermissionQuery } from "store/query/permissions";

const {} = Icons;
const { Sider } = Layout;
const { SubMenu, Item } = Menu;

export const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const { organization_id = "" } = useStore();
  const [loading, setLoading] = useState(true);
  const [arrow, setArrow] = useState(true);
  const [openKeys, setOpenKeys] = useState<any>([]);
  const [modules, setModules] = useState<string[]>();
  const [permissionTsst, setPermissiontoast] = useState();
  const { pathname = routeNames.DASHBOARD } = useLocation();
  const { current_User_Organization: { organizations: { module_permissions = [] } = {} } = {} } =
    useDefaultOrganization();
  const updatedPath = pathname.replace(/\/([a-zA-Z]+)\/[^\/]+$/, "/$1");
  const isDetailPage = getStringValueFromLS("once");
  const { data: { permissions = {} } = {} } = useGetRolepermissionQuery("", {
    skip: !organization_id,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (isEmpty(permissionTsst) && !isEmpty(permissions)) {
      setPermissiontoast(permissions);
    }
  }, [permissions]);

  useEffect(() => {
    if (permissionTsst && !isEmpty(permissions)) {
      const { areObjectsEqual } = checkChange(permissions, permissionTsst);
      if (!areObjectsEqual) {
        Toast({ message: "Permission updated", type: "info" });
        setPermissiontoast(permissions);
      }
    }
  }, [permissions]);

  useEffect(() => {
    // Set the loading state to false after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    // Cleanup the timeout if the component unmounts before the timeout completes
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to ensure it runs once on mount

  const checkChange = (obj1, obj2) => {
    const areObjectsEqual = isEqual(obj1, obj2);
    return { areObjectsEqual };
  };

  useEffect(() => {
    module_permissions?.length > 0 &&
      setModules(module_permissions.filter((val) => val.status).map((val) => val.slug));
    //eslint-disable-next-line
  }, [module_permissions]);

  useEffect(() => {
    setValueInLS("side_bar_open", arrow);
    if (!isDetailPage) {
      dispatch(sidebarPosition(arrow));
      dispatch(sidebarWidth(arrow ? 240 : 60));
    }
    //eslint-disable-next-line
  }, [arrow]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleClick = (path: { key: any }) => {
    deleteKeyFromLS("id");
    deleteKeyFromLS("once");
    deleteKeyFromLS("obj");
    deleteKeyFromLS("params");
    setKeyInLS("route", path.key);
    if (search && pathname == path.key) {
      navigate(pathname, { replace: true });
    }
    //@ts-ignore
    if (!path.keyPath.includes("settings")) {
      setOpenKeys([]);
    }
    sessionStorage.clear();
    if (path.key === "/preferences") {
      callAxios({
        url: endpoints.USER_PROFILE,
      }).then((res) => {
        dispatch(setDetails(res));
      });
    }
  };
  // const handleRoutes = (route) => {
  //   if (route === pathname) return;
  //   navigate(route, { state: { pathname: route } });
  // };

  const SkeletonComponent = () => {
    return (
      <div
        style={{ display: "flex", alignItems: "center", marginTop: "25px", marginBottom: "25px" }}
      >
        {" "}
        &nbsp; &nbsp; &nbsp;
        <Skeleton.Avatar size="small" shape="circle" />
        &nbsp;
        <Skeleton active title={false} paragraph={{ rows: 1, width: "150px" }} />
      </div>
    );
  };
  return (
    <div className="left-side-bar">
      <Sider
        collapsible
        trigger={
          arrow ? (
            <img
              src={`${
                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
              }/static/media/sidenav_collapse.svg`}
              alt="icon"
              style={{ width: 14 }}
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sidenav_expand.svg`}
              alt="icon"
              style={{ width: 14 }}
            />
          )
        }
        onCollapse={() => setArrow(!arrow)}
        collapsedWidth={54}
        width={240}
        className={`sidebar_main ${arrow ? "xyz" : "default"}`}
        id="sodebar-compp"
      >
        {/* <div className="logo" /> */}
        <Menu
          inlineIndent={14}
          className="main-menu"
          mode="inline"
          defaultOpenKeys={[]}
          selectedKeys={[updatedPath]}
          onClick={handleClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {loading ? (
            <SkeletonComponent />
          ) : (
            <Item
              className="menu-item"
              key={routeNames.DASHBOARD}
              icon={
                <div>
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dashboard.svg`}
                  />
                </div>
              }
            >
              <Link
                style={{ pointerEvents: pathname === routeNames.DASHBOARD ? "none" : "auto" }}
                to={pathname === routeNames.DASHBOARD ? "" : routeNames.DASHBOARD}
                state={{ path: { pathname } }}
              >
                Dashboard
              </Link>
            </Item>
          )}
          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("item") ? (
            <>
              <Divider />
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_ITEM
                    ? routeNames.ADD_ITEM
                    : pathname === routeNames.Categories
                    ? routeNames.Categories
                    : pathname === routeNames.EDIT_ITEM
                    ? routeNames.EDIT_ITEM
                    : pathname === routeNames.ITEM_CLONE
                    ? routeNames.ITEMS
                    : routeNames.ITEMS
                }
                icon={
                  <div>
                    <img
                      className="scale_x"
                      alt=""
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/products-services.svg`}
                    />
                  </div>
                }
              >
                <Link
                  to={routeNames.ITEMS}
                  state={{ path: { pathname } }}
                  style={{
                    pointerEvents:
                      pathname === routeNames.ITEMS || pathname === routeNames.Categories
                        ? "none"
                        : "auto",
                  }}
                >
                  {Labels.PRODUCTS_SERVICES}
                </Link>
              </Item>
            </>
          ) : undefined}
          {/* <Item key="price-list">Price Lists</Item> */}

          {/* <SubMenu
            key="sales"
            className="sub-menu"
            icon={
              <div>
                <img
                  alt=""
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sales.svg`}
                />
              </div>
            }
            title="Sale"
          > */}
          {/* {module_permissions.map((val) => (
            <Fragment key={val.id}> */}

          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("contact") ? (
            <>
              <Divider />
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_CUSTOMER
                    ? routeNames.ADD_CUSTOMER
                    : pathname === routeNames.EDIT_CUSTOMER
                    ? routeNames.EDIT_CUSTOMER
                    : pathname === routeNames.CUSTOMER_CLONE
                    ? routeNames.CUSTOMERS
                    : routeNames.CUSTOMERS
                }
                icon={
                  <div>
                    <img
                      alt=""
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/customers_or_suppliers.svg`}
                    />
                  </div>
                }
              >
                <Link
                  to={routeNames.CUSTOMERS}
                  state={{ path: { pathname } }}
                  style={{ pointerEvents: pathname === routeNames.CUSTOMERS ? "none" : "auto" }}
                >
                  {Labels._CUSTOMERS}
                </Link>
              </Item>
              {modules?.includes("contact") ? (
                <>
                  <Item
                    className="menu-item"
                    key={
                      pathname === routeNames.ADD_SUPPLIER
                        ? routeNames.ADD_SUPPLIER
                        : pathname === routeNames.EDIT_SUPPLIER
                        ? routeNames.EDIT_SUPPLIER
                        : pathname === routeNames.SUPPLIER_CLONE
                        ? routeNames.SUPPLIERS
                        : routeNames.SUPPLIERS
                    }
                    icon={
                      <div>
                        <img
                          alt=""
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/customers_or_suppliers.svg`}
                        />
                      </div>
                    }
                  >
                    <Link
                      to={routeNames.SUPPLIERS}
                      state={{ path: { pathname } }}
                      style={{ pointerEvents: pathname === routeNames.SUPPLIERS ? "none" : "auto" }}
                    >
                      Suppliers
                    </Link>
                  </Item>
                  {(modules?.includes("estimates") ||
                    modules?.includes("invoices") ||
                    modules?.includes("payment-received") ||
                    modules?.includes("credit-notes")) && <Divider />}
                </>
              ) : undefined}

              {modules?.includes("estimates") ? (
                <Item
                  className="menu-item"
                  key={
                    pathname === routeNames.ADD_ESTIMATE
                      ? routeNames.ADD_ESTIMATE
                      : pathname === routeNames.EDIT_ESTIMATE
                      ? routeNames.EDIT_ESTIMATE
                      : pathname === routeNames.ESTIMATES_ClONE
                      ? routeNames.ESTIMATES
                      : routeNames.ESTIMATES
                  }
                  icon={
                    <div>
                      <img
                        className="scale_x"
                        alt=""
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/estimates.svg`}
                      />
                    </div>
                  }
                >
                  <Link
                    to={routeNames.ESTIMATES}
                    state={{ path: { pathname } }}
                    style={{ pointerEvents: pathname === routeNames.ESTIMATES ? "none" : "auto" }}
                  >
                    {Labels._ESTIMATES}
                  </Link>
                </Item>
              ) : undefined}
            </>
          ) : undefined}
          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("invoices") ? (
            <Item
              className="menu-item"
              key={
                pathname === routeNames.ADD_INVOICE
                  ? routeNames.ADD_INVOICE
                  : pathname === routeNames.EDIT_INVOICE
                  ? routeNames.EDIT_INVOICE
                  : pathname === routeNames.INVOICE_ClONE
                  ? routeNames.INVOICES
                  : routeNames.INVOICES
              }
              icon={
                <div>
                  <img
                    className="scale_x"
                    alt=""
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/invoices.svg`}
                  />
                </div>
              }
            >
              <Link
                to={routeNames.INVOICES}
                state={{ path: { pathname } }}
                style={{ pointerEvents: pathname === routeNames.INVOICES ? "none" : "auto" }}
              >
                {Labels._INVOICES}
              </Link>
            </Item>
          ) : undefined}
          {/* {modules?.includes("recurring-invoices") ? ( */}
          {/* <Item
            className="menu-item"
            key={
              pathname === routeNames.ADD_RECURRING_INVOICES
                ? routeNames.ADD_RECURRING_INVOICES
                : pathname === routeNames.EDIT_RECURRING_INVOICES
                ? routeNames.EDIT_RECURRING_INVOICES
                : routeNames.RECURRING_INVOICES
            }
            icon={
              <div>
                <img
                  alt=""
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/products.svg`}
                />
              </div>
            }
          >
            <Link
              to={routeNames.RECURRING_INVOICES}
              state={{ path: { pathname } }}
              style={{
                pointerEvents: pathname === routeNames.RECURRING_INVOICES ? "none" : "auto",
              }}
            >
              {`${Labels.RECURRING}  ${Labels._INVOICES}`}
            </Link>
          </Item> */}
          {/* ) : undefined} */}
          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("payment-received") ? (
            <>
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_PAYMENTS_RECEIVED
                    ? routeNames.ADD_PAYMENTS_RECEIVED
                    : pathname === routeNames.EDIT_PAYMENTS_RECEIVED
                    ? routeNames.EDIT_PAYMENTS_RECEIVED
                    : routeNames.PAYMENTS_RECEIVED
                }
                icon={
                  <div>
                    <img
                      className="scale_x"
                      alt=""
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/payment-receipts.svg`}
                    />
                  </div>
                }
              >
                <Link
                  to={routeNames.PAYMENTS_RECEIVED}
                  state={{ path: { pathname } }}
                  style={{
                    pointerEvents: pathname === routeNames.PAYMENTS_RECEIVED ? "none" : "auto",
                  }}
                >
                  Payment receipts
                </Link>
              </Item>
            </>
          ) : undefined}
          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("credit-notes") ? (
            <Item
              key={
                pathname === routeNames.CREDIT_NOTES
                  ? routeNames.CREDIT_NOTES
                  : pathname === routeNames.EDIT_CREDIT_NOTE
                  ? routeNames.EDIT_CREDIT_NOTE
                  : pathname === routeNames.ADD_CREDIT_NOTE
                  ? routeNames.ADD_CREDIT_NOTE
                  : routeNames.CREDIT_NOTES
              }
              className="menu-item"
              icon={
                <div>
                  <img
                    className="scale_x"
                    alt=""
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/credit-notes.svg`}
                  />
                </div>
              }
            >
              <Link
                to={routeNames.CREDIT_NOTES}
                state={{ path: { pathname } }}
                style={{ pointerEvents: pathname === routeNames.CREDIT_NOTES ? "none" : "auto" }}
              >
                Credit notes
              </Link>
            </Item>
          ) : undefined}

          {/* {modules?.includes("sales-order") ? ( */}
          {/* <Item
            className="menu-item"
            key={
              pathname === routeNames.ADD_SALES_ORDER
                ? routeNames.ADD_SALES_ORDER
                : pathname === routeNames.EDIT_SALES_ORDER
                ? routeNames.EDIT_SALES_ORDER
                : routeNames.SALES_ORDERS
            }
            style={{ cursor: "not-allowed" }}
            icon={
              <div>
                <img
                  alt=""
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/products.svg`}
                />
              </div>
            }
          >
            {/* When sale order complete then un comment link tag code and delete div of sale order */}

          {/* <Link
                  to={routeNames.SALES_ORDERS}
                  state={{ path: { pathname } }}
                  style={{ pointerEvents: pathname === routeNames.SALES_ORDERS ? "none" : "auto" }}
                >
                  {Labels.SALES_ORDER}
                </Link> 
            <div
              // to={routeNames.SALES_ORDERS}
              // state={{ path: { pathname } }}
              style={{
                pointerEvents: pathname === routeNames.SALES_ORDERS ? "none" : "auto",
                cursor: "not-allowed",
              }}
            >
              {Labels.SALES_ORDER}
            </div>
          </Item> */}
          {/* ) : undefined} */}

          {/* {modules?.includes("contact") ? ( */}
          {modules?.includes("bills") || (modules?.includes("bill-payments") && <Divider />)}
          {/* ) : undefined} */}
          {/* </Fragment>
          ))} */}
          {/* </SubMenu> */}

          {/* <SubMenu
            key="purchases"
            className="sub-menu"
            icon={
              <div>
                <img
                  alt=""
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sales.svg`}
                />
              </div>
            }
            title="Purchases"
          >
            {modules?.includes("purchase-order") ? (
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_PURCHASE_ORDER
                    ? routeNames.ADD_PURCHASE_ORDER
                    : pathname === routeNames.EDIT_PURCHASE_ORDER
                    ? routeNames.EDIT_PURCHASE_ORDER
                    : routeNames.PURCHASE_ORDERS
                }
                style={{ cursor: "not-allowed" }}
              >
                {/* When sale order complete then un comment link tag code and delete div of purchase order */}

          {/* <Link
                  to={routeNames.PURCHASE_ORDERS}
                  state={{ path: { pathname } }}
                  style={{
                    pointerEvents: pathname === routeNames.PURCHASE_ORDERS ? "none" : "auto",
                  }}
                >
                  Puchase Orders
                </Link> 

                <div
                  // to={routeNames.PURCHASE_ORDERS}
                  // state={{ path: { pathname } }}
                  style={{
                    pointerEvents: pathname === routeNames.PURCHASE_ORDERS ? "none" : "auto",
                    cursor: "not-allowed",
                  }}
                >
                  Puchase Orders
                </div>
              </Item>
            ) : undefined}
            {/* When sale order complete then un comment link tag code and delete div of Bills */}

          {/* this module will remain hide when code merge in uat  */}
          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("bills") ? (
            <>
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_BILLS
                    ? routeNames.ADD_BILLS
                    : pathname === routeNames.EDIT_BILLS
                    ? routeNames.EDIT_BILLS
                    : pathname === routeNames.CLONE_BILLS
                    ? routeNames.CLONE_BILLS
                    : routeNames.BILLS
                }
                icon={
                  <div>
                    <img
                      className="scale_x"
                      alt=""
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/bills.svg`}
                    />
                  </div>
                }
              >
                <Link
                  to={routeNames.BILLS}
                  state={{ path: { pathname } }}
                  style={{ pointerEvents: pathname === routeNames.BILLS ? "none" : "auto" }}
                >
                  {Labels.BILLS}
                </Link>
              </Item>
              {/* <Divider /> */}
            </>
          ) : undefined}
          {/* 
          {true ? (
            <Item
              className="menu-item"
              key={
                pathname === routeNames.BILL_PAYMENTS
                  ? routeNames.BILL_PAYMENTS
                  : pathname === routeNames.BILL_PAYMENTS
                  ? routeNames.BILL_PAYMENTS
                  : routeNames.BILL_PAYMENTS
              }
              icon={
                <div>
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/estimates.svg`}
                  />
                </div>
              }

              // style={{ cursor: "not-allowed" }}
            >
              <Link
                to={routeNames.BILL_PAYMENTS}
                state={{ path: { pathname } }}
                style={{ pointerEvents: pathname === routeNames.BILL_PAYMENTS ? "none" : "auto" }}
              >
                {Labels.BILL_PAYMENTS}
              </Link>
            </Item>
          ) : undefined}
          <Divider />

          {/* 
            {modules?.includes("recurring-bills") ? (
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_RECURRING_BILL
                    ? routeNames.ADD_RECURRING_BILL
                    : pathname === routeNames.EDIT_RECURRING_BILL
                    ? routeNames.EDIT_RECURRING_BILL
                    : routeNames.RECURRING_BILLS
                }
              >
                <Link
                  to={routeNames.RECURRING_BILLS}
                  state={{ path: { pathname } }}
                  style={{
                    pointerEvents: pathname === routeNames.RECURRING_BILLS ? "none" : "auto",
                  }}
                >
                  {Labels.RECURRING_BILLS}
                </Link>
              </Item>
            ) : undefined}
            {modules?.includes("contact") ? (
              <Item
                className="menu-item"
                key={
                  pathname === routeNames.ADD_SUPPLIER
                    ? routeNames.ADD_SUPPLIER
                    : pathname === routeNames.EDIT_SUPPLIER
                    ? routeNames.EDIT_SUPPLIER
                    : routeNames.SUPPLIERS
                }
              >
                <Link
                  to={routeNames.SUPPLIERS}
                  state={{ path: { pathname } }}
                  style={{ pointerEvents: pathname === routeNames.SUPPLIERS ? "none" : "auto" }}
                >
                  Suppliers
                </Link>
              </Item>
            ) : undefined} */}
          {/* <Item key={routeNames.PACKAGES}>
            <Link to={routeNames.PACKAGES} state={{ path: { pathname } }}>
              {Labels._PACKAGES}
            </Link>
          </Item> 
          </SubMenu> */}

          {/* <Item
            className="menu-item"
            key={Labels._TAXES}
            icon={
              <div>
                <img
                  alt=""
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/ledger.svg`}
                />
              </div>
            }
          >
            <Link
              to={`${routeNames.TAX}?tab=1`}
              style={{
                pointerEvents: `${routeNames.TAX}?tab=1`.includes(pathname) ? "none" : "auto",
              }}
            >
              Tax Management
            </Link>
          </Item> */}

          {loading ? (
            <SkeletonComponent />
          ) : modules?.includes("bill-payments") ? (
            <Item
              className="menu-item"
              key={
                pathname === routeNames.BILL_PAYMENTS
                  ? routeNames.BILL_PAYMENTS
                  : pathname === routeNames.BILL_PAYMENTS
                  ? routeNames.BILL_PAYMENTS
                  : routeNames.BILL_PAYMENTS
              }
              icon={
                <div>
                  <img
                    className="scale_x"
                    alt=""
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/bill-payment.svg`}
                  />
                </div>
              }

              // style={{ cursor: "not-allowed" }}
            >
              <Link
                to={routeNames.BILL_PAYMENTS}
                state={{ path: { pathname } }}
                style={{ pointerEvents: pathname === routeNames.BILL_PAYMENTS ? "none" : "auto" }}
              >
                {Labels.BILL_PAYMENTS}
              </Link>
            </Item>
          ) : undefined}
          {import.meta.env.VITE_SHOW_EXPENSE === "true" &&
            (loading ? (
              <SkeletonComponent />
            ) : (
              <Item
                className="menu-item"
                icon={
                  <div>
                    <img
                      alt=""
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/customers_or_suppliers.svg`}
                    />
                  </div>
                }
                key={
                  pathname === routeNames.ADD_EXPENSE
                    ? routeNames.ADD_EXPENSE
                    : pathname === routeNames.EDIT_EXPENSE
                    ? routeNames.EDIT_EXPENSE
                    : routeNames.EXPENSE
                }
              >
                <Link
                  to={routeNames.EXPENSE}
                  state={{ path: { pathname } }}
                  style={{ pointerEvents: pathname === routeNames.EXPENSE ? "none" : "auto" }}
                >
                  {Labels.EXPENSE}
                </Link>
              </Item>
            ))}
          <Divider />
          {import.meta.env.VITE_ADD_ACCOUNTS === "true" && loading ? (
            <SkeletonComponent />
          ) : modules?.includes("accounts") ? (
            <Item
              className="menu-item"
              key={routeNames.ACCOUNTS}
              icon={
                <div>
                  <img
                    className="scale_x"
                    alt=""
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/chart-of-accounts.svg`}
                  />
                </div>
              }

              // style={{ cursor: "not-allowed" }}
            >
              <Link
                to={routeNames.ACCOUNTS}
                state={{ path: { pathname } }}
                style={{ pointerEvents: pathname === routeNames.ACCOUNTS ? "none" : "auto" }}
              >
                {Labels.CHART_OF_ACCOUNTS}
              </Link>
            </Item>
          ) : undefined}
          {import.meta.env.VITE_ADD_ACCOUNTS === "true" &&
            (loading ? (
              <SkeletonComponent />
            ) : (
              <>
                <Item
                  className="menu-item"
                  key={routeNames.JOURNAL}
                  icon={
                    <div>
                      <img
                        className="scale_x"
                        alt=""
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/journal.svg`}
                      />
                    </div>
                  }

                  // style={{ cursor: "not-allowed" }}
                >
                  <Link
                    to={routeNames.JOURNAL}
                    state={{ path: { pathname } }}
                    style={{ pointerEvents: pathname === routeNames.JOURNAL ? "none" : "auto" }}
                  >
                    Journal
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={routeNames.LEDGER}
                  icon={
                    <div>
                      <img
                        className="scale_x"
                        alt=""
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/ledger.svg`}
                      />
                    </div>
                  }

                  // style={{ cursor: "not-allowed" }}
                >
                  <Link
                    to={routeNames.LEDGER}
                    state={{ path: { pathname } }}
                    style={{ pointerEvents: pathname === routeNames.LEDGER ? "none" : "auto" }}
                  >
                    Ledger
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={routeNames.TRIAL_BALANCE}
                  icon={
                    <div>
                      <img
                        className="scale_x"
                        alt=""
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/trial-balance.svg`}
                      />
                    </div>
                  }

                  // style={{ cursor: "not-allowed" }}
                >
                  <Link
                    to={routeNames.TRIAL_BALANCE}
                    state={{ path: { pathname } }}
                    style={{
                      pointerEvents: pathname === routeNames.TRIAL_BALANCE ? "none" : "auto",
                    }}
                  >
                    Trial Balance
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={
                    pathname === routeNames.REPORTS
                      ? routeNames.REPORTS
                      : pathname.includes("/reports")
                      ? routeNames.REPORTS
                      : routeNames.REPORTS
                  }
                  icon={
                    <div>
                      <img
                        className="scale_x"
                        alt=""
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/financial-reports.svg`}
                      />
                    </div>
                  }

                  // style={{ cursor: "not-allowed" }}
                >
                  <Link
                    to={routeNames.REPORTS}
                    state={{ path: { pathname } }}
                    style={{ pointerEvents: pathname === routeNames.REPORTS ? "none" : "auto" }}
                  >
                    Reports
                  </Link>
                </Item>
                <Divider />
              </>
            ))}

          {loading ? (
            <SkeletonComponent />
          ) : (
            <>
              <SubMenu
                className="sub-menu"
                key="settings"
                icon={
                  <div>
                    <img
                      alt=""
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/settings.svg`}
                    />
                  </div>
                }
                title="Settings"
              >
                <Item
                  key={
                    pathname === routeNames.ORGANIZATION_CREATE
                      ? routeNames.ORGANIZATION_CREATE
                      : pathname === routeNames.ORGANIZATION_DETAIL
                      ? routeNames.ORGANIZATION_DETAIL
                      : pathname === routeNames.ORGANIZATION_PROFILE
                      ? routeNames.ORGANIZATION_PROFILE
                      : routeNames.ORGANIZATION_LISTING
                  }
                  className="menu-item"
                >
                  <Link
                    to={routeNames.ORGANIZATION_LISTING}
                    state={{ path: { pathname } }}
                    style={{
                      pointerEvents: pathname === routeNames.ORGANIZATION_LISTING ? "none" : "auto",
                    }}
                  >
                    {Labels.MANAGE_BUSINESSES}
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={
                    pathname === routeNames.ADD_ROLE
                      ? routeNames.ADD_ROLE
                      : pathname === routeNames.EDIT_ROLE
                      ? routeNames.EDIT_ROLE
                      : routeNames.USERS
                  } //icon={<Icons.AiOutlineUsergroupAdd size={18} />}
                >
                  <Link
                    to={`${routeNames.USERS}?tab=1`}
                    style={{
                      pointerEvents: `${routeNames.USERS}?tab=1`.includes(pathname)
                        ? "none"
                        : "auto",
                    }}
                  >
                    {Labels.USERS_ROLES}
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={routeNames.PREFERENCES} //icon={<Icons.FaWarehouse />}
                >
                  <Link
                    to={`${routeNames.PREFERENCES}?tab=1`}
                    style={{
                      pointerEvents: `${routeNames.PREFERENCES}?tab=1`.includes(pathname)
                        ? "none"
                        : "auto",
                    }}
                  >
                    Preferences
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={routeNames.TABLE_PREFERENCES} //icon={<Icons.FaWarehouse />}
                >
                  <Link
                    to={`${routeNames.TABLE_PREFERENCES}?tab=1`}
                    style={{
                      pointerEvents: `${routeNames.TABLE_PREFERENCES}?tab=1`.includes(pathname)
                        ? "none"
                        : "auto",
                    }}
                  >
                    Table Preferences
                  </Link>
                </Item>
                <Item
                  className="menu-item"
                  key={routeNames.PDF_PREFERENCES} //icon={<Icons.FaWarehouse />}
                >
                  <Link
                    to={`${routeNames.PDF_PREFERENCES}`}
                    style={{
                      pointerEvents: `${routeNames.PDF_PREFERENCES}`.includes(pathname)
                        ? "none"
                        : "auto",
                    }}
                  >
                    PDF Preferences
                  </Link>
                </Item>
                {/* <Item key="price-list">Price Lists</Item> */}
              </SubMenu>
            </>
          )}
        </Menu>
      </Sider>
    </div>
  );
};
