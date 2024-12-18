/** @format */

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { SODetailProps } from "./Types";
import { AccessDenied } from "app/shared";
import { setSessionAndLocalObj } from "utils";
import { SalesOrderListing } from "./Listing";
import { endpoints, routeNames } from "static";
import { useGetSalesOrdersListingQuery } from "store/query/SaleOrders";
import {
  useAxios,
  useBool,
  useDetailPage,
  usePermissions,
  usePersistItemDetail,
  useSearchParam,
  useSharedOrganization,
} from "app/Hooks";

const { SALES_ORDERS } = endpoints;
const { EDIT_SALES_ORDER } = routeNames;

const SalesOrders = () => {
  const navigate = useNavigate();
  const { getParams } = useSearchParam("");
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { checkModulePermission, getCurrentModule } = useSharedOrganization();
  const { status = true } = getCurrentModule("sales-order") || {};

  const { has_SalesOrderView_permission } = checkPermission("SalesOrderView");
  const { bool: deleteItem, setTrue: DeleteTrue, setFalse: DeleteFalse } = useBool();
  const { memoizeHandleClick, detail, fullScreen, handleFullScreen } = useDetailPage();
  const { data, refetch, isLoading, isFetching } = useGetSalesOrdersListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_SalesOrderView_permission || checkModulePermission("sales-order"),
  });
  const { handleSessionState } = usePersistItemDetail(handleFullScreen, DeleteFalse, deleteItem);

  useEffect(() => {
    if (!isFetching && deleteItem) handleSessionState(data?.salesOrders, "salesorders");
    //eslint-disable-next-line
  }, [isFetching, deleteItem, data?.salesOrders]);

  const handleClick = (data: SODetailProps) => {
    setSessionAndLocalObj(data?.id, true, "salesOrder");
    navigate(`${EDIT_SALES_ORDER}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, SALES_ORDERS, refetch, DeleteTrue),
    [handleConfirm, refetch, DeleteTrue]
  );

  return (
    <>
      {has_SalesOrderView_permission ? (
        <>
          {!status && (
            <Alert
              showIcon
              // closable
              type="info"
              message="Module Permissions"
              description="Please Enable Module Permissions To See Details"
            />
          )}
          <SubHeader enable={!status} />

          <Row>
            <Col span={fullScreen ? 10 : 24}>
              {data?.salesOrders && (
                <SalesOrderListing
                  refetch={refetch}
                  showDetail={fullScreen}
                  listing={data.salesOrders}
                  handleClick={memoizeClick}
                  bulkDeleteTrue={DeleteTrue}
                  loading={bool || isLoading}
                  handleConfirm={memoizeConfirm}
                  handleViewClick={memoizeHandleClick}
                />
              )}
            </Col>

            {fullScreen && (
              <>
                <Col span={14}>
                  {data?.salesOrders && (
                    <DetailPage
                      detail={detail}
                      refetchSO={refetch}
                      deleteItem={deleteItem}
                      handleFullScreen={handleFullScreen}
                      dataLength={data.salesOrders.data?.length}
                    />
                  )}
                </Col>
              </>
            )}
          </Row>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default SalesOrders;
