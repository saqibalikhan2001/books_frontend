/** @format */

import { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { SubHeader } from "./SubHeader";
import { DetailPage } from "./DetailPage";
import { InvoiceListing } from "./Listing";
import { setSessionAndLocalObj } from "utils";
import { endpoints, routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";
import { Onboarding } from "app/shared/OnBoarding";
import { useGetInvoicesListingQuery } from "store/query/invoice";
import { AccessDenied, ErrorFallback, SearchAlert, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { InvoiceFlowDiagram, InvoiceIconListing } from "assets/svg";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { INVOICES } = endpoints;
const { EDIT_INVOICE } = routeNames;

const Invoices = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { status = true } = getCurrentModule("invoices") || {};
  const { has_InvoiceView_permission } = checkPermission("InvoiceView");
  const sidebarPosition = useSelector((state: any) => state.sidebarReducer);
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("invoices");

  const {
    detail,
    setbool,
    setDetail,
    fullScreen,
    bool: loading,
    handleFullScreen,
    memoizeHandleClick,
  } = useDetailPage();
  const { data, refetch, isFetching } = useGetInvoicesListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_InvoiceView_permission || !status,
    }
  );

  const handleClick = (data: any) => {
    setSessionAndLocalObj(data?.id, true, INVOICES);
    navigate(`${EDIT_INVOICE}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        INVOICES,
        refetch,
        data?.invoices?.data as any,
        "/invoices",
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.invoices?.data, handlePagination, detail]
  );
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      <SearchAlert description={["Invoice No.", "Estimate No.", "Customer Name"]} />

      {!status && (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      )}
      {!has_InvoiceView_permission ? (
        <AccessDenied />
      ) : status ? (
        <>
          {customLoading || bool || isFetching ? (
            <Spinner directionSize={"91.6vh"} />
          ) : !data?.show_onboard_screen ? (
            <>
              {data?.invoices && (
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
                        noData={(data?.invoices?.data.length as any) > 0 ? false : true}
                      />
                    )}
                    <div className={fullScreen ? "scrollbar_container" : ""}>
                      {!loading && (
                        <div className={!fullScreen ? "full_screen" : "list"}>
                          {data?.invoices && (
                            <InvoiceListing
                              Prev={Prev}
                              Next={Next}
                              listing={data}
                              status={status}
                              refetch={refetch}
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
                            />
                          )}
                        </div>
                      )}
                      {fullScreen && (
                        <>
                          <div className="content_side estimates-content __invoices-details--main">
                            {data?.invoices && (
                              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => null}>
                                <DetailPage
                                  detail={detail}
                                  loading={loading}
                                  setFalse={setbool}
                                  refetchInvoices={refetch}
                                  setparam={handlePagination}
                                  data={data?.invoices?.data}
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
              FlowDiagram={InvoiceFlowDiagram}
              name="Invoice"
              videoFrame={
                <iframe
                  width="700"
                  height="400"
                  src="https://www.youtube.com/embed/VanjBMN14IE"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              }
              DisplayIcon={InvoiceIconListing}
              headerTitle="Invoices"
              title="Manage Invoice  Activity"
              description="Create invoice & get paid easily"
              buttonLabel="Create Invoice"
              buttonLink="/invoice-new"
            />
          )}
        </>
      ) : null}
    </>
  );
};
export default Invoices;
