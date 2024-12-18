import { Modal } from "antd";
import React from "react";
import INVPaymentDetailPage from "./DetailPage";

//@ts-ignore
export const INVPaymentDetailModal = ({ detail, bool, toggle, journalModal }: any) => {
  return (
    <Modal
      centered
      open={bool}
      width={1140}
      title={null}
      footer={false}
      destroyOnClose
      style={{ top: 0 }}
      onCancel={toggle}
      wrapClassName="generic_modal_style"
      className={journalModal?"estimate_modal estimate_lg_modal journal_item_detail_modal":"estimate_modal estimate_lg_modal"}
      closeIcon={
        <img
          alt="close Icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
        />
      }
      bodyStyle={{
        height: "100px",
      }}
    >
      <INVPaymentDetailPage detail={detail} />
    </Modal>
  );
};
