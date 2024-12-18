/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import DetailPage from "./DetailPage";
import { BillListing } from "./Listing";
import { SubHeader } from "./SubHeader";
import { BillDataSourceProps } from "./Types";
import { endpoints, routeNames } from "static";
import { setSessionAndLocalObj } from "utils";
import { SpinnerX } from "app/shared/PageLoader";
import { Onboarding } from "app/shared/OnBoarding";
import { useGetBillsListingQuery } from "store/query/bills";
import { BillFlowDiagram, BillIconListing } from "assets/svg";
import { AccessDenied, ErrorFallback, SearchAlert, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { BILLS } = endpoints;
const { EDIT_BILLS } = routeNames;

const Bills = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_BillView_permission } = checkPermission("BillView");
  const { status = true } = getCurrentModule("bills") || {};
  const {
    detail,
    setbool,
    setDetail,
    fullScreen,
    bool: loading,
    handleFullScreen,
    memoizeHandleClick,
  } = useDetailPage();
  const sidebarPosition = useSelector((state: any) => state.sidebarReducer);
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("bills");
  const { data, refetch, isFetching } = useGetBillsListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_BillView_permission || !status,
    }
  );

  const handleClick = (data: BillDataSourceProps) => {
    setSessionAndLocalObj(data?.id, true, "bills");
    navigate(`${EDIT_BILLS}?id=${data.id}`);
  };
  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        BILLS,
        refetch,
        data?.bills?.data as any,
        "/bills",
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.bills?.data, handlePagination, detail]
  );
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <SearchAlert description={["Bill No.", "Order No.", "Supplier Name"]} />
      {!status ? (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_BillView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {customLoading || bool || isFetching ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {data?.bills?.data && (
                    <div
                      className="product_detail_listing"
                      style={{
                        animation: "fadeInLeft",
                        animationDuration: "0.3s",
                      }}
                    >
                      <>
                        {!fullScreen && (
                          <SubHeader
                            enable={!status}
                            noData={(data?.bills?.data.length as any) > 0 ? false : true}
                          />
                        )}
                        <div className={fullScreen ? "scrollbar_container" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {
                                //@ts-ignore
                                data?.bills?.data && (
                                  <BillListing
                                    Prev={Prev}
                                    Next={Next}
                                    listing={data}
                                    status={status}
                                    refetch={refetch}
                                    loading={isFetching}
                                    pagination={paginate}
                                    handlePage={handlePage}
                                    showDetail={fullScreen}
                                    handleClick={memoizeClick}
                                    setparam={handlePagination}
                                    handleRowSize={handleRowSize}
                                    handleConfirm={memoizeConfirm}
                                    sidebarPosition={sidebarPosition}
                                    setcustomLoading={setcustomLoading}
                                    handleFullScreen={handleFullScreen}
                                    handleViewClick={memoizeHandleClick}
                                    base_currency={data?.bills?.data[0]?.currency}
                                  />
                                )
                              }
                            </div>
                          )}
                          {fullScreen && (
                            <>
                              <div className="content_side __item--conent-side __items--details bill_detail">
                                {data?.bills && (
                                  <ErrorBoundary
                                    FallbackComponent={ErrorFallback}
                                    onReset={() => null}
                                  >
                                    <DetailPage
                                      detail={detail}
                                      loading={loading}
                                      setFalse={setbool}
                                      refetchBills={refetch}
                                      data={data?.bills?.data}
                                      setparam={handlePagination}
                                      handleConfirm={memoizeConfirm}
                                      handleFullScreen={handleFullScreen}
                                    />
                                  </ErrorBoundary>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    </div>
                  )}
                </>
              ) : (
                <Onboarding
                  name="Bills"
                  videoFrame={
                    <iframe
                      width="700"
                      height="400"
                      frameBorder="0"
                      allowFullScreen
                      title="YouTube video player"
                      src="https://www.youtube.com/embed/VJ88qlgGn5Y"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  }
                  headerTitle="Bills"
                  buttonLabel=" Create Bill"
                  FlowDiagram={BillFlowDiagram}
                  DisplayIcon={BillIconListing}
                  buttonLink={routeNames.ADD_BILLS}
                  description="Create your bills & get paid easily"
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};
export default Bills;
