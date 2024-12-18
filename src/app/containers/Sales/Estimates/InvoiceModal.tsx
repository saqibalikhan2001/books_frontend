import { Modal } from "antd";
import CreateInvoice from "../Invoices/Create";

export const InvoiceModal = ({ invoiceModal, toggleInvoiceModal, details, refetch }) => {
  return (
    <Modal
      className="estimat_modal estimate_lg_modal create_invoice_modal"
      centered
      width={1265}
      footer={false}
      destroyOnClose
      style={{ top: 0 }}
      open={invoiceModal}
      title="Create Invoice"
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
          className="close-icon-align"
        />
      }
      onCancel={toggleInvoiceModal}
      wrapClassName="generic_modal_style"
      bodyStyle={{
        height: "100%",
      }}
    >
      <CreateInvoice
        isModal
        estimateDetails={details}
        refetchEstimates={refetch}
        toggleModal={toggleInvoiceModal}
        url={`/invoices/create?estimate_id=${details?.id}`}
      />
    </Modal >
  );
};
