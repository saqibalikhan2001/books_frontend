import { Modal } from "antd";
import DetailPage from "./DetailPage";

export const ContactDetailModal = ({ detail, bool, toggle, isModal = false, journalModal }: any) => {
  return (
    <Modal
      className={journalModal?"estimate_modal estimate_lg_modal journal_item_detail_modal":"estimate_modal estimate_lg_modal"}
      style={{ top: 0 }}
      width={1000}
      centered
      footer={false}
      open={bool}
      title={null}
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
        />
      }
      onCancel={toggle}
      destroyOnClose
      wrapClassName="generic_modal_style"
      bodyStyle={{
        height: "100%",
      }}
    >
      <DetailPage detail={detail} isModal={isModal} />
    </Modal>
  );
};
