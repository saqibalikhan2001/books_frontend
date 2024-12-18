/** @format */

import { Modal } from "antd";
import { RefundForm } from "./Form";
import { AccessDenied } from "app/shared";
import { RefundModalProps } from "./Types";

const RefundModal = ({
  url,
  loading,
  PRdetail,
  onSubmit,
  showModal,
  toggleModal,
  has_permission,
  moduleendpoint,
}: RefundModalProps) => {
  return (
    <>
      <Modal
        width={940}
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
            className="close-icon-align"
          />
        }
        onCancel={toggleModal}
        title={has_permission && "Create Refund"}
        wrapClassName="generic_modal_style refund_modal"
        className="estimate_modal estimate_md_modal tackle-tracker "
        bodyStyle={{
          height: "100% !important",
        }}
      >
        {has_permission ? (
          <RefundForm
            url={url}
            loading={loading}
            onSubmit={onSubmit}
            PRdetail={PRdetail}
            toggleModal={toggleModal}
            moduleendpoint={moduleendpoint}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal >
    </>
  );
};

export default RefundModal;
