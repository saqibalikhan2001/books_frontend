import { useEffect, useState } from "react";
import { Form, Image, Input, Statistic, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, usePermissions, useStore } from "app/Hooks";
import { Buttonx, Icons, Toast } from "app/shared";
import { ImagePath, NaNull, getOrganizationDate } from "utils";

const { TextArea } = Input;

export const DetailTopSection = ({
  details,
  isModal,
  setDetails,
  toggleCustomerDetailModal,
}: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [notes, setNotes] = useState(false);
  const Notes = Form.useWatch("notes", form);
  const { checkPermission } = usePermissions();
  const { created_by_platform, org_date_format } = useStore();
  const { has_BillPaymentRecordEdit_permission } = checkPermission("BillPaymentRecordEdit");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  useEffect(() => {
    if (details?.bill?.id) {
      callAxios({ url: `${endpoints.BILL_PAYMENTS_RECORDS}/${details?.id}` }).then((res) => {
        form.setFieldValue("notes", res.note);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [details?.bill?.id]);
  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `${endpoints.BILL_PAYMENTS}/${details?.id}/note`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({ url: `${endpoints.BILL_PAYMENTS_RECORDS}/${details?.id}` }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };

  return (
    <div className="d-flex justify_between user_bill_details billpayments--wrapper">
      <div
        className="d-flex align-center bill_left_column"
        style={{ background: "rgb(235 243 255)" }}
      >
        <div className="bills_profile_info d-flex">
          {details?.bill?.vendor?.photo ? (
            <Image
              preview={false}
              className="customer-dp"
              src={ImagePath(details?.bill?.vendor?.photo as string, created_by_platform)}
            />
          ) : (
            <div className="user_default_image">
              <img
                alt="user icon"
                className="user_profile_icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                  import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                }`}
              />
            </div>
          )}
          <div className="__bill_payment_detials">
            <div className="mb-18 __customer_info">
              <img
                alt="user icon"
                className="mr-10"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/user.svg`}
              />
              <span
                onClick={() => !isModal && toggleCustomerDetailModal()}
                className={
                  isModal
                    ? "_display_name"
                    : "_display_name _customer_info_name cursor text_truncate line-clamp-2"
                }
              >
                {details?.bill?.vendor?.display_name}
              </span>
            </div>
            <div className="mb-18 __customer_info">
              <img
                className="mr-10"
                alt="business icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/business.svg`}
              />
              <span className=" text_truncate line-clamp-2">
                {details?.bill?.vendor?.company_name}
              </span>
            </div>
            <div className="mb-18 __customer_info">
              <img
                alt="email icon"
                className="mr-10 mail_icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/email.svg`}
              />
              <span className=" text_truncate line-clamp-2">{details?.bill?.vendor?.email}</span>
            </div>
            <div className="mb-18 __customer_info">
              <Icons.AiOutlinePhone size="22px" />
              <span className=" text_truncate line-clamp-2">
                {details?.bill?.vendor?.work_phone}
              </span>
            </div>
            <div className="__customer_info">
              <img
                className="mr-10"
                alt="location icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/location.svg`}
              />
              <span className=" text_truncate line-clamp-2">
                {details?.bill?.billing_address &&
                  `${NaNull(details?.bill?.billing_address?.street)}
              ${NaNull(details?.bill?.billing_address?.street_2)}
              ${NaNull(details?.bill?.billing_address?.city)}
              ${NaNull(details?.bill?.billing_address?.state)}
              ${NaNull(details?.bill?.billing_address?.country_name)}

              `}
              </span>
            </div>
          </div>
        </div>
        <Form
          form={form}
          initialValues={{
            notes: details?.note,
          }}
          className="_items_term_and_conditions"
        >
          <div className="product-details-right ">
            <div className="d-flex justify_between align-center height">
              <Typography.Title level={5} className="fw-md clr">
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
                          form.setFieldValue("notes", details?.note);
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
                      (notes && details?.bill?.note === Notes?.trim()) ||
                      (imsEdit === "false" ? details?.platform_type !== "books" : true) ||
                      !has_BillPaymentRecordEdit_permission
                    }
                  />
                </>
              )}
            </div>
            <Form.Item name="notes">
              <TextArea
                rows={5}
                showCount
                maxLength={1000}
                disabled={!notes}
                style={{ height: "108px" }}
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
      </div>
      <div className="bill_right_column" style={{ background: "rgb(235 243 255)" }}>
        <div className="d-flex justify_between bill_customer_info">
          <div className="w-100">
            <div className="__customer_info">
              <span className="fw-md info_detail">Reference number:</span>
              <span className="truncate-2">{details?.reference}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Bill number:</span>{" "}
              <span>{details?.bill?.bill_no}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Payment date:</span>
              <span>{getOrganizationDate(details?.payment_date, org_date_format)}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Payment method:</span>
              <span>{details?.payment_mode}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Amount paid:</span>
              <span>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount"
                  value={details?.payment_made}
                  valueStyle={{ fontSize: "14px" }}
                  prefix={details?.currency?.symbol}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
