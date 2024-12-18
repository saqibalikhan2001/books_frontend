/** @format */

import { useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { endpoints } from "static";
import { EditAccount } from "./Edit";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { CreateAccount } from "./Create";
import { AccountsListing } from "./Listing";
import { SpinnerX } from "app/shared/PageLoader";
import MapOldAccounts from "./MappingOldAccounts";
import { getKeyFromSS, handletoggle } from "utils";
import { useGetAccountsListQuery } from "store/query/accounts";
import { AccessDenied, ErrorFallback, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const Accounts = () => {
  const state = getKeyFromSS("accountModal");
  const [modal, setModal] = useState(false);
  const { handleConfirm, bool } = useAxios();
  const [mapModal, setMapModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const { getCurrentModule } = useSharedOrganization();
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("accounts");
  const { status = true } = getCurrentModule("accounts") || {};
  const { has_AccountsView_permission } = checkPermission("AccountsView");
  const { has_AccountsCreate_permission } = checkPermission("AccountsCreate");
  const { has_AccountsEdit_permission } = checkPermission("AccountsEdit");
  const {
    detail,
    setbool,
    setDetail,
    fullScreen,
    bool: loading,
    handleFullScreen,
  } = useDetailPage();
  const sidebarPosition = useSelector((state: any) => state.sidebarReducer);
  const { data, refetch, isFetching } = useGetAccountsListQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_AccountsView_permission || !status,
    }
  );
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        endpoints.ACCOUNT_NAME,
        refetch,
        data?.accounts?.data,
        endpoints.ACCOUNT_NAME,
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.accounts?.data, paginate, handlePagination, detail]
  );
  const toggleModal = () => setModal(!modal);
  const toggleMapModal = () => setMapModal(!mapModal);
  const handleClick = (data) => {
    setEditAccount(data);
    toggleModal();
  };
  useEffect(() => {
    if (state) setModal(true);
  }, [state]);
  // This code needs to be removed for detail page implemtation
  useEffect(() => {
    handletoggle(handleFullScreen);
  }, []);
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {mapModal && (
        <MapOldAccounts
          bool={mapModal}
          toggle={toggleMapModal}
          has_permission={has_AccountsCreate_permission}
        />
      )}
      {!editAccount && (
        <CreateAccount
          bool={modal}
          refetch={refetch}
          toggle={toggleModal}
          has_permission={has_AccountsCreate_permission}
        />
      )}
      {editAccount && (
        <EditAccount
          bool={modal}
          refetch={refetch}
          toggle={toggleModal}
          account={editAccount}
          setEditAccount={setEditAccount}
          has_permission={has_AccountsEdit_permission}
        />
      )}
      <>
        {!status ? (
          <Alert
            showIcon
            type="info"
            message="Module Permissions"
            description="Please Enable Module Permissions To See Details"
          />
        ) : (
          <>
            {!has_AccountsView_permission ? (
              <AccessDenied />
            ) : (
              <>
                {customLoading || bool || isFetching ? (
                  <Spinner directionSize={"91vh"} />
                ) : (
                  data?.accounts && (
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
                            toggleModal={toggleModal}
                            toggleMapModal={toggleMapModal}
                          />
                        )}

                        <div className={fullScreen ? "scrollbar_container" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.accounts && (
                                <AccountsListing
                                  Prev={Prev}
                                  Next={Next}
                                  listing={data}
                                  status={status}
                                  refetch={refetch}
                                  pagination={paginate}
                                  showDetail={fullScreen}
                                  handlePage={handlePage}
                                  handleClick={handleClick}
                                  setparam={handlePagination}
                                  handleRowSize={handleRowSize}
                                  handleConfirm={memoizeConfirm}
                                  sidebarPosition={sidebarPosition}
                                  base_currency={data.base_currency}
                                  setcustomLoading={setcustomLoading}
                                  handleFullScreen={handleFullScreen}
                                  className="generic-table item-table"
                                />
                              )}
                            </div>
                          )}
                          {fullScreen && (
                            <>
                              <div className="content_side">
                                {data?.accounts && (
                                  <ErrorBoundary
                                    onReset={() => null}
                                    FallbackComponent={ErrorFallback}
                                  >
                                    <DetailPage
                                      detail={detail}
                                      loading={loading}
                                      refetch={refetch}
                                      setFalse={setbool}
                                      base_currency={data.base_currency}
                                    />
                                  </ErrorBoundary>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}
      </>
    </>
  );
};

export default Accounts;
