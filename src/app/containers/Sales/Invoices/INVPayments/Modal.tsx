/**@format */

import { Modal } from "antd";
import { AccessDenied } from "app/shared";
import { InvoicePaymentForm } from "./Form";
import { PaymentModalProps } from "./Types";
import { usePermissions } from "app/Hooks";

export const PaymentModal = ({
  url,
  onSubmit,
  loading,
  showModal,
  toggleModal,
  has_permission,
}: PaymentModalProps) => {
  const { checkPermission } = usePermissions();

  const { has_PaymentReceiptsCreate_permission } = checkPermission("PaymentReceiptsCreate");
  return (
    <>
      <Modal
        className="estimate_modal estimate_md_modal popup--spacing "
        width={940}
        footer={null}
        destroyOnClose
        centered
        onOk={toggleModal}
        open={showModal}
        style={{ top: 0 }}
        maskClosable={false}
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
          />
        }
        onCancel={toggleModal}
        title={has_permission && "New Received payment"}
        wrapClassName="generic_modal_style height-adjustment"
        bodyStyle={{
          height: "100%",
        }}
      >
        {has_permission && has_PaymentReceiptsCreate_permission ? (
          <InvoicePaymentForm
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
