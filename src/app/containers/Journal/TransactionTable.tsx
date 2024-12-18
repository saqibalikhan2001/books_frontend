import React, { useState } from "react";
import { Statistic, Typography } from "antd";
import { useStore } from "app/Hooks";
import { ContactModal, Spinner } from "app/shared";
import { getOrganizationDate } from "utils";
import { BillsDetailModal } from "../Purchases/Bills/BillsDetailModal";
import { RefundDetailModal } from "../Sales/Refund/RefundDetailModal";
import { InvoiceDetailModal } from "../Sales/Invoices/InvoiceDetailModal";
import { ContactDetailModal } from "../Sales/Customers/ContactDetailModal";
import { INVPaymentDetailModal } from "../Sales/Invoices/INVPayments/DetailModal";
import { CreditNoteDetailModal } from "../Sales/CreditNotes/CreditNoteDetailModal";
import { BillsPaymentDetailModal } from "../Purchases/BillsPayments/BillsPaymentDetailModal";
import { PaymentReceivedDetailModal } from "../Sales/PaymentsReceived/PaymentsReceivedDetailModal";
import InfiniteScroll from "react-infinite-scroll-component";

const TransactionTable = ({ transactions = [], loadProducts, page, last_page }: any) => {
  const { org_date_format } = useStore();
  const [rowData, setRowData] = useState<any>(null);
  const [contactModal, setContactModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const toggleDetailModal = () => setDetailModal(!detailModal);
  const toggleContactModal = () => setContactModal(!contactModal);

  const detailModalComponents = {
    bills: BillsDetailModal,
    contact: ContactDetailModal,
    invoice: InvoiceDetailModal,
    "credit-refund": RefundDetailModal,
    "credit-notes": CreditNoteDetailModal,
    "bill-payment": BillsPaymentDetailModal,
    "invoice-payment": INVPaymentDetailModal,
    "payment-receipt": PaymentReceivedDetailModal,
  };
  const DetailModalComponent = detailModalComponents[rowData?.module_type];
  return (
    <>
      {rowData && DetailModalComponent && (
        <DetailModalComponent
          isModal
          from="journal"
          bool={detailModal}
          toggle={toggleDetailModal}
          detail={{ id: rowData?.subject_id }}
          journalModal
        />
      )}
      {rowData && contactModal && (
        <ContactModal
          supplier={
            rowData?.module_type === "bills" ||
            rowData?.module_type === "bill-payment" ||
            rowData?.module_type === "supplier"
          }
          bool={contactModal}
          toggle={toggleContactModal}
          detail={{ id: rowData?.contact_id }}
        />
      )}
      <div className="table-wrapper journal_item_table">
        <InfiniteScroll
          dataLength={transactions?.length || 0}
          next={loadProducts}
          hasMore={last_page >= page}
          loader={
            <div style={{ width: "100%", textAlign: "center" }}>
              {/* <Spin size="small" style={{ padding: "0 12px" }} /> */}
              <Spinner size={"100px"} />
            </div>
          }
          height={400}
          className="table_inner"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <table className="journal-tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction type</th>
                <th>Num</th>
                <th style={{ width: 260 }}>Name</th>
                <th>Narration</th>
                <th>Account</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    {transaction?.transaction_date
                      ? getOrganizationDate(transaction?.transaction_date, org_date_format)
                      : ""}
                  </td>
                  <td>{transaction?.transaction_type}</td>
                  <td>
                    <Typography
                      style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
                      className="number-truncate"
                      onClick={() => {
                        setRowData(transaction);
                        toggleDetailModal();
                      }}
                    >
                      {transaction?.subject}
                    </Typography>
                  </td>
                  <td>
                    <span
                      className="name-truncate"
                      style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
                      onClick={() => {
                        setRowData(transaction);
                        toggleContactModal();
                      }}
                    >
                      {transaction?.display_name}
                    </span>
                  </td>
                  <td>{transaction?.notes}</td>
                  <td colSpan={3}>
                    <div>
                      {transaction?.journal_entry.map((journal, subIndex) => (
                        <div
                          key={subIndex}
                          // className="d-flex justify_between tble-summary-bottom"
                          className={`d-flex justify_between ${
                            journal?.type === "credit" ? "tble-summary-bottom" : "tble-summary-top"
                          }`}
                        >
                          <div style={{ paddingRight: 10, width: "50%" }}>
                            <Typography>{journal?.account?.title}</Typography>
                          </div>
                          <div>
                            <Statistic
                              precision={2}
                              className="no-space"
                              value={journal?.amount || 0}
                              prefix={transaction?.symbol}
                              valueStyle={{ fontSize: "14px", display:"flex"}}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="before-div">
                        <div className="before-div-total">
                          <Statistic
                            precision={2}
                            prefix={transaction?.symbol}
                            value={transaction?.total_debit || 0}
                            className="no-space no-space-first text-right value-align-right "
                            valueStyle={{ fontSize: "14px", fontWeight: "500",display:"flex" }}
                          />

                          <Statistic
                            precision={2}
                            className="no-space no-space-second"
                            prefix={transaction?.symbol}
                            value={transaction?.total_credit || 0}
                            valueStyle={{ fontSize: "14px", fontWeight: "500",display:"flex" }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default TransactionTable;
