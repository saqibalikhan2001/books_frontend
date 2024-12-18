/** @format */

import { Modal } from "antd";
import EditCreditNotes from "./Edit";
import CreateCreditNote from "./Create";
import { CreditNoteModalProps } from "./Types";

export const CreditNoteModal = ({
  details,
  creditId,
  className,
  creditModal,
  setCreditId,
  refetchInvoices,
  creditNotesData,
  refetchCreditNotes,
  toggleCreditNoteModal,
}: CreditNoteModalProps) => {
  return (
    <Modal
      centered
      width={1265}
      footer={null}
      destroyOnClose
      maskClosable={false}
      open={creditModal as any}
      onCancel={toggleCreditNoteModal}
      wrapClassName="generic_modal_style"
      className={`${className} estimate_modal estimate_lg_modal generic_modal_style`}
      title={
        creditNotesData?.credit_notes[0]?.credit_note_no
          ? creditNotesData?.credit_notes[0]?.credit_note_no
          : "Add Credit Note"
      }
      closeIcon={
        <img
          alt="close Icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          className="close-icon-align"
        />
      }
    >
      {creditId ? (
        <EditCreditNotes
          isModal
          creditId={creditId}
          invoiceDetail={details}
          creditModal={creditModal}
          setCreditId={setCreditId}
          refetchCreditNotes={refetchCreditNotes}
          toggleCreditNoteModal={toggleCreditNoteModal}
        />
      ) : (
        <CreateCreditNote
          isModal
          invoiceDetail={details}
          creditModal={creditModal}
          refetchInvoices={refetchInvoices}
          toggleCreditNoteModal={toggleCreditNoteModal}
        />
      )}
    </Modal>
  );
};
