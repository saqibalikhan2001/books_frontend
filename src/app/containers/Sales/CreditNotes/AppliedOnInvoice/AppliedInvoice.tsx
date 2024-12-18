/** @format */

import { AppliedListing } from "./Listing";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { AppliedInvoiceProps } from "./Types";
import { CreateInvoiceApplied } from "./Create";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { setKeyInLS } from "utils";

const { CREDIT_UTILIZE } = endpoints;

export const AppliedInvoice = ({
  url,
  detail,
  from,
  fetchList,
  isModal = false,
  refetchApplied,
  refetchPaymentReceived,
}: AppliedInvoiceProps) => {
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const { toggle, bool: loading, callAxios } = useAxios();
  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );
  const { has_InvoicePaymentRecordDelete_permission } = checkPermission(
    "InvoicePaymentRecordDelete"
  );

  const handleConfirm = (data: any) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${CREDIT_UTILIZE}/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "3");
        refetchApplied();
        refetchPaymentReceived();
      }
    });
  };

  return (
    <>
      <AppliedListing
        url={url}
        from={from}
        isModal={isModal}
        detail={detail}
        toggle={toggle}
        loading={loading}
        fetchList={fetchList}
        toggleModal={toggleModal}
        handleConfirm={handleConfirm}
        has_permission={has_InvoicePaymentRecordDelete_permission}
      />

      {bool && (
        <CreateInvoiceApplied
          detail={detail}
          showModal={bool}
          toggleModal={toggleModal}
          refetchApplied={refetchApplied}
          refetchPaymentReceived={refetchPaymentReceived}
          has_permission={has_InvoicePaymentRecordCreate_permission}
        />
      )}
    </>
  );
};
