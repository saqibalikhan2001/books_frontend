/** @format */

import { useCallback, useState } from "react";
import { EditBill } from "./Edit";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { CreateBill } from "./Create";
import { BillListing } from "./Listing";
import { BillDetailProps, POBillListingProps, PoBillProps } from "./Types";
import { useAxios, useBool, usePermissions } from "app/Hooks";

const { BILLS } = endpoints;

const POBill = ({ url, POdetail, fetchList, refetchBills, refetchPO }: PoBillProps) => {
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const [isCreate, setIsCreate] = useState(false);
  const { callAxios, toggle, bool: loading } = useAxios();
  const [current, setCurrent] = useState<BillDetailProps>();
  const { has_BillView_permission } = checkPermission("BillView");
  const { has_BillEdit_permission } = checkPermission("BillEdit");
  const { has_BillCreate_permission } = checkPermission("BillCreate");
  const { has_BillDelete_permission } = checkPermission("BillDelete");

  const handleCreate = useCallback((create: boolean) => setIsCreate(create), []);

  const handleClick = (data: POBillListingProps) => {
    setIsCreate(false);
    setCurrent(data);
    toggleModal();
  };

  const memoizeClick = useCallback(handleClick, [toggleModal]);
  const handleConfirm = (data: POBillListingProps) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${BILLS}/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        refetchBills();
        refetchPO();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,
    //eslint-disable-next-line
    [refetchBills, refetchPO]
  );

  return (
    <>
      <BillListing
        loading={loading}
        url={`${url}${BILLS}`}
        fetchList={fetchList}
        toggleModal={toggleModal}
        handleClick={memoizeClick}
        handleCreate={handleCreate}
        handleConfirm={memoizeConfirm}
        has_permission={has_BillDelete_permission}
        hasViewPermission={has_BillView_permission}
        showButton={POdetail?.status === "issued" && POdetail?.bill_status !== "billed"}
      />

      {bool && isCreate && (
        <CreateBill
          bool={bool}
          POdetail={POdetail}
          refetchPO={refetchPO}
          toggleModal={toggleModal}
          refetchBills={refetchBills}
          has_permission={has_BillCreate_permission}
          url={`${BILLS}/create?purchase_order_id=${POdetail?.id}`}
        />
      )}

      {bool && !isCreate && (
        <EditBill
          bool={bool}
          POdetail={POdetail}
          BillDetail={current}
          refetchPO={refetchPO}
          toggleModal={toggleModal}
          refetchBills={refetchBills}
          has_permission={has_BillEdit_permission}
        />
      )}
    </>
  );
};

export default POBill;
