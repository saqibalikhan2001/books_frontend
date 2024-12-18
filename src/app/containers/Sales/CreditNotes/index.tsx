/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import { SubHeader } from "./SubHeader";
import { DetailPage } from "./DetailPage";
import { setSessionAndLocalObj } from "utils";
import { CreditNoteListing } from "./Listing";
import { endpoints, routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetCreditNotesListingQuery } from "store/query/creditNotes";
import { AccessDenied, ErrorFallback, Onboarding, SearchAlert, Spinner } from "app/shared";
import { CreditNoteIcon, SaleOrderFlowDiagram, CreditNoteImage } from "assets/svg";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { CREDIT_NOTES } = endpoints;

const CreditNotes = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { status = true } = getCurrentModule("credit-notes") || {};
  const { has_CreditNoteView_permission } = checkPermission("CreditNoteView");
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("creditNote");
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
  const { data, refetch, isFetching } = useGetCreditNotesListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_CreditNoteView_permission || !status,
    }
  );

  const handleClick = (data: any) => {
    setSessionAndLocalObj(data?.id, true, "creditNote");
    navigate(`${routeNames.EDIT_CREDIT_NOTE}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        CREDIT_NOTES,
        refetch,
        data?.credit_notes?.data as any,
        CREDIT_NOTES,
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.credit_notes?.data, handlePagination, detail]
  );
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      <SearchAlert description={["Credit Note No.", "Invoice No.", "Customer Name"]} />

      {!status ? (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_CreditNoteView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {customLoading || bool || isFetching ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {data?.credit_notes && (
                    <div
                      className="product_detail_listing credit_note_listing"
                      style={{
                        animation: "fadeInLeft",
                        animationDuration: "0.3s",
                      }}
                    >
                      <>
                        {!fullScreen && (
                          <SubHeader
                            enable={!status}
                            noData={(data?.credit_notes?.data.length as any) > 0 ? false : true}
                          />
                        )}

                        <div className={fullScreen ? "scrollbar_container detail-listing-adj" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.credit_notes && (
                                <CreditNoteListing
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
                              <div className="content_side credit-note-content">
                                {data?.credit_notes && (
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
                                      handleConfirm={memoizeConfirm}
                                      data={data?.credit_notes?.data}
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
                  name="Credit Notes"
                  Image={CreditNoteImage}
                  videoFrame={
                    <iframe
                      width="700"
                      height="400"
                      loading="lazy"
                      allowFullScreen
                      title="YouTube video player"
                      src="https://www.youtube.com/embed/TSi9nZJIAl0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  }
                  headerTitle="Credit Notes"
                  DisplayIcon={CreditNoteIcon}
                  buttonLabel="Create Credit Note"
                  FlowDiagram={SaleOrderFlowDiagram}
                  title="Manage Credit Notes Activity"
                  buttonLink={routeNames.ADD_CREDIT_NOTE}
                  description="Create, customize and manage your credit note"
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};
export default CreditNotes;
