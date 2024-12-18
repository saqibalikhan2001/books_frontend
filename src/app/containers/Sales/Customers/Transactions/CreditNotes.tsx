/** @format */

import { useMemo, useState } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";
// import { useNavigate } from "react-router";
import { CreditNoteDetailModal } from "../../CreditNotes/CreditNoteDetailModal";

const { DATE, CREDIT_NOTE, INVOICE, CREDIT, STATUS } = Labels;

const CreditNotes = ({ url }: { url: string }) => {
  const [creditModal, setCreditModal] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const { org_date_format } = useStore();
  // const navigate = useNavigate();
  const toggleCreditModal = () => setCreditModal(!creditModal);

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "credit_note_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (credit_note_date: string) =>
          getOrganizationDate(credit_note_date, org_date_format),
      },
      {
        title: CREDIT_NOTE,
        dataIndex: "credit_note_no",
        key: CREDIT_NOTE,
        width: 100,
        ellipsis: true,
        render: (text, record) => {
          return (
            <span
              style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
              onClick={() => {
                setRowData(record);
                toggleCreditModal();
                // navigate(`/creditnotes/${record.id}`);
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: INVOICE,
        dataIndex: "invoice_no",
        key: INVOICE,
        width: 100,
        ellipsis: true,
      },
      {
        title: CREDIT,
        dataIndex: "issued_credits",
        key: CREDIT,
        width: 100,
        className: "text-right",
        ellipsis: true,
        render: (issued_credits: number, cn: any) => (
          <>{`${cn?.symbol}${issued_credits.toFixed(2)}`}</>
        ),
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 100,
        ellipsis: true,
        render: (content_type) => (
          <Tag
            className={`generic-badge ${
              content_type === "partially applied" ? "partially-applied" : content_type
            }`}
            autoCapitalize=""
            key={content_type}
          >
            {capitalize(content_type === "partially applied" ? "PRTL Applied" : content_type)}
          </Tag>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <CreditNoteDetailModal
        isModal
        bool={creditModal}
        detail={rowData}
        toggle={toggleCreditModal}
      />
      <Tablex
        transaction
        rowKey="credit_note_no"
        columns={memoColumns}
        url={`${url}?filter=credit_notes`}
      />
    </div>
  );
};

export default CreditNotes;
