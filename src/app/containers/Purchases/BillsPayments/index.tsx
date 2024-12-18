/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import { endpoints } from "static";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { setSessionAndLocalObj } from "utils";
import { BillPaymentsListing } from "./Listing";
import { SpinnerX } from "app/shared/PageLoader";
import { BillFlowDiagram, BillIconListing } from "assets/svg";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetBillPaymentsListingQuery } from "store/query/billPayments";
import { AccessDenied, ErrorFallback, Onboarding, SearchAlert, Spinner } from "app/shared";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { BILL_PAYMENTS } = endpoints;

const BillPayments = () => {
  const { bool, handleConfirm } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { status = true } = getCurrentModule("bill-payments") || {};
  const { has_BillPaymentRecordView_permission } = checkPermission("BillPaymentRecordView");
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
    useCustomPagination("billPayments");
  const { data, refetch, isFetching } = useGetBillPaymentsListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_BillPaymentRecordView_permission || !status,
    }
  );
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        BILL_PAYMENTS,
        refetch,
        data?.billPayments?.data as any,
        "/bill-payments",
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.billPayments?.data, handlePagination, detail]
  );

  const handleClick = (data: any) => {
    setSessionAndLocalObj(data?.id, true, "bill-payments");
  };
  const memoizeClick = useCallback(handleClick, []);
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <SearchAlert description={["Bill No.", "Order No.", "Supplier Name"]} />

      {!status && (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      )}
      {!has_BillPaymentRecordView_permission ? (
        <AccessDenied />
      ) : status ? (
        <>
          {customLoading || bool || isFetching ? (
            <Spinner directionSize={"91.6vh"} />
          ) : !data?.show_onboard_screen ? (
            <>
              {data?.billPayments.data && (
                <div
                  className="product_detail_listing bill_payment_detail"
                  style={{
                    animation: "fadeInLeft",
                    animationDuration: "0.3s",
                  }}
                >
                  <>
                    {!fullScreen && <SubHeader />}
                    <div className={fullScreen ? "scrollbar_container" : ""}>
                      {!loading && (
                        <div className={!fullScreen ? "full_screen" : "list"}>
                          {data?.billPayments?.data && (
                            <BillPaymentsListing
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
                              handleFullScreen={handleFullScreen}
                              handleViewClick={memoizeHandleClick}
                              setcustomLoading={setcustomLoading}
                              base_currency={data?.bills?.data[0]?.currency}
                            />
                          )}
                        </div>
                      )}
                      {fullScreen && (
                        <>
                          <div className="content_side __item--conent-side __items--details">
                            {data?.billPayments && (
                              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => null}>
                                <DetailPage
                                  detail={detail}
                                  loading={loading}
                                  setFalse={setbool}
                                  refetchBills={refetch}
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
              name="Bill payments"
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
              headerTitle="Bill payments"
              FlowDiagram={BillFlowDiagram}
              DisplayIcon={BillIconListing}
              description="Create your bill payments & get paid easily"
            />
          )}
        </>
      ) : null}
    </>
  );
};
export default BillPayments;
