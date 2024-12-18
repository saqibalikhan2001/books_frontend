/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Form, Image, Input, Popconfirm, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import Overview from "./Overview";
import Statement from "./Statement";
import { MenuProps } from "antd/lib/menu";
import { Addresses } from "./AddressTab";
import { TooltipX } from "app/shared/ToolTip";
import { endpoints, routeNames } from "static";
import { PageHeader } from "@ant-design/pro-layout";
import Transactions from "./Transactions/Transactions";
import { useAxios, usePermissions, useStore } from "app/Hooks";
import { CustomerDetailPageProps, DetailsProps } from "./Types";
import { getFullDate, getKeyFromSS, handleTabChange, ImagePath } from "utils";
import { Email, Toast, Buttonx, Spinner, Processing, ActivityLog, Breadcrumbx } from "app/shared";

const todayDate = dayjs(new Date());
const { CUSTOMERS, SUPPLIERS, ACTIVITY } = endpoints;

const DetailPage = ({
  email,
  detail,
  refetch,
  setFalse,
  setEmail,
  emailLoading,
  handleConfirm,
  isModal = false,
  loading = false,
  // supplier = false,
  handleFullScreen,
  detailpage = false,
}: CustomerDetailPageProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [note, setNote] = useState(false);
  const { created_by_platform } = useStore();
  const [loader, setLoader] = useState(true);
  const { checkPermission } = usePermissions();
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [uploading, setUploading] = useState(false);
  const [details, setDetails] = useState<DetailsProps>();
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");
  const { has_CustomerDelete_permission } = checkPermission("CustomerDelete");
  const { has_SupplierDelete_permission } = checkPermission("SupplierDelete");
  const { has_CreditNoteCreate_permission } = checkPermission("CreditNoteCreate");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  let supplier = details?.contact_type === "vendor";
  const has_delete_permission = supplier
    ? has_SupplierDelete_permission
    : has_CustomerDelete_permission;
  let deletePermission = (imsEdit === "false" ? details?.platform_type === "books" : true)
    ? has_delete_permission
    : false;

  const [isDate, setIsDate] = useState<any>({
    to: "",
    from: "",
    url: false,
  });
  const Note = Form.useWatch("note", form);
  const CurrentDate = getFullDate(todayDate as any);
  const current_balance = supplier
    ? details?.transaction_summary?.total_payable?.toFixed(2)
    : details?.transaction_summary?.total_receivable?.toFixed(2);
  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${supplier ? SUPPLIERS : CUSTOMERS}/${
          detailpage ? detail?.id : localObj?.curr_id ?? detail?.id
        }`,
        deploymentTime: true,
      })
        .then((res) => {
          setDetails(res);
          setFalse?.(false);
          form.setFieldValue("note", res?.note);
          setLoader(false);
        })
        .catch(() => setLoader(false));
    }
    return () => {
      setEmail?.(false);
    };
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id]);

  useEffect(() => {
    if (sessionEmail) setEmail?.(true);
    else setEmail?.(false);
  }, [sessionEmail]);

  const hanldeNoteSave = () => {
    if (!note) setNote(!note);

    if (note) {
      callAxios({
        url: `${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}/contact_note`,
        method: "put",
        data: { notes: Note },
      }).then((res) => {
        if (res) {
          setNote(!note);
          callAxios({
            url: `${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res?.message });
        }
      });
    }
  };

  const handleEmail = () => setEmail(!email);

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: "Clone",
      onClick: () =>
        navigate(
          `${supplier ? routeNames.SUPPLIER_CLONE : routeNames.CUSTOMER_CLONE}?id=${details?.id}`
        ),
    },
    {
      key: "1",
      label: "Email",
      onClick: email ? () => null : handleEmail,
    },
    {
      key: "2",
      label: (
        <Popconfirm
          key="confirm"
          cancelText="No"
          placement="left"
          onCancel={(e) => e?.stopPropagation()}
          overlayClassName="delete-customer-popover"
          showCancel={!details?.has_transaction && deletePermission}
          disabled={
            !(
              (imsEdit === "false" ? details?.platform_type === "books" : true) &&
              has_delete_permission
            )
          }
          okText={!details?.has_transaction && deletePermission ? "YES" : "Ok"}
          getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
          title={
            !details?.has_transaction
              ? (imsEdit === "false" ? details?.platform_type === "books" : true) &&
                has_delete_permission
                ? `Are you sure you want to delete "${details?.display_name}"?`
                : "Permission Denied"
              : `You cannot delete ${supplier ? "supplier" : "customer"} having transactions`
          }
          onConfirm={(e) => {
            e?.stopPropagation();
            !details?.has_transaction && deletePermission && handleConfirm?.(details);
          }}
        >
          <label
            style={{
              cursor:
                (imsEdit === "false" ? details?.platform_type === "books" : true) &&
                has_delete_permission
                  ? "pointer"
                  : "not-allowed",
              width: "100%",
              display: "block",
            }}
            onClick={(e) => e?.stopPropagation()}
          >
            Delete
          </label>
        </Popconfirm>
      ),
      disabled: !(
        (imsEdit === "false" ? details?.platform_type === "books" : true) && has_delete_permission
      ),
    },
  ];
  const transactions: MenuProps["items"] = [
    {
      key: "0",
      label: "Invoice",
      onClick: () => navigate("/invoice-new", { state: { customerDetail: details } }),
      disabled: !has_InvoiceCreate_permission,
    },
    {
      key: "1",
      label: "Credit note",
      onClick: () => navigate("/new-credit-note", { state: { customerDetail: details } }),
      disabled: !has_CreditNoteCreate_permission,
    },
    // {
    //   key: "2",
    //   label: "Bill",
    //   disabled: true,
    //   className: "disabled-option",
    // },
    // {
    //   key: "3",
    //   label: "Vendor credit",
    //   disabled: true,
    //   className: "disabled-option",
    // },
  ];
  const supplier_transactions: MenuProps["items"] = [
    {
      key: "0",
      label: "Bill",
      // disabled: true,
      // className: "disabled-option",
      onClick: () => navigate("/new-bill", { state: { customerDetail: details } }),
    },
    // {
    //   key: "1",
    //   label: "Supplier credit",
    //   disabled: true,
    //   className: "disabled-option",
    // },
    // {
    //   key: "2",
    //   label: "Make payment",
    //   disabled: true,
    //   className: "disabled-option",
    // },
    // {
    //   key: "3",
    //   label: "Expense",
    //   disabled: true,
    //   className: "disabled-option",
    // },
  ];
  const handleNote = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    form.setFieldValue("note", formattedValue);
  };
  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetch}
        handleFullScreen={handleFullScreen}
        moduleName={supplier ? "Suppliers" : "Customers"}
      />
      <div className="customer_title"> {details?.display_name}</div>
    </div>
  );
  return (
    <>
      {loader || loading || emailLoading ? (
        <Spinner />
      ) : (
        <div
          style={
            isModal
              ? {}
              : {
                  animation: "fadeInRight",
                  animationDuration: "0.3s",
                  pointerEvents: uploading ? "none" : "auto",
                }
          }
        >
          <PageHeader
            className={`__items_details_header __customer-details--main ${
              uploading ? "uploading" : ""
            }`}
            title={titleElement}
            extra={
              isModal
                ? []
                : [
                    <div className="__items_details_actions item_detail_header_actions">
                      <Dropdown.Button
                        menu={{ items }}
                        trigger={["click"]}
                        className="btn-edit"
                        overlayStyle={{ minWidth: 120 }}
                        disabled={
                          imsEdit === "false" && details?.platform_type !== "books" ? true : false
                        }
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                        icon={
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/dropdown.svg`}
                            alt="arrow icon"
                          />
                        }
                        onClick={() =>
                          navigate(
                            `${supplier ? routeNames.EDIT_SUPPLIER : routeNames.EDIT_CUSTOMER}?id=${
                              details?.id
                            }`
                          )
                        }
                      >
                        Edit
                      </Dropdown.Button>

                      <Dropdown
                        trigger={["click"]}
                        disabled={details?.is_active === 0}
                        menu={{ items: supplier ? supplier_transactions : transactions }}
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                      >
                        <div
                          className="btn-primary btn-trascation generic-dropdown-icon"
                          style={{ cursor: details?.is_active === 0 ? "not-allowed" : "" }}
                        >
                          New transaction
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/dropdown.svg`}
                            alt="dropdown"
                            className=" ml-10"
                          />
                        </div>
                      </Dropdown>
                    </div>,
                  ]
            }
            footer={
              <>
                <div className="__main_content_side">
                  {!email && (
                    <div className="__items-details_container mb-22 customer--details">
                      <div className="product-details d-flex">
                        <div className="product-details-left img_holder">
                          {details?.photo ? (
                            <Image
                              preview={false}
                              className="customer-dp"
                              src={ImagePath(details?.photo as string, created_by_platform)}
                            />
                          ) : (
                            <div className="user_default_image">
                              <img
                                className="user_profile_icon"
                                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                  import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                                }`}
                                alt="user icon"
                              />
                            </div>
                          )}
                        </div>
                        <div className="customer-liscence-note">
                          <div className="internal_fixer">
                            <div className=" mb-20">
                              <Typography.Text className="stock-heading">
                                License number
                              </Typography.Text>
                              <Typography.Text className="stock-dues">
                                {details?.license_no && details?.license_no !== "null"
                                  ? details?.license_no
                                  : "Not Allocated"}
                              </Typography.Text>
                            </div>
                            <div className="product-details-right">
                              <div className={`d-flex product_note ${isModal ? "mb-10" : ""}`}>
                                <Typography.Text className=" details-notes">Notes</Typography.Text>
                                {!isModal && (
                                  <>
                                    {note && (
                                      <div className="note_cancel_btn">
                                        <Buttonx
                                          type="link"
                                          btnText="Cancel"
                                          clickHandler={() => {
                                            form.setFieldValue("note", details?.note);
                                            setNote(false);
                                          }}
                                        />
                                      </div>
                                    )}
                                    <Buttonx
                                      type="link"
                                      clickHandler={hanldeNoteSave}
                                      btnText={!note ? "Edit" : "Save"}
                                      className={
                                        !note
                                          ? "edit_btn btn-base-style"
                                          : "save_btn btn-base-style"
                                      }
                                      disabled={
                                        (note && details?.note === Note?.trim()) ||
                                        isModal ||
                                        (imsEdit === "false" && details?.platform_type !== "books"
                                          ? true
                                          : false)
                                      }
                                    />
                                  </>
                                )}
                              </div>
                              <Form form={form}>
                                <div className={Note ? "text_bg_color" : ""}>
                                  <Form.Item name="note">
                                    <Input.TextArea
                                      rows={4}
                                      showCount
                                      disabled={!note}
                                      maxLength={1000}
                                      onChange={handleNote}
                                    />
                                  </Form.Item>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>

                        <div className="product_arrangement">
                          <div className="product-details-center mb-30">
                            <Typography.Text className="stock-heading">
                              Current balance
                              <TooltipX
                                placement={"left"}
                                title={`Your current balance is ${details?.currency?.symbol}${current_balance}`}
                              >
                                <img
                                  className="ml-10 hover-effect"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/tooltip.svg`}
                                  alt="tooltip icon"
                                />
                              </TooltipX>
                            </Typography.Text>
                            <Typography.Text className="stock-dues">
                              {details?.currency?.symbol}
                              {current_balance}
                            </Typography.Text>
                          </div>
                          <div className="product-details-center mb-30">
                            <Typography.Text className="stock-heading">
                              {!supplier ? "Credits Available" : "Total Payable"}
                            </Typography.Text>
                            <Typography.Text className="stock-dues">
                              {details?.currency?.symbol}
                              {details?.unused_credits}
                            </Typography.Text>
                          </div>
                          <div className="product-details-center">
                            <Typography.Text className="stock-heading">
                              Origin
                              <TooltipX
                                placement={"left"}
                                title={`The origin of this ${
                                  supplier ? "supplier" : "customer"
                                } is ${details?.platform_type === "ims" ? "IMS" : "BOOKS"}`}
                              >
                                <img
                                  className="ml-10 hover-effect"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/tooltip.svg`}
                                  alt="tooltip icon"
                                />
                              </TooltipX>
                            </Typography.Text>
                            <Typography.Text className="stock-dues">
                              {details?.platform_type === "ims" ? "IMS" : "BOOKS"}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                      {uploading && <Processing />}
                    </div>
                  )}
                  {email ? (
                    <Email
                      setEmail={setEmail}
                      handleEmail={handleEmail}
                      emailUrl={
                        isDate.url
                          ? `${supplier ? SUPPLIERS : CUSTOMERS}${isDate.url ? "/statement" : ""}/${
                              details?.id
                            }/mail/${`${isDate.from ? isDate.from : CurrentDate} 00:00:00`}/${`${
                              isDate.to ? isDate.to : CurrentDate
                            } 23:59:59`}`
                          : `${supplier ? SUPPLIERS : CUSTOMERS}/${
                              details?.id
                            }/mail?starting_date=${`${CurrentDate} 00:00:00`}&ending_date=${`${CurrentDate} 23:59:59`}`
                      }
                    />
                  ) : (
                    <div className="__items-details_container res--scroll transaction-tab-main custom--statement-module">
                      <Tabs onChange={handleTabChange} defaultActiveKey={"1"}>
                        <Tabs.TabPane
                          key="1"
                          tab={
                            <label className="detail_tab_label">{`${
                              supplier ? "Supplier" : "Customer"
                            } Details`}</label>
                          }
                        >
                          <Overview
                            details={details}
                            isModal={isModal}
                            supplier={supplier}
                            setUploading={setUploading}
                          />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                          key="2"
                          tab={<label className="detail_tab_label">Transactions</label>}
                        >
                          <Transactions
                            url={`${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}`}
                            contact_type={details?.contact_type as string}
                          />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                          key="3"
                          tab={<label className="detail_tab_label">Account statement</label>}
                        >
                          <Statement
                            isModal={isModal}
                            supplier={supplier}
                            setEmail={setEmail}
                            setIsDate={setIsDate}
                            setUploading={setUploading}
                            name={details?.display_name}
                            url={`${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}`}
                          />
                        </Tabs.TabPane>
                        {!supplier && (
                          <Tabs.TabPane
                            key="7"
                            tab={<label className="detail_tab_label">Tax info</label>}
                          >
                            <TaxInfo details={details} />
                          </Tabs.TabPane>
                        )}
                        {/* <Tabs.TabPane key="4" tab={<label className="detail_tab_label">Last fees</label>}>
                  <LastFees />
                </Tabs.TabPane> */}
                        <Tabs.TabPane
                          key="5"
                          tab={<label className="detail_tab_label">Activity log</label>}
                        >
                          <ActivityLog
                            isModal={isModal}
                            url={`${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}${ACTIVITY}`}
                          />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                          key="6"
                          tab={<label className="detail_tab_label">Addresses</label>}
                        >
                          <Addresses details={details} />
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  )}
                </div>
              </>
            }
          />
        </div>
      )}
    </>
  );
};

export default DetailPage;

const TaxInfo = ({ details }) => {
  const { Title, Text } = Typography;
  return (
    <div className="product_details res-d-block px-16">
      <div className="product_details-left">
        <div className="product_row res--adj">
          <div className="product_key">
            <Title level={5}>Tax Exemption</Title>
          </div>
          <div className="product_value d-flex align-center">
            <Text className="tax_exemption_icon">
              {details?.tax_exempt ? (
                <div>
                  <img
                    width={18}
                    alt="tick Icon"
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tick.svg`}
                  />
                </div>
              ) : (
                <div>
                  <img
                    alt="cross Icon"
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/cross.svg`}
                  />
                </div>
              )}
            </Text>
          </div>
        </div>
      </div>
      <div className="product_details-right flex-40">
        {Boolean(!details?.tax_exempt) && (
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Tax Rate</Title>
            </div>
            <div className="product_value">
              <Text>{details?.tax_rate ? details.tax_rate + "%" : ""}</Text>
            </div>
          </div>
        )}
        {Boolean(details?.tax_exempt) && (
          <div className="product_details-right">
            <div className="product_row res--adj text--no-capitalize">
              <div className="product_key">
                <Title level={5}>Reason</Title>
              </div>
              <div className="product_value">
                <Text>{details?.reason_exemption}</Text>
              </div>
            </div>
            <div className="product_row res--adj text--no-capitalize">
              <div className="product_key">
                <Title level={5}>Detail</Title>
              </div>
              <div className="product_value">
                <Text>{details?.exemption_details}</Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
