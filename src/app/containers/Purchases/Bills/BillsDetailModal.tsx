import { Modal } from "antd";
import DetailPage from "./DetailPage";
import { usePermissions } from "app/Hooks";
import { AccessDenied } from "app/shared";
import { TfiNewWindow } from "react-icons/tfi";

export const BillsDetailModal = ({
  detail,
  bool,
  toggle,
  isModal = false,
  from,
  journalModal,
}: any) => {
  const { checkPermission } = usePermissions();
  const { has_BillView_permission } = checkPermission("BillView");

  return (
    <Modal
      centered
      open={bool}
      width={1140}
      // title={
      //   <a href={`/bill/${detail?.id}`} target="blank">
      //     <TfiNewWindow size={20} />
      //   </a>
      // }
      footer={false}
      destroyOnClose
      style={{ top: 0 }}
      onCancel={toggle}
      wrapClassName="generic_modal_style popup-header--linkfix"
      className={
        journalModal
          ? "estimate_modal estimate_lg_modal journal_item_detail_modal"
          : "estimate_modal estimate_lg_modal"
      }
      closeIcon={
        <div style={{ display: "flex" }}>
          <div className="new-window--main" onClick={(e) => e.stopPropagation()}>
            <a href={`/bills/${detail?.id}`} target="blank" className="d-flex align-center">
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
      bodyStyle={{
        height: "100%",
      }}
    >
      {has_BillView_permission ? (
        <DetailPage detail={detail} isModal={isModal} from={from} />
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};
