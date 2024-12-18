/**@format */

import { useEffect, useState } from "react";
import { Form, Statistic, Typography, Input } from "antd";
import { endpoints } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { getSubTotalForDetails } from "utils";
import { DetailInvoiceTableProps } from "./Types";
import { Buttonx, InvoiceItemDetailTable, Toast } from "app/shared";
import { getOverallTaxDetails, getSubTotalForInvBills } from "utils/calculation";

const { TextArea } = Input;

export const DetailInvoiceTable = ({ details, isModal, setDetails }: DetailInvoiceTableProps) => {
  const { checkPermission } = usePermissions();
  const { has_InvoiceEdit_permission } = checkPermission("InvoiceEdit");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const { INVOICES } = endpoints;
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [notes, setNotes] = useState(false);
  const Note = Form.useWatch("notes", form);
  useEffect(() => {
    if (details?.invoice_info?.id) {
      callAxios({ url: `${INVOICES}/${details?.invoice_info?.id}` }).then((res) => {
        form.setFieldValue("notes", res?.invoice_info?.note);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [details?.invoice_info?.id]);

  const handleDisplaydiscount = () => {
    let discount: number;
    if (details?.invoice_info?.discount_type === "percent") {
      discount =
        (getSubTotalForDetails(details?.invoice_info?.invoice_details) *
          details?.invoice_info?.discount_transaction_level) /
        100;
      return discount;
    } else return details?.invoice_info?.discount_transaction_level || 0;
  };

  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `${endpoints.INVOICES}/${details?.invoice_info?.id}${endpoints.INVOICES_NOTE}`,
        method: "put",
        data: { notes: Note },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${endpoints.INVOICES}/${details?.invoice_info?.id}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };

  const TaxImplemented = details?.invoice_info?.invoice_details.some(
    (obj) => obj.tax_amount !== null
  );

  return (
    <>
      <InvoiceItemDetailTable
        details={details}
        tableData={details?.invoice_info?.invoice_details}
        isModal={isModal}
      />
      <div className="product-details-right ">
        <div className=" d-flex justify_between flex-md-column-reverse res-gap">
          <Form
            form={form}
            initialValues={{
              notes: details?.invoice_info?.note,
            }}
            className="_items_term_and_conditions"
          >
            {details?.invoice_info?.terms_and_condition && (
              <div>
                <div className="product_note">
                  <Typography.Title level={5} className="fw-md">
                    Terms and conditions
                  </Typography.Title>
                </div>
                <Typography.Text className="text mb-20">
                  {details?.invoice_info?.terms_and_condition}
                </Typography.Text>
              </div>
            )}
            <div className="product-details-right mb-10">
              <div className="d-flex justify_between align-center ">
                <Typography.Title level={5} className="fw-md color-dark-gray">
                  Memo
                </Typography.Title>
                {!isModal && (
                  <>
                    {notes && (
                      <div className="note_cancel_btn">
                        <Buttonx
                          style={{
                            marginBottom: 0,
                          }}
                          btnText="Cancel"
                          type="link"
                          clickHandler={() => {
                            setNotes(false);
                            form.setFieldValue("notes", details?.invoice_info?.note);
                          }}
                        />
                      </div>
                    )}
                    <Buttonx
                      type="link"
                      style={{
                        marginBottom: 0,
                      }}
                      clickHandler={handleNotes}
                      btnText={!notes ? "Edit" : "Save"}
                      className={!notes ? "edit_btn _btn" : "save_btn _btn"}
                      disabled={
                        (notes && details?.invoice_info?.note === Note?.trim()) ||
                        (imsEdit === "false"
                          ? details?.invoice_info?.platform_type !== "books"
                          : true) ||
                        !has_InvoiceEdit_permission
                      }
                    />
                  </>
                )}
              </div>
              <Form.Item name="notes">
                <TextArea
                  rows={4}
                  className={Note ? "text_bg_color" : ""}
                  showCount
                  maxLength={1000}
                  disabled={!notes}
                  onChange={(e: any) => {
                    const { value } = e.target;
                    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                    form.setFieldValue("notes", formattedValue);
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <div className="_item_details_summary_sec">
            <div className="__customer_info mb-10 border-bottom">
              <Typography.Title level={5} className="fw-bold">
                Subtotal:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={details?.invoice_info?.base_currency?.symbol}
                value={
                  getSubTotalForInvBills(
                    details?.invoice_info?.invoice_details,
                    details?.invoice_info?.discount_level
                  ) || 0
                }
              />
            </div>

            {TaxImplemented &&
              getOverallTaxDetails(details?.invoice_info?.invoice_details)?.flatMap((item: any) => (
                <div className="__customer_info mb-10" key={item?.id}>
                  <Typography.Title level={5} className="fw-regular">
                    {`${item.name} (${item.rate}%)`}:
                  </Typography.Title>
                  <Statistic
                    precision={2}
                    className="no-space"
                    prefix={details?.invoice_info?.base_currency?.symbol}
                    value={item?.total || 0}
                  />
                </div>
              ))}
            {details?.invoice_info?.discount_level === "transaction" && (
              <div className="__customer_info mb-10">
                <Typography.Title level={5} className="fw-regular">
                  {`Discount:${
                    details?.invoice_info?.discount_type == "percent"
                      ? `(${details?.invoice_info?.discount_transaction_level}%)`
                      : ""
                  }`}
                </Typography.Title>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={handleDisplaydiscount()}
                  prefix={`(-) ${details?.invoice_info?.base_currency?.symbol}`}
                />
              </div>
            )}
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Adjustments:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.invoice_info?.adjustment || 0}
                prefix={details?.invoice_info?.base_currency?.symbol}
              />
            </div>
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Shipping & Handling:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.invoice_info?.shipping_charge || 0}
                prefix={details?.invoice_info?.base_currency?.symbol}
              />
            </div>
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Total:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.invoice_info?.total}
                prefix={details?.invoice_info?.base_currency?.symbol}
              />
            </div>
            {details?.invoice_info?.payment_made > 0 && (
              <div className="__customer_info  mb-10">
                <Typography.Title level={5} className="fw-regular">
                  Payment Made:
                </Typography.Title>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={details?.invoice_info?.payment_made}
                  prefix={`(-) ${details?.invoice_info?.base_currency?.symbol}`}
                />
              </div>
            )}
            {details?.invoice_info?.payment_via_credits > 0 && (
              <div className="__customer_info mb-10">
                <Typography.Title level={5} className="fw-regular">
                  Credits Applied:
                </Typography.Title>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={details?.invoice_info?.payment_via_credits}
                  prefix={`(-) ${details?.invoice_info?.base_currency?.symbol}`}
                />
              </div>
            )}
            <div className="__customer_info bottom-line mb-10">
              <Typography.Title level={5} className="fw-bold">
                Balance Due:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.invoice_info?.payment_due || 0}
                prefix={details?.invoice_info?.base_currency?.symbol}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
