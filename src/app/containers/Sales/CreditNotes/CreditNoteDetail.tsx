/**@format */
//@ts-nocheck
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Statistic, Table } from "antd";
import { useAxios, useStore } from "app/Hooks";
import { ActionMenu, Toast } from "app/shared";
import { CreditNoteModal } from "./CreditNoteModal";
import { CreditNoteDetailPageProps } from "./Types";
import { capitalize, getOrganizationDate } from "utils";

export const CreditnotesDetail = ({
  isModal,
  details,
  className,
  creditNotesData,
  refetchInvoices,
  refetchCreditNotes,
}: CreditNoteDetailPageProps) => {
  const navigate = useNavigate();
  const { org_date_format } = useStore();
  const { callAxios, toggle } = useAxios();
  const [creditId, setCreditId] = useState<Number>();
  const [creditModal, setCreditModal] = useState(false);

  const handleClick = (data) => {
    setCreditId(data.id);
    toggleCreditNoteModal();
    //`creditnotes/${data.id}/edit`
  };
  const handleConfirm = (data: any) => {
    toggle();
    callAxios({
      method: "delete",
      url: `creditnotes/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        refetchCreditNotes();
      }
    });
  };
  const memoizeClick = useCallback(handleConfirm, [navigate, refetchCreditNotes]);

  const toggleCreditNoteModal = () => setCreditModal(!creditModal);

  const markOpen = (data) => {
    callAxios({
      method: "put",
      url: `/creditnotes/${data?.id}/confirmed`,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        refetchCreditNotes();
      }
    });
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "",
      key: "date",
      render: (props: any) => getOrganizationDate(props?.credit_note_date, org_date_format),
    },
    {
      title: "Credit notes number",
      dataIndex: "credit_note_no",
      key: "note",
    },
    {
      title: "Amount",
      dataIndex: "",
      className: "text-right",
      key: "amount",
      render: (creditNote) => (
        <Statistic
          precision={2}
          className="no-space"
          prefix={creditNote?.symbol}
          valueStyle={{ fontSize: "14px" }}
          value={creditNote?.issued_credits ?? 0}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`generic-badge ${
            status === "partially applied" ? "partially-applied" : status
          }`}
        >
          {capitalize(status === "partially applied" ? "PRTL Applied" : status)}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "",
      width: 50,
      hide: isModal,
      key: "x",
      align: "center" as const,
      render: (props: any) => {
        return (
          <ActionMenu
            showEdit
            data={props}
            InvoiceCreditnote
            markOpen={markOpen}
            handleClick={handleClick}
            currentStatus={props.status}
            handleConfirm={memoizeClick}
            canEdit={
              props?.status === "consumed"
                ? false
                : props?.status === "partially applied"
                ? false
                : true
            }
            deletePermission={
              props?.status === "consumed"
                ? false
                : props?.status === "partially applied"
                ? false
                : props?.status === "open"
                ? false
                : true
            }
            title={
              props?.status === "consumed" ||
              props?.status === "partially applied" ||
              props?.status === "open"
                ? "Permission Denied"
                : "Do you really want to delete this credit note?"
            }
          />
        );
      },
    },
  ].filter((show) => !show.hide);

  return (
    <>
      <CreditNoteModal
        details={details}
        creditId={creditId}
        className={className}
        setCreditId={setCreditId}
        creditModal={creditModal}
        creditNotesData={creditNotesData}
        refetchInvoices={refetchInvoices}
        refetchCreditNotes={refetchCreditNotes}
        toggleCreditNoteModal={toggleCreditNoteModal}
      />
      {creditNotesData?.show_add_button && !isModal && (
        <div className="add_new_btn">
          <Button
            className="btn-primary btn-form-size "
            onClick={() => {
              const creditNote = creditNotesData.credit_notes.at(-1)?.status === "draft";
              if (creditNote)
                Toast({ message: "please mark credit note as open to proceed", type: "error" });
              else toggleCreditNoteModal();
            }}
          >
            <span className="add-new-btn">
              <img
                alt="plus icon"
                className="brightness mr-5 plus-icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
              />
              New
            </span>
          </Button>
        </div>
      )}
      <Table
        rowKey="id"
        columns={columns}
        pagination={false}
        className="generic-table"
        dataSource={creditNotesData?.credit_notes}
      />
    </>
  );
};
