/** @format */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import { AccessDenied } from "app/shared";
import { InvoiceListing } from "./Listing";
import { setSessionAndLocalObj } from "utils";
import { endpoints, routeNames } from "static";
import { useGetRecurringInvoiceListQuery } from "store/query/invoice";
import {
  useBool,
  useAxios,
  useDetailPage,
  usePermissions,
  useSearchParam,
  useSharedOrganization,
} from "app/Hooks";

const { RECURRING_INVOICE } = endpoints;
const { EDIT_RECURRING_INVOICES } = routeNames;

const Invoices = () => {
  const navigate = useNavigate();
  const { getParams } = useSearchParam("");
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { bool: deleteItem, setTrue: DeleteTrue } = useBool();
  const { getCurrentModule, checkModulePermission } = useSharedOrganization();
  const { status = true } = getCurrentModule("recurring-invoices") || {};
  const { memoizeHandleClick, detail, fullScreen, handleFullScreen } = useDetailPage();
  const { has_RecurringInvoicesView_permission } = checkPermission("RecurringInvoicesView");
  const { data, refetch, isLoading } = useGetRecurringInvoiceListQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_RecurringInvoicesView_permission || checkModulePermission("recurring-invoices"),
  });

  const handleClick = (data: any) => {
    setSessionAndLocalObj(data?.id, true, "invoices", null, null);
    navigate(`${EDIT_RECURRING_INVOICES}?id=${data.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, RECURRING_INVOICE, refetch, DeleteTrue),
    [handleConfirm, refetch, DeleteTrue]
  );

  return (
    <>
      {has_RecurringInvoicesView_permission ? (
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
              {data?.recurring_invoices && (
                <InvoiceListing
                  refetch={refetch}
                  showDetail={fullScreen}
                  handleClick={memoizeClick}
                  bulkDeleteTrue={DeleteTrue}
                  loading={bool || isLoading}
                  handleConfirm={memoizeConfirm}
                  handleViewClick={memoizeHandleClick}
                  listing={data?.recurring_invoices || []}
                />
              )}
            </Col>

            {fullScreen && (
              <>
                <Col span={14}>
                  {data?.recurring_invoices && (
                    <DetailPage
                      detail={detail}
                      deleteItem={deleteItem}
                      refetchInvoices={refetch}
                      handleFullScreen={handleFullScreen}
                      dataLength={data.recurring_invoices.data.length}
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
export default Invoices;
