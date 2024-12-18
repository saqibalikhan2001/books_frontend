/** @format */

import { useCallback } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { CreateRefund } from "./Create";
import { RefundDSProps } from "./Types";
import { RefundsListing } from "./Listing";
import { useAxios, useBool } from "app/Hooks";
import { setKeyInLS } from "utils";

const { CREDIT_REFUND, ADVANCE_REFUND } = endpoints;

export const Refund = ({
  url,
  isModal,
  PRdetail,
  fetchList,
  refetchRefund,
  PaymentRefund = false,
  refetchPaymentReceived,
  Permissions,
  toggleFetch,
}: any) => {
  const { bool, toggle: toggleModal } = useBool();
  const { callAxios, toggle, bool: loading } = useAxios();
  const handleConfirm = (data: RefundDSProps) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${PaymentRefund ? ADVANCE_REFUND : CREDIT_REFUND}/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "3");
        refetchRefund();
        refetchPaymentReceived();
        toggleFetch();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,
    //eslint-disable-next-line
    [refetchRefund, refetchPaymentReceived, toggleFetch]
  );
  return (
    <>
      <RefundsListing
        url={url}
        isModal={isModal}
        loading={loading}
        PRdetail={PRdetail}
        fetchList={fetchList}
        toggle={toggle}
        toggleModal={toggleModal}
        PaymentRefund={PaymentRefund}
        handleConfirm={memoizeConfirm}
        has_permission={Permissions.delete}
      />

      {bool && (
        <CreateRefund
          showModal={bool}
          PRdetail={PRdetail}
          toggleFetch={toggleFetch}
          toggleModal={toggleModal}
          PaymentRefund={PaymentRefund}
          refetchRefund={refetchRefund}
          has_permission={Permissions.create}
          refetchPaymentReceived={refetchPaymentReceived}
          url={
            !PaymentRefund
              ? `/creditrefund/${PRdetail?.creditNote?.id}/create`
              : `/advancepayment/${PRdetail?.payment_no}/create/refund`
          }
        />
      )}
    </>
  );
};
