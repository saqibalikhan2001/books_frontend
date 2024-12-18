/** @format */

import { Modal } from "antd";
import { AccessDenied } from "app/shared";
import { AppliedInvoiceForm } from "./Form";
import { AppliedModalProps } from "./Types";
import { usePermissions } from "app/Hooks";

export const AppliedModal = ({
  url,
  loading,
  onSubmit,
  showModal,
  toggleModal,
  has_permission,
}: AppliedModalProps) => {
  const { checkPermission } = usePermissions();

  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );
  return (
    <>
      <Modal
        width={1140}
        footer={null}
        destroyOnClose
        centered={true}
        open={showModal}
        onOk={toggleModal}
        style={{ top: 0 }}
        maskClosable={false}
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
            className="hover-effect close-icon-align"
          />
        }
        onCancel={toggleModal}
        title={"Applied On Invoice"}
        bodyStyle={{
          height: "100%",
        }}
        wrapClassName="generic_modal_style applied_invoice_modal"
        className="estimate_modal estimate_md_modal"
      >
        {has_permission && has_InvoicePaymentRecordCreate_permission ? (
          <AppliedInvoiceForm
            url={url}
            loading={loading}
            onSubmit={onSubmit}
            toggleModal={toggleModal}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};
