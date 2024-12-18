import { Modal } from "antd";
import { DetailPage } from "./DetailPage";
import { usePermissions } from "app/Hooks";
import { AccessDenied } from "app/shared";
import { TfiNewWindow } from "react-icons/tfi";

export const ItemDetailModal = ({ detail, bool, toggle, isModal = false }: any) => {
  const { checkPermission } = usePermissions();
  const { has_ItemView_permission } = checkPermission("ItemView");

  return (
    <Modal
      centered
      open={bool}
      width={1140}
      footer={false}
      destroyOnClose
      onCancel={toggle}
      style={{ top: 0 }}
      wrapClassName="generic_modal_style res-p-unset details-pages--popup-noscroll popup-header--linkfix"
      className="estimate_modal estimate_lg_modal adjust_symmetical--gap"
      bodyStyle={{
        height: "100%",
      }}
      closeIcon={
        <div style={{ display: "flex" }}>
           <div className="new-window--main"  onClick={(e) => e.stopPropagation()}>
          <a href={`/items/${detail.id}`} target="_blank" className="d-flex">
            <TfiNewWindow size={21} className="a8a8a8"/>
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
    >
      <>
        {has_ItemView_permission ? (
          <DetailPage detail={detail} isModal={isModal} />
        ) : (
          <AccessDenied />
        )}
      </>
    </Modal>
  );
};
