/** @format */

import { Modal } from "antd";
import { AccessDenied } from "app/shared";
import { AppliedInvoiceForm } from "./Form";
import { AppliedModalProps } from "./Types";

export const AppliedModal = ({
  url,
  loading,
  onSubmit,
  showModal,
  toggleModal,
  has_permission,
}: AppliedModalProps) => {
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
        onCancel={toggleModal}
        title={"Applied On Invoice"}
        className="estimate_modal estimate_md_modal"
        wrapClassName="generic_modal_style applied_invoice_modal"
        closeIcon={
          <img
            alt="close Icon"
            className="hover-effect close-icon-align "
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}

          />
        }
        bodyStyle={{
          height: "100%",
        }}
      >
        {has_permission ? (
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
