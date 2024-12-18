/** @format */

import { Modal } from "antd";
import EditInvoices from "../Invoices/Edit";

export const EstimateInvoiceModal = ({
  //   details,
  estInvoiceId,
  setEstInvoiceId,
  estInvoiceModal,
  // refetchCreditNotes,
  toggleEstimateInvoiceModal,
}: any) => {
  return (
    <Modal
      centered
      width={1400}
      footer={null}
      destroyOnClose
      maskClosable={false}
      title="Update Invoice"
      wrapClassName="generic_modal_style"
      closeIcon={
        <img
          alt="close Icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
        />
      }
      open={estInvoiceModal as any}
      onCancel={toggleEstimateInvoiceModal}
      className="estimate_modal estimate_lg_modal generic_modal_style"
    >
      <EditInvoices
        isModal
        estInvoiceId={estInvoiceId}
        //   invoiceDetail={details}
        estInvoiceModal={estInvoiceModal}
        setEstInvoiceId={setEstInvoiceId}
        //   refetchCreditNotes={refetchCreditNotes}
        toggleEstimateInvoiceModal={toggleEstimateInvoiceModal}
      />
      )
    </Modal>
  );
};
