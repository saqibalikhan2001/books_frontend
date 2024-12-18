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
  const { created_by_platform, org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const { has_BillEdit_permission } = checkPermission("BillEdit");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  useEffect(() => {
    if (details?.bill_info?.id) {
      callAxios({ url: `${endpoints.BILLS}/${details?.bill_info?.id}` }).then((res) => {
        form.setFieldValue("notes", res?.bill_info?.note);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [details?.bill_info?.id]);

  const handleNotes = () => {
    if (!notes) setNotes(!notes);
    if (notes) {
      callAxios({
        url: `${endpoints.BILLS}/${details?.bill_info?.id}/note`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${endpoints.BILLS}/${details?.bill_info?.id}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };
  return (
    <div className="d-flex justify_between user_bill_details">
      <div
        className="d-flex align-center bill_left_column"
        style={{ background: "rgb(235 243 255)" }}
      >
        <div className="bills_profile_info d-flex">
          {details?.bill_info?.vendor?.photo ? (
            <Image
              preview={false}
              className="customer-dp"
              src={ImagePath(details?.bill_info?.vendor?.photo as string, created_by_platform)}
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
          <div className="__bill_detials">
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
                    : "_display_name _customer_info_name cursor text_truncate line-clamp-2 mt-3"
                }
              >
                {details?.bill_info?.vendor?.display_name}
              </span>
            </div>
            <div className="mb-18 __customer_info">
              <img
                className="mr-10"
                alt="business icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/business.svg`}
              />
              <span className=" text_truncate line-clamp-2 mt-3">
                {details?.bill_info?.vendor?.company_name}
              </span>
            </div>
            <div className="mb-18 __customer_info">
              <img
                alt="email icon"
                className="mr-10 mail_icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/email.svg`}
              />
              <span className=" text_truncate line-clamp-2">
                {details?.bill_info?.vendor?.email}
              </span>
            </div>
            <div className="mb-18 __customer_info phone_info" style={{ alignItems: "center" }}>
              <span>
                <Icons.AiOutlinePhone size="20px" className="phone_icon" />
              </span>
              <span className=" text_truncate line-clamp-2">
                {details?.bill_info?.vendor?.work_phone}
              </span>
            </div>
            <div className="mb-18 __customer_info">
              <img
                className="mr-10"
                alt="location icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/location.svg`}
              />
              <span className=" text_truncate line-clamp-2 mt-3">
                {details?.bill_info?.billing_address &&
                  `${NaNull(details?.bill_info?.billing_address?.street)}
              ${NaNull(details?.bill_info?.billing_address?.street_2)}
              ${NaNull(details?.bill_info?.billing_address?.city)}
              ${NaNull(details?.bill_info?.billing_address?.state)}
              ${NaNull(details?.bill_info?.billing_address?.country_name)}

              `}
              </span>
            </div>
          </div>
        </div>
        <Form
          form={form}
          initialValues={{
            notes: details?.bill_info?.note,
          }}
          className="_items_term_and_conditions"
        >
          <div className="product-details-right ">
            <div className="d-flex justify_between align-center height">
              <Typography.Title level={5} className="fw-md clr">
                Memo
              </Typography.Title>
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
                      form.setFieldValue("notes", details?.bill_info?.note);
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
                  (notes && details?.bill_info?.note === Notes?.trim()) ||
                  (imsEdit === "false" ? details?.bill_info?.platform_type !== "books" : true) ||
                  isModal ||
                  !has_BillEdit_permission
                }
              />
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
          {/* <div className="">
            <div className="mb-20 __customer_info">
              <span className="_display_name">{details?.bill_info?.vendor?.display_name}</span>
            </div>

            <div className="mb-20 __customer_info">
              <span>{details?.bill_info?.vendor?.company_name}</span>
            </div>

            <div className="mb-20 __customer_info">
              <span>{details?.bill_info?.billing_address?.country_name}</span>
            </div>
          </div> */}
          <div className="w-100">
            <div className="__customer_info">
              <span className="fw-md info_detail">Reference number:</span>
              <span className="truncate-2">{details?.bill_info?.reference}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Issue date:</span>{" "}
              <span>{getOrganizationDate(details?.bill_info?.bill_date, org_date_format)}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Due date:</span>
              <span>{getOrganizationDate(details?.bill_info?.due_date, org_date_format)}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Payment terms:</span>
              <span>{details?.bill_info?.invoice_term_name}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Created by:</span>
              <span>{details?.bill_info?.bill_created_by?.name}</span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Total:</span>
              <span>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount"
                  valueStyle={{ fontSize: "14px" }}
                  value={details?.bill_info?.total}
                  prefix={details?.base_currency?.symbol}
                />
              </span>
            </div>
            <div className="__customer_info">
              <span className="fw-md info_detail">Balance:</span>
              <span>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount"
                  valueStyle={{ fontSize: "14px" }}
                  value={details?.bill_info?.balance_due}
                  prefix={details?.base_currency?.symbol}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
