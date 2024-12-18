/** @format */

import { Modal } from "antd";
import { RefundDetailPage } from "./DetailPage";
import { DetailPage } from "./RefundDetailPage";

export const RefundDetailModal = ({
  detail,
  bool,
  toggle,
  PaymentRefund,
  refundTab = false,
  currency,
  journalModal,
}: any) => {
  return (
    <>
      <Modal
        width={450}
        open={bool}
        title={null}
        footer={null}
        destroyOnClose
        centered={true}
        onCancel={toggle}
        style={{ top: 0 }}
        maskClosable={false}
        wrapClassName="generic_modal_style refund_modal credit_refund_modal"
        className={journalModal?"estimate_modal estimate_md_modal tackle-tracker __credit--refund--details journal_item_detail_modal":"estimate_modal estimate_md_modal tackle-tracker __credit--refund--details"}
        bodyStyle={{
          height: "100% !important",
        }}
        closeIcon={
          <img
            alt="close Icon"
            className="close-icon-align"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
      >
        {refundTab ? (
          <DetailPage details={detail} PaymentRefund={PaymentRefund} currency={currency} />
        ) : (
          <RefundDetailPage detail={detail} toggle={toggle} currency={currency} />
        )}
      </Modal>
    </>
  );
};
