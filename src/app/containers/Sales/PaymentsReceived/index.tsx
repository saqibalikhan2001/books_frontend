/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { endpoints, routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";
import { PaymentReceivedListing } from "./Listing";
import { Onboarding } from "app/shared/OnBoarding";
import { PaymentReceivedDataSourceProps } from "./Types";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";
import { InvoiceFlowDiagram, RecordPaymentIcon } from "assets/svg";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { AccessDenied, ErrorFallback, SearchAlert, Spinner, Toast } from "app/shared";
import { useGetPaymentReceivedListingQuery } from "store/query/paymentReceived";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { ADVANCE_PAYMENT } = endpoints;
const { EDIT_PAYMENTS_RECEIVED } = routeNames;

const PaymentsRecevied = () => {
  const navigate = useNavigate();
  const { bool, toggle, callAxios } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { status = true } = getCurrentModule("payment-received") || {};
  const { has_PaymentReceiptsView_permission } = checkPermission("PaymentReceiptsView");
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("paymentReceive");
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
  const { data, refetch, isFetching } = useGetPaymentReceivedListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_PaymentReceiptsView_permission || !status,
    }
  );
  const memoizeConfirm = (curr: any) => {
    const dataFromLS = JSON.parse(getKeyFromSS("obj"));
    const currentIndex = data?.advancePayments?.data.findIndex(
      (d) => +d?.payment_no === +curr?.payment_no
    );
    toggle();
    callAxios({
      method: "delete",
      url: `${ADVANCE_PAYMENT}/${curr.payment_no}`,
    }).then((res: any) => {
      if (res) {
        if (Number(curr?.payment_no) === Number(detail?.payment_no)) setDetail(null);
        Toast({ message: res.message });
        refetch();
        if (data?.advancePayments?.data?.length > 1) {
          setSessionAndLocalObj(
            data?.advancePayments?.data[currentIndex + 1]?.payment_no
              ? data?.advancePayments?.data[currentIndex + 1]?.payment_no
              : data?.advancePayments?.data[currentIndex - 1]?.payment_no,
            dataFromLS?.once ? dataFromLS?.once : false,
            ADVANCE_PAYMENT || "",
            null,
            null
          );
        } else {
          if (paginate?.page === 1) {
            setSessionAndLocalObj("", false, ADVANCE_PAYMENT || "", null, null);
          } else {
            handlePagination({
              ...paginate,
              page: paginate?.page - 1,
            });
            setSessionAndLocalObj(
              "",
              dataFromLS?.once ? dataFromLS?.once : false,
              ADVANCE_PAYMENT || "",
              null,
              null
            );
          }
        }
      }
    });
  };

  const handleClick = (data: PaymentReceivedDataSourceProps) => {
    setSessionAndLocalObj(data.payment_no, true, "paymentreceived");
    navigate(`${EDIT_PAYMENTS_RECEIVED}?id=${data.payment_no}`);
  };
  const memoizeClick = useCallback(handleClick, [navigate]);
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <SearchAlert
        description={["Payment", "Invoice No.", "Customer Name", "Reference", "Amount"]}
      />
      {!status ? (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_PaymentReceiptsView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {customLoading || bool || isFetching ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {data?.advancePayments && (
                    <div
                      className="product_detail_listing"
                      style={{
                        animation: "fadeInLeft",
                        animationDuration: "0.3s",
                      }}
                    >
                      <>
                        {!fullScreen && <SubHeader enable={!status} />}
                        <div className={fullScreen ? "scrollbar_container detail-listing-adj" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.advancePayments && (
                                <PaymentReceivedListing
                                  Prev={Prev}
                                  Next={Next}
                                  status={status}
                                  listing={data}
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
                              <div className="content_side estimates-content">
                                {data?.advancePayments && (
                                  <ErrorBoundary
                                    FallbackComponent={ErrorFallback}
                                    onReset={() => null}
                                  >
                                    <DetailPage
                                      PRdetail={detail}
                                      loading={loading}
                                      setFalse={setbool}
                                      handleConfirm={memoizeConfirm}
                                      refetchPaymentReceived={refetch}
                                      handleFullScreen={handleFullScreen}
                                      // data={data?.advancePayments?.data}
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
                  name="Payment receipts"
                  FlowDiagram={InvoiceFlowDiagram}
                  videoFrame={
                    <iframe
                      width="700"
                      height="500"
                      src="https://www.youtube.com/embed/7fruK9bGEdI"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  }
                  DisplayIcon={RecordPaymentIcon}
                  headerTitle="Payment receipts"
                  description="Create and manage your Payment receipts here"
                  buttonLabel="Create Payment receipts"
                  buttonLink={routeNames.ADD_PAYMENTS_RECEIVED}
                  secondaryButtonLink="/Payment receipts/import"
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default PaymentsRecevied;
