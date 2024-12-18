/** @format */

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { AccessDenied } from "app/shared";
import { endpoints, routeNames } from "static";
import { RecurringBillListing } from "./Listing";
import { RecurringBillDataSource } from "./Types";
import { useGetBillRecurringListingQuery } from "store/query/bills";
import {
  useAxios,
  useBool,
  useDetailPage,
  usePermissions,
  usePersistItemDetail,
  useSearchParam,
  useSharedOrganization,
} from "app/Hooks";
import { setSessionAndLocalObj } from "utils";

const { RECURRING_BILL } = endpoints;
const { EDIT_RECURRING_BILL } = routeNames;

const RecurringBills = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { getParams } = useSearchParam("");
  const { getCurrentModule, checkModulePermission } = useSharedOrganization();
  const { status = true } = getCurrentModule("bills") || {};
  const { has_RecurringBillsView_permission } = checkPermission("RecurringBillsView");
  const { bool: deleteItem, setTrue: DeleteTrue, setFalse: DeleteFalse } = useBool();
  const { memoizeHandleClick, detail, fullScreen, handleFullScreen } = useDetailPage();
  const { data, refetch, isLoading, isFetching } = useGetBillRecurringListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_RecurringBillsView_permission || checkModulePermission("bills"),
  });

  const { handleSessionState } = usePersistItemDetail(handleFullScreen, DeleteFalse, deleteItem);

  useEffect(() => {
    if (!isFetching && deleteItem) handleSessionState(data?.recurring_bills, "recurringbills");
    //eslint-disable-next-line
  }, [isFetching, deleteItem, data?.recurring_bills]);

  const handleClick = (data: RecurringBillDataSource) => {
    setSessionAndLocalObj(data?.id, true, "recurringbills");
    navigate(`${EDIT_RECURRING_BILL}?id=${data.id}`);
  };
  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, RECURRING_BILL, refetch, DeleteTrue),
    [handleConfirm, refetch, DeleteTrue]
  );

  return (
    <>
      {has_RecurringBillsView_permission ? (
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
              {data?.recurring_bills && (
                <RecurringBillListing
                  refetch={refetch}
                  showDetail={fullScreen}
                  handleClick={memoizeClick}
                  bulkDeleteTrue={DeleteTrue}
                  loading={bool || isLoading}
                  handleConfirm={memoizeConfirm}
                  listing={data.recurring_bills}
                  handleViewClick={memoizeHandleClick}
                />
              )}
            </Col>

            {fullScreen && (
              <>
                <Col span={14}>
                  {data?.recurring_bills && (
                    <DetailPage
                      detail={detail}
                      refetchBills={refetch}
                      deleteItem={deleteItem}
                      handleFullScreen={handleFullScreen}
                      dataLength={data.recurring_bills.data.length}
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
export default RecurringBills;
