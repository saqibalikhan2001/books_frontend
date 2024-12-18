/** @format */

import { Modal } from "antd";
import { Labels } from "static";
import { AccessDenied } from "app/shared";
import { PackageModalProps } from "./Types";
import { PackageForm } from "app/containers/Packages/PackageForm";

const PackageModal = ({
  url,
  edit,
  loading,
  onSubmit,
  showModal,
  SOdetails,
  toggleModal,
  has_permission,
  handleItemsList,
}: PackageModalProps) => {
  return (
    <>
      <Modal
        title={
          has_permission
            ? edit
              ? `${Labels.EDIT_PACKAGE} | ${SOdetails?.sales_order_no}`
              : `${Labels.CREATE_PACKAGE} | ${SOdetails?.sales_order_no}`
            : ""
        }
        width={1000}
        open={showModal}
        style={{ top: 0 }}
        destroyOnClose
        onOk={toggleModal}
        maskClosable={false}
        onCancel={toggleModal}
        footer={null}
      >
        {has_permission ? (
          <PackageForm
            isModal
            url={url}
            loading={loading}
            close={toggleModal}
            onSubmit={onSubmit}
            handleItemsList={handleItemsList}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};

export default PackageModal;
