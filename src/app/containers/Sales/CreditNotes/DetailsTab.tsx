/** @format */

import { useEffect, useState } from "react";
import { Form, Input, Statistic, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { Buttonx, Toast } from "app/shared";
import { CreditItemTableProps } from "./Types";
import { ItemDetailTable } from "./ItemDetailTable";

const { TextArea } = Input;

export const DetailsTab = ({ detail, setDetails, isModal }: CreditItemTableProps) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [notes, setNotes] = useState(false);
  const Notes = Form.useWatch("notes", form);
  const { checkPermission } = usePermissions();
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const { has_CreditNoteEdit_permission } = checkPermission("CreditNoteEdit");
  const remainingCredits =
    detail?.creditNote?.issued_credits -
    (detail?.creditNote?.refund_credits + detail?.creditNote?.utilize_credits);

  useEffect(() => {
    if (detail?.creditNote?.id) {
      callAxios({ url: `${endpoints.CREDIT_NOTES}/${detail?.creditNote?.id}` }).then((res) => {
        form.setFieldValue("notes", res?.creditNote?.customer_note);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [detail?.creditNote?.id]);

  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `${endpoints.CREDIT_NOTES}/${detail?.creditNote?.id}${endpoints.ESTIMATE_NOTE}`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${endpoints.CREDIT_NOTES}/${detail?.creditNote?.id}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };

  /*const SubTotal = (data) => {
    return (data?.credit_note_details.length > 0) ? data?.credit_note_details
    ?.reduce((sum, item) => {
      return sum + item?.quantity_processed * item?.invoice_item_detail?.rate;
    }, 0)
      .toFixed(2) : data?.issued_credits.toFixed(2);
  };*/
  /*const showRemainingCredits = (detail) => {
    return detail?.creditNote?.issued_credits !== detail?.creditNote?.issued_credits - (detail?.creditNote?.refund_credits + detail?.creditNote?.utilize_credits)
  }*/
  return (
    <>
      {detail?.creditNote?.credit_note_details.length > 0 && (
        <ItemDetailTable
          details={detail}
          isModal={isModal}
          tableData={detail?.creditNote?.credit_note_details}
        />
      )}
      <div className="product-details-right ">
        <div className=" d-flex justify_between gap-10 gap-md-15 res-f-wrap">
          <Form
            form={form}
            initialValues={{
              notes: detail?.creditNote?.customer_note,
            }}
            className="_items_term_and_conditions flex-md-50"
          >
            {detail?.creditNote?.terms_and_condition && (
              <div>
                <div className="product_note">
                  <Typography.Title level={5} className="fw-md color-1616">
                    Terms and conditions
                  </Typography.Title>
                </div>
                <Typography.Text className="text mb-20">
                  {detail?.creditNote?.terms_and_condition}
                </Typography.Text>
              </div>
            )}
            <div className="product-details-right ">
              <div className="d-flex justify_between align-center height">
                <Typography.Title level={5} className="fw-md clr color-dark-gray">
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
                          type="link"
                          btnText="Cancel"
                          clickHandler={() => {
                            setNotes(false);
                            form.setFieldValue("notes", detail?.creditNote?.customer_note);
                          }}
                        />
                      </div>
                    )}
                    <Buttonx
                      type="link"
                      clickHandler={handleNotes}
                      btnText={!notes ? "Edit" : "Save"}
                      className={!notes ? "edit_btn _btn" : "save_btn _btn"}
                      disabled={
                        (notes && detail?.creditNote?.customer_note === Notes?.trim()) ||
                        (imsEdit === "false"
                          ? detail?.creditNote?.platform_type !== "books"
                          : true) ||
                        !has_CreditNoteEdit_permission
                      }
                    />
                  </>
                )}
              </div>
              <Form.Item name="notes">
                <TextArea
                  rows={4}
                  showCount
                  maxLength={1000}
                  disabled={!notes}
                  className={Notes ? "text_bg_color" : ""}
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
            {/*<div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Sub Total credits
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={detail?.base_currency?.symbol}
                value={SubTotal(detail?.creditNote)}
              />
            </div>*/}
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Deductions
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={detail?.base_currency?.symbol}
                value={detail?.creditNote?.deductions || 0}
              />
            </div>
            {/* <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Discount
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={detail?.base_currency?.symbol}
                value={detail?.discount_transaction_level || 0}
              />
            </div> */}
            {/* <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Tax
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={detail?.base_currency?.symbol}
                value={
                  getSubTotalForDetails(detail?.creditNote?.credit_note_details?.tax_amount) || 0
                }
              />
            </div> */}
            {/* <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Shipping:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={detail?.shipping_charge || 0}
                prefix={detail?.base_currency?.symbol}
              />
            </div> */}
            {/* <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Adjustments
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={detail?.base_currency?.symbol}
                value={detail?.adjustment || 0}
              />
            </div> */}
            <div className="__customer_info mb-10 border-bottom">
              <Typography.Title level={5} className="fw-bold">
                Total credits
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={detail?.creditNote?.issued_credits}
                prefix={detail?.base_currency?.symbol}
              />
            </div>
            {detail?.creditNote?.utilize_credits > 0 && (
              <div className="__customer_info mb-10">
                <Typography.Title level={5} className="fw-regular">
                  Paid On Invoice(s)
                </Typography.Title>
                <Statistic
                  prefix="(-) "
                  precision={2}
                  className="no-space"
                  value={detail?.creditNote?.utilize_credits.toFixed(2) || 0}
                />
              </div>
            )}
            {detail?.creditNote?.refund_credits > 0 && (
              <div className="__customer_info mb-10">
                <Typography.Title level={5} className="fw-regular">
                  Refund
                </Typography.Title>
                <Statistic
                  prefix="(-) "
                  precision={2}
                  className="no-space"
                  style={{ color: "red" }}
                  value={detail?.creditNote?.refund_credits.toFixed(2) || 0}
                />
              </div>
            )}
            {remainingCredits !== detail?.creditNote?.issued_credits && (
              <div className="__customer_info bottom-line mb-10">
                <Typography.Title level={5} className="fw-bold">
                  Remaining Credits
                </Typography.Title>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={remainingCredits}
                  prefix={detail?.base_currency?.symbol}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
