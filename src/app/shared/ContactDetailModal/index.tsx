import { Modal } from "antd";
import DetailPageModal from "./Detail";
import { usePermissions } from "app/Hooks";
import { AccessDenied } from "../AccessDenied";
import { TfiNewWindow } from "react-icons/tfi";

export const ContactModal = ({ detail, bool, toggle, supplier = false }) => {
  const { checkPermission } = usePermissions();
  const { has_CustomerView_permission } = checkPermission("CustomerView");
  const { has_SupplierView_permission } = checkPermission("SupplierView");

  const has_view_permission = supplier ? has_SupplierView_permission : has_CustomerView_permission;
  const has_supplier = supplier ? "supplier" : "customer";
  return (
    <Modal
      className="estimate_modal bill_payment_popup supplier-details--popup"
      style={{ top: 0 }}
      width={1140}
      centered
      footer={false}
      open={bool}
      closeIcon={
        <div style={{ display: "flex" }}>
          <div className="new-window--main" onClick={(e) => e.stopPropagation()}>
            <a
              href={`/${has_supplier}/${detail.id}`}
              target="blank"
              className="d-flex align-center"
            >
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
      wrapClassName="generic_modal_style popup-header--linkfix "
      bodyStyle={{
        height: "100%",
      }}
    >
      {has_view_permission ? <DetailPageModal detail={detail} /> : <AccessDenied />}
    </Modal>
  );
};
