/** @format */

import { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { BarChartX } from "./BarChart";
import { SpinnerX } from "app/shared/PageLoader";
import { Payables } from "./dashboardStats/Payables";
import InitialDashboardScreen from "./onBoardingScreen";
import { OrderDetail } from "./dashboardStats/OrderDetail";
import { Receivables } from "./dashboardStats/Receivables";
import { TopCustomer } from "./dashboardStats/TopCustomers";
import { OrderSummary } from "./dashboardStats/OrderSummary";
import { useAxios, usePermissions, useStore } from "app/Hooks";
import { AccessDenied, PageHeaderX, Spinner } from "app/shared";
import { TopSellingItems } from "./dashboardStats/TopSellingItems";
import { SaleInformation } from "./dashboardStats/SalesInformation";
import { PurchaseInformation } from "./dashboardStats/PurchaseInformation";
import { useGetRolepermissionQuery } from "store/query/permissions";

const Dashboard = () => {
  const { callAxios } = useAxios();
  const [loading, setLoading] = useState(true);
  const { current_organization_id } = useStore();
  const [preferences, setPreferences] = useState<any>();
  const { checkPermission, fetchingRoles } = usePermissions();
  const [showOnBoardingScreen, setShowOnBordingScreen] = useState(false);
  const [customloading, setCustomLoading] = useState(false);
  const { refetch } = useGetRolepermissionQuery("", {
    skip: !current_organization_id,
    refetchOnFocus: true,
  });
  const { has_DashboardPayableView_permission } = checkPermission("DashboardPayableView");
  const { has_DashboardReceivablesView_permission } = checkPermission("DashboardReceivablesView");
  const { has_DashboardTopCustomersView_permission } = checkPermission("DashboardTopCustomersView");
  const { has_DashboardOrderDetailsView_permission } = checkPermission("DashboardOrderDetailsView");
  const { has_DashboardEstimateInformationView_permission } = checkPermission(
    "DashboardEstimateInformationView"
  );
  const { has_DashboardTopSellingItemsView_permission } = checkPermission(
    "DashboardTopSellingItemsView"
  );
  const { has_DashboardSalesVsPurchaseView_permission } = checkPermission(
    "DashboardSalesVsPurchaseView"
  );
  const { has_DashboardEstimateSummaryView_permission } = checkPermission(
    "DashboardEstimateSummaryView"
  );
  const { has_DashboardPurchaseInformationView_permission } = checkPermission(
    "DashboardPurchaseInformationView"
  );
  useEffect(() => {
    setCustomLoading(true);
    const prev_org_id = localStorage.getItem("prev_org_id");

    //@ts-ignore
    if (prev_org_id && Number(prev_org_id) !== current_organization_id) {
      refetch();
      setTimeout(() => {
        setCustomLoading(false);
      }, 500);
    } else {
      setTimeout(() => {
        setCustomLoading(false);
      }, 500);
    }
  }, [current_organization_id]);
  // const { organization_id, users_organizations } = useStore();

  // useLayoutEffect(() => {
  //   if (!organization_id && !users_organizations.length) navigate(routeNames.REGISTER_ORGANIZATION);
  //   //eslint-disable-next-line
  // }, [organization_id, users_organizations]);

  const mycustomstyle = { height: "317px", width: "auto" };

  useEffect(() => {
    if (current_organization_id) {
      callAxios({ url: `organizations/${current_organization_id}` }).then((res) => {
        if (res.has_contacts || res.has_items) {
          setShowOnBordingScreen(false);
          setLoading(false);
          window.scrollTo(0, 0);
        } else {
          setLoading(false);
          setShowOnBordingScreen(true);
        }
      });
    }
  }, [current_organization_id]);

  useEffect(() => {
    if (
      import.meta.env.VITE_SHOW_OLD_DASHBOARD === "false" &&
      current_organization_id
      // has_DashboardPreferenceView_permission
    ) {
      callAxios({
        url: "/dashboard/preferences",
      }).then((res) => {
        setPreferences(res.preferences);
      });
    }
    //eslint-disable-next-line
  }, []);

  if (fetchingRoles) return <SpinnerX />;
  if (customloading) return <SpinnerX />;

  if (
    !customloading &&
    !has_DashboardEstimateInformationView_permission &&
    !has_DashboardPurchaseInformationView_permission &&
    !has_DashboardReceivablesView_permission &&
    !has_DashboardPayableView_permission &&
    !has_DashboardTopSellingItemsView_permission &&
    !has_DashboardTopCustomersView_permission &&
    !has_DashboardOrderDetailsView_permission &&
    !has_DashboardSalesVsPurchaseView_permission &&
    !has_DashboardEstimateSummaryView_permission
  ) {
    return <AccessDenied />;
  }
  return (
    !customloading && (
      <>
        <PageHeaderX.SubHeader enabled={false} title={"Dashboard"} btnText={""} navigateTo={""} />

        <div className={`dashboard--charts ${showOnBoardingScreen ? "initial-screen" : ""}`}>
          {import.meta.env.VITE_SHOW_OLD_DASHBOARD === "true" ? (
            <img src="https://res.cloudinary.com/dbsgzu3go/image/upload/v1717051874/wggflprytkzxivb0sbzg.png" />
          ) : (
            <>
              {loading ? (
                <Spinner directionSize="85.2vh" />
              ) : (
                <>
                  {showOnBoardingScreen ? (
                    <InitialDashboardScreen />
                  ) : (
                    <>
                      <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
                        <Col span={12} xl={12} lg={12} md={24} sm={24}>
                          {has_DashboardEstimateInformationView_permission ? (
                            <SaleInformation preferences={preferences?.sales_information} />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={mycustomstyle} />
                            </Card>
                          )}
                        </Col>
                        <Col span={12} xl={12} lg={12} md={24} sm={24}>
                          {has_DashboardPurchaseInformationView_permission ? (
                            <PurchaseInformation preferences={preferences} />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={mycustomstyle} />
                            </Card>
                          )}
                        </Col>
                      </Row>
                      <Row
                        className="receivable_container"
                        gutter={[10, 10]}
                        style={{ marginBottom: 10 }}
                      >
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                          {has_DashboardReceivablesView_permission ? (
                            <Receivables preferences={preferences?.receivables} />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={mycustomstyle} />
                            </Card>
                          )}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                          {has_DashboardPayableView_permission ? (
                            <Payables preferences={preferences?.payable} />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={mycustomstyle} />
                            </Card>
                          )}
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          xxl={8}
                          className="top-selling--main"
                        >
                          {has_DashboardTopSellingItemsView_permission ? (
                            <TopSellingItems preferences={preferences} />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={mycustomstyle} />
                            </Card>
                          )}
                        </Col>
                      </Row>
                      <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
                        <Col span={16} xl={16} lg={12} md={24} sm={24} xs={24}>
                          {has_DashboardOrderDetailsView_permission ? (
                            <OrderDetail />
                          ) : (
                            <Card className="card-layout">
                              <AccessDenied style={{ ...mycustomstyle, height: "630px" }} />
                            </Card>
                          )}
                        </Col>
                        <Col span={8} xl={8} lg={12} md={24} sm={24} xs={24}>
                          <Row gutter={[10, 0]}>
                            <Col span={24} xl={24} xs={24} sm={24} md={24}>
                              {has_DashboardTopCustomersView_permission ? (
                                <TopCustomer preferences={preferences} />
                              ) : (
                                <Card className="card-layout">
                                  <AccessDenied style={mycustomstyle} />
                                </Card>
                              )}
                            </Col>
                            <Col span={24} xl={24} xs={24} sm={24} md={24}>
                              {has_DashboardSalesVsPurchaseView_permission ? (
                                <BarChartX preferences={preferences} />
                              ) : (
                                <Card className="card-layout">
                                  <AccessDenied style={mycustomstyle} />
                                </Card>
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {has_DashboardEstimateSummaryView_permission ? (
                        <OrderSummary preferences={preferences} />
                      ) : (
                        <Card className="card-layout">
                          <AccessDenied style={mycustomstyle} />
                        </Card>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </>
    )
  );
};
export default Dashboard;
