/**@format */

import { useCallback } from "react";
import { Alert } from "antd";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { setKeyInLS } from "utils";
import { CreatePayment } from "./Create";
import { BillPaymentProps } from "./Types";
import { PaymentsListing } from "./Listing";
import { useAxios, useBool, usePermissions, useSharedOrganization } from "app/Hooks";

const { BILLS, PAYMENT_RECORDS } = endpoints;

export const Payment = ({
  url,
  from,
  detail,
  isModal,
  fetchList,
  refetchBills,
  refetchBillPayments,
}: BillPaymentProps) => {
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const { getCurrentModule } = useSharedOrganization();
  const { callAxios, bool: loading, toggle } = useAxios();
  const { status = true } = getCurrentModule("bill-payments") || {};
  const { has_BillPaymentRecordView_permission } = checkPermission("BillPaymentRecordView");
  const { has_BillPaymentRecordCreate_permission } = checkPermission("BillPaymentRecordCreate");
  const { has_BillPaymentRecordDelete_permission } = checkPermission("BillPaymentRecordDelete");

  const handleConfirm = ({ id }: { id: number }) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${PAYMENT_RECORDS}/${id}`,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "2");
        refetchBillPayments();
        refetchBills();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,
    //eslint-disable-next-line
    []
  );

  return (
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
          <PaymentsListing
            url={url}
            from={from}
            toggle={toggle}
            isModal={isModal}
            loading={loading}
            fetchList={fetchList}
            toggleModal={toggleModal}
            handleConfirm={memoizeConfirm}
            has_permission={has_BillPaymentRecordDelete_permission}
            hasViewPermission={has_BillPaymentRecordView_permission}
            showButton={
              !(detail?.bill_info.status === "paid" || (detail.bill_info?.total ?? 0) <= 0)
            }
          />
          {bool && (
            <CreatePayment
              showModal={bool}
              toggleModal={toggleModal}
              refetchBills={refetchBills}
              bill_id={detail?.bill_info?.id}
              refetchBillPayments={refetchBillPayments}
              has_permission={has_BillPaymentRecordCreate_permission}
              url={`${BILLS}/${detail?.bill_info?.id}${PAYMENT_RECORDS}/create`}
            />
          )}
        </>
      )}
    </>
  );
};
