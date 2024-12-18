/** @format */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import { SubHeader } from "./SubHeader";
import { ItemListing } from "./Listing";
import { DataSourceProps } from "./Types";
import { DetailPage } from "./DetailPage";
import { setSessionAndLocalObj } from "utils";
import { endpoints, routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";
import { Onboarding } from "app/shared/OnBoarding";
import { NewItemIcon } from "assets/svg/newItemIcon";
import { useGetItemsListingQuery } from "store/query/items";
import { AccessDenied, ErrorFallback, SearchAlert, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { ItemFlowDiagram } from "assets/svg/FlowDiagrams/itemFlowDiagram";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { ITEMS } = endpoints;
const { EDIT_ITEM } = routeNames;

const Items = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { getCurrentModule } = useSharedOrganization();
  const { status = true } = getCurrentModule("item") || {};
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_ItemView_permission } = checkPermission("ItemView");
  const { paginate, Prev, Next, handlePage, handleRowSize, handlePagination } =
    useCustomPagination("items");
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
  const { data, refetch, isFetching } = useGetItemsListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_ItemView_permission || !status,
    }
  );

  const handleClick = (data: DataSourceProps) => {
    setSessionAndLocalObj(data?.id, true, "/items");
    navigate(`${EDIT_ITEM}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) =>
      handleConfirm(
        params,
        ITEMS,
        refetch,
        data?.items?.data,
        "/items",
        paginate,
        handlePagination,
        detail,
        setDetail
      ),
    [handleConfirm, refetch, data?.items?.data, paginate, handlePagination, detail]
  );
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <SearchAlert description={["Name", "SKU", "MPN", "EAN", "Manufacturer", "Brand"]} />
      {!status ? (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_ItemView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {bool || isFetching || customLoading ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {data?.items?.data && (
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
                            refetch={refetch}
                            noData={(data?.items?.data.length as any) > 0 ? false : true}
                          />
                        )}
                        <div className={fullScreen ? "scrollbar_container" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.items && (
                                <ItemListing
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
                                  base_currency={data.base_currency}
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
                              <div className="content_side __item--conent-side __items--details">
                                {data?.items && (
                                  //@ts-ignore
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
                  name="Items"
                  DisplayIcon={NewItemIcon}
                  FlowDiagram={ItemFlowDiagram}
                  headerTitle="Products/Services"
                  buttonLink={routeNames.ADD_ITEM}
                  buttonLabel="Create Products/Services"
                  secondaryButtonLink="/Products/Services/import"
                  description="Create and manage your Products/Services here"
                  videoFrame={
                    <iframe
                      width="700"
                      height="500"
                      src="https://www.youtube.com/embed/nzA65-Au0Uc"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  }
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};
export default Items;
