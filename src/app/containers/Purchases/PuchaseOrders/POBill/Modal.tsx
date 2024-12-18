/** @format */

import { Modal } from "antd";
import { Labels } from "static";
import { BillModalProps } from "./Types";
import { AccessDenied } from "app/shared";
import { BillForm } from "../../Bills/BillForm";

const BillModal = ({
  url,
  edit,
  create,
  loading,
  onSubmit,
  showModal,
  POdetail,
  toggleModal,
  handleTotal,
  handleItemList,
  has_permission,
}: BillModalProps) => {
  return (
    <>
      <Modal
        title={
          has_permission
            ? edit
              ? `${Labels.EDIT_BILL} | ${POdetail?.purchase_order_no}`
              : `${Labels.CREATE_BILL} | ${POdetail?.purchase_order_no}`
            : ""
        }
        width={1400}
        footer={null}
        destroyOnClose
        onOk={toggleModal}
        open={showModal}
        style={{ top: 0 }}
        maskClosable={false}
        onCancel={toggleModal}
      >
        {has_permission ? (
          <BillForm
            isModal
            url={url}
            create={create}
            loading={loading}
            close={toggleModal}
            onSubmit={onSubmit}
            POdetails={POdetail}
            handleTotal={handleTotal}
            handleItemList={handleItemList}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};

export default BillModal;
