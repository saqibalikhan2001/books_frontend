/**@format */

import { Button, Table } from "antd";
import { useAxios } from "app/Hooks";
import { TablexProps } from "./types";
import { useEffect, useState } from "react";
import { Spinner } from "./PageLoader";

export const Tablex = ({
  url,
  bool,
  from,
  rowKey,
  toggle,
  columns,
  isModal = false,
  btnText,
  onChange,
  fetchList,
  toggleModal,
  handleCreate,
  invoice = false,
  setResponseLength,
  showButton = false,
  BillsPayment = false,
  transaction = false,
  CreditRefund = false,
  PaymentRefund = false,
  invoicePayment = false,
  transactionData = false,
  AppliedOnInvoice = false,
  estimateInvoices = false,
}: TablexProps) => {
  const { callAxios } = useAxios();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<any>({
    data: [],
    button: false,
  });

  useEffect(() => {
    toggle?.();
    if (url) {
      callAxios({
        url,
      }).then((res: any) => {
        toggle?.();
        if (transaction) {
          setResponse({
            dataSource: res?.transactions,
            button: false,
          });
        } else if (transactionData) {
          setResponse({
            dataSource: res?.transactions?.data,
            button: false,
          });
        } else if (AppliedOnInvoice) {
          setResponse({
            dataSource: res?.utilize_credits_list,
            button: res?.show_button,
          });
          setResponseLength((state) => ({
            ...state,
            resonseLength: res?.utilize_credits_list?.length,
          }));
        } else if (CreditRefund) {
          setResponse({
            dataSource: res?.creditRefunds,
            button: res?.showButton,
          });
          setResponseLength((state) => ({ ...state, resonseLength: res?.creditRefunds?.length }));
        } else if (invoicePayment) {
          setResponse({
            dataSource: res.invoicePayments,
            button: false,
          });
          setResponseLength((state) => ({ ...state, resonseLength: res?.invoicePayments?.length }));
        } else if (invoice) {
          setResponse({
            dataSource: res,
            button: false,
          });
        } else if (BillsPayment) {
          setResponse({
            dataSource: res,
            button: false,
          });
          setResponseLength((state) => ({ ...state, resonseLength: res?.length }));
        } else if (estimateInvoices) {
          setResponse({
            dataSource: res.invoices,
            button: false,
          });
        } else if (PaymentRefund) {
          setResponse({
            dataSource: res.refunds,
            button: res?.showButton,
          });
          setResponseLength((state) => ({ ...state, resonseLength: res?.refunds?.length }));
        } else {
          setResponse({
            dataSource: res,
            button: false,
          });
        }
        // creditRefunds
        // if (res) {
        //   setResponse({
        //     dataSource:
        //       res.transactions?.data ||
        //       res?.transactions ||
        //       res?.refunds ||
        //       res?.invoicePayments ||
        //       res?.creditRefunds ||
        //       res?.utilize_credits_list ||
        //       res,
        //     button: res.showButton || res.show_button,
        //   });
        // }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [url, fetchList]);

  const handleButton = () => {
    toggleModal();
    handleCreate?.(true);
  };
  return (
    <>
      {(showButton || (response?.button && !isModal)) && (
        <div className="add_new_btn">
          <Button className="btn-primary btn-form-size " onClick={handleButton}>
            {btnText ? (
              btnText
            ) : (
              <span className="add-new-btn">
                <img
                  alt="add icon"
                  className="mr-5 "
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                />{" "}
                New
              </span>
            )}
          </Button>
        </div>
      )}
      <Table
        rowKey={rowKey}
        bordered={false}
        columns={columns}
        pagination={false}
        onChange={onChange}
        loading={{ spinning: bool || loading, indicator: <Spinner  directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} /> }}
        dataSource={response.dataSource || []}
        className={`generic-table no-radius transaction-subtabs ${from}`}
      />
    </>
  );
};
