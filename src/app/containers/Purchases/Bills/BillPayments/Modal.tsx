/**@format */

import { Modal } from "antd";
import { BillPaymentForm } from "./Form";
import { AccessDenied } from "app/shared";
import { paymentModalProps } from "./Types";

export const PaymentModal = ({
  url,
  loading,
  onSubmit,
  showModal,
  toggleModal,
  has_permission,
}: paymentModalProps) => {
  return (
    <>
      <Modal
        centered
        width={1140}
        footer={null}
        destroyOnClose
        open={showModal}
        onOk={toggleModal}
        style={{ top: 0 }}
        maskClosable={false}
        onCancel={toggleModal}
        className="estimate_modal estimate_md_modal"
        title={has_permission && "Create New Bill payment"}
        wrapClassName="generic_modal_style height-adjustment create_bill_payment create-payment--popup"
        closeIcon={
          <img
            alt="close Icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
      >
        {has_permission ? (
          <BillPaymentForm
            url={url}
            loading={loading}
            onSubmit={onSubmit}
            toggleModal={toggleModal}
            showModal={showModal}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};
