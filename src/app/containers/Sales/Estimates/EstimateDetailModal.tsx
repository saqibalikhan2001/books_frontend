import { Modal } from "antd";
import { DetailPage } from "./DetailPage";
import { TfiNewWindow } from "react-icons/tfi";

export const EstimateDetailModal = ({ detail, bool, toggle, isModal = false, className }: any) => {
  return (
    <Modal
      centered
      open={bool}
      width={1140}
      footer={false}
      destroyOnClose
      onCancel={toggle}
     
      closeIcon={
        <div style={{ display: "flex" }}>
           <div className="new-window--main"  onClick={(e) => e.stopPropagation()}>
           <a href={`/estimate/${detail.id}`} target="blank" className="d-flex align-center">
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
      wrapClassName="generic_modal_style popup-header--linkfix"
      className={`${className} estimate_modal estimate_lg_modal`}
      bodyStyle={{
        height: "100%",
      }}
    >
      <DetailPage detail={detail} isModal={isModal} />
    </Modal>
  );
};
