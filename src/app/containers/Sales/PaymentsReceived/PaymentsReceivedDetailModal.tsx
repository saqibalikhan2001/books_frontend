import { Modal } from "antd";
import DetailPage from "./DetailPage";
import { TfiNewWindow } from "react-icons/tfi";

export const PaymentReceivedDetailModal = ({
  detail,
  bool,
  toggle,
  isModal = false,
  journalModal,
}: any) => {
  return (
    <Modal
      className={
        journalModal
          ? "estimate_modal estimate_lg_modal journal_item_detail_modal"
          : "estimate_modal estimate_lg_modal"
      }
      style={{ top: 0 }}
      width={1140}
      centered
      footer={false}
      open={bool}
      closeIcon={
        <div style={{ display: "flex" }}> 
         <div className="new-window--main"  onClick={(e) => e.stopPropagation()}>
           <a href={`/paymentsreceived/${detail?.id}`} target="blank" className="d-flex align-center">
          <TfiNewWindow size={21} className="a8a8a8" />
          </a>
          </div>
          <div className="close-icon--main">
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
              alt="close Icon"
            />
          </div>
        </div>
      }
      onCancel={toggle}
      destroyOnClose
      wrapClassName="generic_modal_style popup-header--linkfix"
      bodyStyle={{
        height: "100%",
      }}
    >
      <DetailPage PRdetail={{ payment_no: detail?.id }} isModal={isModal} />
    </Modal>
  );
};
