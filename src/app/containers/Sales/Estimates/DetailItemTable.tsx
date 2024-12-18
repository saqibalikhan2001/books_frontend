/** @format */

import { useState, useEffect } from "react";
import { Form, Input, Statistic, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { getOverallTaxDetails, getSubTotalForDetails } from "utils";
import { DetailEstimateTableProps } from "./Types";
import { Buttonx, ItemDetailTable, Toast } from "app/shared";

const { TextArea } = Input;

export const DetailItemTable = ({ details, setDetails, isModal }: DetailEstimateTableProps) => {
  const { checkPermission } = usePermissions();

  const { has_EstimatesEdit_permission } = checkPermission("EstimatesEdit");

  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [notes, setNotes] = useState(false);
  const { ESTIMATES } = endpoints;

  const Notes = Form.useWatch("notes", form);
  useEffect(() => {
    if (details?.id) {
      callAxios({ url: `${ESTIMATES}/${details?.id}` }).then((res) => {
        form.setFieldValue("notes", res?.customer_note);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [details?.id]);

  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `${endpoints.ESTIMATES}/${details?.id}${endpoints.ESTIMATE_NOTE}`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${endpoints.ESTIMATES}/${details?.id}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };
  const handleDisplaydiscount = () => {
    let discount: number;
    if (details?.discount_type === "percent") {
      discount =
        (getSubTotalForDetails(details?.invoice_details || details?.estimates_details) *
          details?.discount_transaction_level) /
        100;

      return discount;
    } else return details?.discount_transaction_level || 0;
  };
  const TaxImplemented = details?.estimates_details?.some((obj) => obj.tax_amount !== null);

  return (
    <>
      <ItemDetailTable isModal={isModal} details={details} tableData={details.estimates_details} />
      <div className="product-details-right estimate--product__detail ">
        <div className=" d-flex justify_between gap-10 gap-md-15 res-f-wrap">
          <Form
            form={form}
            initialValues={{
              notes: details?.customer_note,
            }}
            className="_items_term_and_conditions"
          >
            {details?.terms_and_condition && (
              <div>
                <div className="product_note">
                  <Typography.Title level={5} className="fw-md color-1616">
                    Terms and conditions
                  </Typography.Title>
                </div>
                <Typography.Text className="text mb-20">
                  {details?.terms_and_condition}
                </Typography.Text>
              </div>
            )}
            <div className="product-details-right">
              <div className="d-flex justify_between align-center">
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
                            form.setFieldValue("notes", details?.customer_note);
                          }}
                        />
                      </div>
                    )}
                    <Buttonx
                      style={{
                        marginBottom: 0,
                      }}
                      type="link"
                      clickHandler={handleNotes}
                      btnText={!notes ? "Edit" : "Save"}
                      className={!notes ? "edit_btn _btn" : "save_btn _btn"}
                      disabled={
                        (notes && details?.customer_note === Notes?.trim()) ||
                        details?.platform_type !== "books" ||
                        !has_EstimatesEdit_permission
                      }
                    />
                  </>
                )}
              </div>
              <Form.Item name="notes">
                <TextArea
                  rows={4}
                  className={Notes ? "text_bg_color" : ""}
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
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Subtotal:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={details?.base_currency?.symbol}
                value={getSubTotalForDetails(details?.estimates_details) || 0}
              />
            </div>
            {TaxImplemented &&
              getOverallTaxDetails(details?.estimates_details)?.flatMap((item: any) => (
                <div className="__customer_info mb-10" key={item?.id}>
                  <Typography.Title level={5} className="fw-regular">
                    {`${item.name} (${item.rate}%)`}:
                  </Typography.Title>
                  <Statistic
                    precision={2}
                    className="no-space"
                    prefix={details?.base_currency?.symbol}
                    value={item?.total || 0}
                  />
                </div>
              ))}
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Shipping & Handling:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.shipping_charge || 0}
                prefix={details?.base_currency?.symbol}
              />
            </div>
            {details?.discount_level !== "item" && (
              <div className="__customer_info mb-10 no-border">
                <Typography.Title level={5} className="fw-regular">
                  Discount:
                </Typography.Title>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={handleDisplaydiscount()}
                  prefix={details?.base_currency?.symbol}
                />
              </div>
            )}
            <div className="__customer_info mb-10 bottom-line">
              <Typography.Title level={5} className="fw-bold">
                Estimate total:
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.total}
                prefix={details?.base_currency?.symbol}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
