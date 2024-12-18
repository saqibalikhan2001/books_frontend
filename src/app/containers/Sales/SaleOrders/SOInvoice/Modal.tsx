/** @format */

import { Modal } from "antd";
import { Labels } from "static";
import { AccessDenied } from "app/shared";
import { InvoiceModalProps } from "./Types";
import { InvoiceForm } from "../../Invoices/InvoiceForm";

const InvoiceModal = ({
  url,
  edit,
  item,
  loading,
  onSubmit,
  showModal,
  SOdetails,
  contactObj,
  toggleModal,
  handleTotal,
  setContactObj,
  handleItemList,
  has_permission,
}: InvoiceModalProps) => {
  return (
    <>
      <Modal
        title={
          has_permission
            ? edit
              ? `${Labels.EDIT_INVOICE} | ${SOdetails?.sales_order_no}`
              : `${Labels.CREATE_INVOICE} | ${SOdetails?.sales_order_no}`
            : ""
        }
        width={1200}
        footer={null}
        destroyOnClose
        onOk={toggleModal}
        open={showModal}
        style={{ top: 0 }}
        maskClosable={false}
        onCancel={toggleModal}
      >
        {has_permission ? (
          <InvoiceForm
            isModal
            url={url}
            item={item}
            loading={loading}
            close={toggleModal}
            onSubmit={onSubmit}
            contactObj={contactObj}
            handleTotal={handleTotal}
            setContactObj={setContactObj}
            handleItemList={handleItemList}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};

export default InvoiceModal;
