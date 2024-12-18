/**@format */

import { useCallback, useEffect, useState, useTransition } from "react";
import { endpoints } from "static";
import { SubHeader } from "./SubHeader";
import { AccessDenied } from "app/shared";
import { EditPaymentMethod } from "./Edit";
import { CreatePaymentMethod } from "./Create";
import { PaymentMethodListing } from "./Listing";
import { PaymentMethodDetailProps } from "./Types";
import { useGetPaymentMethodsListQuery } from "store/query/organization";
import { useAxios, useBool, usePermissions, useSearchParam } from "app/Hooks";

const { PAYMENT_METHOD } = endpoints;

const PaymentMethods = () => {
  const { bool, handleConfirm } = useAxios();
  const [, startTransition] = useTransition();
  const { checkPermission } = usePermissions();
  const { bool: showModal, toggle } = useBool();
  const [create, setIsCreate] = useState(false);
  const { total, getParams, setTotal } = useSearchParam("");
  const [current, setCurrent] = useState<PaymentMethodDetailProps>();
  const { has_PaymentModeView_permission } = checkPermission("PaymentModeView");
  const { has_PaymentModeEdit_permission } = checkPermission("PaymentModeEdit");
  const { has_PaymentModeCreate_permission } = checkPermission("PaymentModeCreate");
  const { has_PaymentModeDelete_permission } = checkPermission("PaymentModeDelete");
  const {
    data = {},
    isLoading,
    refetch,
  } = useGetPaymentMethodsListQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_PaymentModeView_permission,
  });

  useEffect(() => {
    setTotal(data?.total);
  }, [setTotal, data?.total]);

  const handleClick = (data: PaymentMethodDetailProps) => {
    setCurrent(data);
    startTransition(() => {
      toggle();
    });
  };

  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, PAYMENT_METHOD, refetch),
    //eslint-disable-next-line
    []
  );

  //eslint-disable-next-line
  const memoizeClick = useCallback(handleClick, []);
  const memoizehandleCreate = useCallback(() => setIsCreate(!create), [create]);

  const handleCreate = () => setIsCreate(true);

  return (
    <>
      <SubHeader closeModal={handleCreate} />
      {create && (
        <CreatePaymentMethod
          bool={create}
          refetch={refetch}
          toggle={memoizehandleCreate}
          memoizehandleCreate={memoizehandleCreate}
          has_permission={has_PaymentModeCreate_permission}
        />
      )}

      {has_PaymentModeView_permission ? (
        <PaymentMethodListing
          total={total}
          listing={data?.data || []}
          handleClick={memoizeClick}
          loading={bool || isLoading}
          handleConfirm={memoizeConfirm}
          has_permission={has_PaymentModeDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {showModal && Object.keys(current as PaymentMethodDetailProps).length > 0 && (
        <EditPaymentMethod
          toggle={toggle}
          bool={showModal}
          refetch={refetch}
          has_permission={has_PaymentModeEdit_permission}
          paymentMethod={current as PaymentMethodDetailProps}
        />
      )}
    </>
  );
};
export default PaymentMethods;
