/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import { SubHeader } from "./SubHeader";
import { DetailPage } from "./DetailPage";
import { EstimateListing } from "./Listing";
import { setSessionAndLocalObj } from "utils";
import { endpoints, routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";
import { EstimatedataSourceProps } from "./Types";
import { useGetEstimatesListingQuery } from "store/query/estimates";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { InvoiceFlowDiagram, InvoiceIconListing } from "assets/svg";
import { AccessDenied, ErrorFallback, Onboarding, SearchAlert, Spinner } from "app/shared";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { ESTIMATES } = endpoints;
const { EDIT_ESTIMATE, ADD_ESTIMATE } = routeNames;

const Estimates = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { checkPermission, fetchingRoles } = usePermissions();
  const [customLoading, setcustomLoading] = useState(false);

  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("estimates");
  const { getCurrentModule } = useSharedOrganization();
  const { status = true } = getCurrentModule("estimates") || {};
  const { has_EstimatesView_permission } = checkPermission("EstimatesView");
  const sidebarPosition = useSelector((state: any) => state.sidebarReducer);
  const {
    detail,
    setbool,
    setDetail,
    fullScreen,
    bool: loading,
    handleFullScreen,
    memoizeHandleClick,
  } = useDetailPage();
  const { data, refetch, isFetching } = useGetEstimatesListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_EstimatesView_permission || !status,
    }
  );

  const handleClick = (data: EstimatedataSourceProps) => {
    setSessionAndLocalObj(data?.id, true, ESTIMATES);
    navigate(`${EDIT_ESTIMATE}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        ESTIMATES,
        refetch,
        data?.estimates?.data,
        "/estimates",
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.estimates.data, handlePagination, detail]
  );
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      <SearchAlert description={["Estimate No.", "Customer Name", "Reference"]} />
      {!status ? (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_EstimatesView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {customLoading || bool || isFetching ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {data?.estimates && (
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
                            noData={(data?.estimates?.data.length as any) > 0 ? false : true}
                          />
                        )}
                        <div className={fullScreen ? "scrollbar_container" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.estimates && (
                                <EstimateListing
                                  Prev={Prev}
                                  Next={Next}
                                  listing={data}
                                  refetch={refetch}
                                  status={status}
                                  loading={isFetching}
                                  pagination={paginate}
                                  showDetail={fullScreen}
                                  handlePage={handlePage}
                                  handleClick={memoizeClick}
                                  setparam={handlePagination}
                                  handleRowSize={handleRowSize}
                                  handleConfirm={memoizeConfirm}
                                  sidebarPosition={sidebarPosition}
                                  setcustomLoading={setcustomLoading}
                                  handleFullScreen={handleFullScreen}
                                  handleViewClick={memoizeHandleClick}
                                  className="generic-table item-table"
                                  // bulkDeleteTrue={DeleteTrue}
                                />
                              )}
                            </div>
                          )}
                          {fullScreen && (
                            <>
                              <div className="content_side estimates-content">
                                {data?.estimates && (
                                  <ErrorBoundary
                                    FallbackComponent={ErrorFallback}
                                    onReset={() => null}
                                  >
                                    <DetailPage
                                      detail={detail}
                                      refetch={refetch}
                                      loading={loading}
                                      setFalse={setbool}
                                      setparam={handlePagination}
                                      data={data?.estimates?.data}
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
                  name="Estimates"
                  videoFrame={
                    <iframe
                      width="700"
                      height="400"
                      allowFullScreen
                      title="YouTube video player"
                      src="https://www.youtube.com/embed/VanjBMN14IE"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  }
                  headerTitle="All Estimates"
                  buttonLink={ADD_ESTIMATE}
                  buttonLabel="Create Estimate"
                  FlowDiagram={InvoiceFlowDiagram}
                  title="Manage Invoice  Activity"
                  DisplayIcon={InvoiceIconListing}
                  description="Create Estimate & get paid easily"
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default Estimates;
