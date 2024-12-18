/** @format */

//@ts-nocheck
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "antd";
import { SubHeader } from "./SubHeader";
import { ExpenseListing } from "./Listing";
import { endpoints, routeNames } from "static";
import { PaymentReceivedDataSourceProps } from "./Types";
import {
  useAxios,
  useBool,
  useDetailPage,
  usePermissions,
  useSearchParam,
  useSharedOrganization,
} from "app/Hooks";
import { DetailPage } from "./DetailPage";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback, Spinner } from "app/shared";
import { useGetExpenseListingQuery } from "store/query/expense";

const { EXPENSES } = endpoints;
const { EDIT_EXPENSE } = routeNames;

const Expenses = () => {
  const navigate = useNavigate();
  const { getParams } = useSearchParam("");
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { getCurrentModule, checkModulePermission } = useSharedOrganization();
  const { status = undefined } = getCurrentModule("expense") || {};
  const { has_ExpenseView_permission } = checkPermission("ExpenseView");
  const {
    memoizeHandleClick,
    detail,
    setbool,
    setDetail,
    fullScreen,
    bool: loading,
    handleFullScreen,
  } = useDetailPage();
  // //@ts-ignore
  const { bool: deleteItem, setTrue: DeleteTrue, setFalse: DeleteFalse } = useBool();
  const { data, isLoading, refetch, isFetching } = useGetExpenseListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
  });

  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, EXPENSES, refetch, data?.expenses.data, refetch, DeleteTrue),
    [handleConfirm, refetch, DeleteTrue]
  );
  const handleClick = (data: PaymentReceivedDataSourceProps) => {
    navigate(`${EDIT_EXPENSE}?id=${data.id}`);
  };
  const memoizeClick = useCallback(handleClick, [navigate]);
  return (
    <>
      {
        //for future use
        /* {!status && (
        <Alert
          showIcon
          // closable
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      )} */
      }
      {!has_ExpenseView_permission ? (
        <AccessDenied />
      ) : (
        <>
          {bool || isFetching ? (
            <Spinner />
          ) : (
            data?.expenses && (
              <div
                className="product_detail_listing"
                style={{
                  animation: "fadeInLeft",
                  animationDuration: "0.3s",
                }}
              >
                {!fullScreen && <SubHeader />}
                <div className={fullScreen ? "scrollbar_container" : ""}>
                  <div className={!fullScreen ? "full_screen" : "list"}>
                    {data?.expenses && (
                      <ExpenseListing
                        refetch={refetch}
                        showDetail={fullScreen}
                        handleClick={memoizeClick}
                        bulkDeleteTrue={DeleteTrue}
                        loading={bool || isLoading}
                        listing={data?.expenses || []}
                        handleConfirm={memoizeConfirm}
                        handleViewClick={memoizeHandleClick}
                      />
                    )}
                  </div>

                  {fullScreen && (
                    <div className="content_side __item--conent-side __items--details">
                      {data?.expenses?.data && (
                        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => null}>
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
                  )}
                </div>
              </div>
            )
          )}
        </>
      )}
    </>
  );
};

export default Expenses;
