import { useCallback, useState } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { EditInvoice } from "./Edit";
import { InvoiceDetailProps, SoInvoiceProps } from "./Types";
import { CreateInvoice } from "./Create";
import { InvoicesListing } from "./Listing";
import { useAxios, useBool, usePermissions } from "app/Hooks";

const { INVOICES: INVOICES_URL, INVOICE_CREATE } = endpoints;

const SOInvoices = ({ url, SOdetails, refetchSO, refetchInvoices, fetchList }: SoInvoiceProps) => {
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const [isCreate, setIsCreate] = useState(false);
  const { callAxios, toggle, bool: loading } = useAxios();
  const [current, setCurrent] = useState<InvoiceDetailProps>();
  const { has_InvoiceView_permission } = checkPermission("InvoiceView");
  const { has_InvoiceEdit_permission } = checkPermission("InvoiceEdit");
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");
  const { has_InvoiceDelete_permission } = checkPermission("InvoiceDelete");

  const handleCreate = useCallback((create: boolean) => setIsCreate(create), []);

  const handleClick = (data: InvoiceDetailProps) => {
    setIsCreate(false);
    setCurrent(data);
    toggleModal();
  };

  const memoizeClick = useCallback(handleClick, [toggleModal]);
  const handleConfirm = (data: InvoiceDetailProps) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${INVOICES_URL}/${data.id}`,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        refetchInvoices();
        refetchSO();
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
      <InvoicesListing
        url={url}
        loading={loading}
        fetchList={fetchList}
        toggleModal={toggleModal}
        handleClick={memoizeClick}
        handleCreate={handleCreate}
        handleConfirm={memoizeConfirm}
        has_permission={has_InvoiceDelete_permission}
        hasViewPermission={has_InvoiceView_permission}
      />

      {bool && isCreate && (
        <CreateInvoice
          bool={bool}
          SOdetails={SOdetails}
          refetchSO={refetchSO}
          toggleModal={toggleModal}
          refetchInvoices={refetchInvoices}
          has_permission={has_InvoiceCreate_permission}
          url={`${INVOICE_CREATE}?sales_order_id=${SOdetails?.id}`}
        />
      )}

      {bool && !isCreate && (
        <EditInvoice
          bool={bool}
          SOdetails={SOdetails}
          refetchSO={refetchSO}
          toggleModal={toggleModal}
          InvoiceDetail={current || {}}
          refetchInvoices={refetchInvoices}
          has_permission={has_InvoiceEdit_permission}
        />
      )}
    </>
  );
};

export default SOInvoices;
