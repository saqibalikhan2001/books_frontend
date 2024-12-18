/** @format */

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { AccessDenied } from "app/shared";
import { PODataSourceType } from "./Types";
import { setSessionAndLocalObj } from "utils";
import { endpoints, routeNames } from "static";
import { PurchaseOrderListing } from "./Listing";
import { useGetPurchaseOrdersListingQuery } from "store/query/PurchaseOrders";
import {
  useAxios,
  useBool,
  useDetailPage,
  usePermissions,
  usePersistItemDetail,
  useSearchParam,
  useSharedOrganization,
} from "app/Hooks";

const { PURCHASE_ORDERS } = endpoints;
const { EDIT_PURCHASE_ORDER } = routeNames;

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { getParams } = useSearchParam("");
  const { getCurrentModule, checkModulePermission } = useSharedOrganization();
  const { status = true } = getCurrentModule("purchase-order") || {};
  const { has_PurchaseOrderView_permission } = checkPermission("PurchaseOrderView");
  const { bool: deleteItem, setTrue: DeleteTrue, setFalse: DeleteFalse } = useBool();
  const { memoizeHandleClick, detail, fullScreen, handleFullScreen } = useDetailPage();
  const { data, refetch, isLoading, isFetching } = useGetPurchaseOrdersListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_PurchaseOrderView_permission || checkModulePermission("purchase-order"),
  });
  const { handleSessionState } = usePersistItemDetail(handleFullScreen, DeleteFalse, deleteItem);

  useEffect(() => {
    if (!isFetching && deleteItem) handleSessionState(data?.purchaseOrders, "purchaserders");
    //eslint-disable-next-line
  }, [isFetching, deleteItem, data?.purchaseOrders]);

  const handleClick = (data: PODataSourceType) => {
    setSessionAndLocalObj(data?.id, true, "purchaseorders");
    navigate(`${EDIT_PURCHASE_ORDER}?id=${data.id}`);
  };
  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, PURCHASE_ORDERS, refetch, DeleteTrue),
    [handleConfirm, refetch, DeleteTrue]
  );

  return (
    <>
      <>
        {has_PurchaseOrderView_permission ? (
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
                {data?.purchaseOrders && (
                  <PurchaseOrderListing
                    refetch={refetch}
                    showDetail={fullScreen}
                    handleClick={memoizeClick}
                    bulkDeleteTrue={DeleteTrue}
                    loading={bool || isLoading}
                    listing={data.purchaseOrders}
                    handleConfirm={memoizeConfirm}
                    handleViewClick={memoizeHandleClick}
                  />
                )}
              </Col>

              {fullScreen && (
                <>
                  <Col span={14}>
                    {data?.purchaseOrders && (
                      <DetailPage
                        detail={detail}
                        refetchPO={refetch}
                        deleteItem={deleteItem}
                        handleFullScreen={handleFullScreen}
                        dataLength={data.purchaseOrders.data.length}
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
    </>
  );
};
export default PurchaseOrders;
