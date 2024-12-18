/**@format */

import { useEffect, useCallback, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Tabs, Tag, Dropdown, Popconfirm, Button } from "antd";
import { endpoints } from "static";
import { BillDetailProps } from "./Types";
import {
  Email,
  Toast,
  Spinner,
  PdfViewer,
  Attachments,
  ActivityLog,
  ContactModal,
  Breadcrumbx,
} from "app/shared";
import { MenuProps } from "antd/lib/menu";
import { useNavigate } from "react-router";
import { TooltipX } from "app/shared/ToolTip";
import { Payment } from "./BillPayments/Payment";
import { DetailTopSection } from "./DetailTopSection";
import { DetailBillsTable } from "./DetailBillsTable";
import { CreatePayment } from "./BillPayments/Create";
import { capitalize, getKeyFromSS, removeKeyFromSS } from "utils";
import { useAxios, useBool, usePermissions, useSharedOrganization } from "app/Hooks";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";

const { BILLS, PAYMENT_RECORDS, ACTIVITY_LOG } = endpoints;

const DetailPage = ({
  data,
  from,
  detail,
  setparam,
  setFalse,
  detailpage,
  refetchBills,
  handleConfirm,
  isModal = false,
  loading = false,
  handleFullScreen,
}: any) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, setTrue } = useBool();
  const tabkey = getKeyFromSS("tabKey");
  const [tabKey, setTabKey] = useState("1");
  const [email, setEmail] = useState(false);
  const [loader, setLoader] = useState(true);
  const { checkPermission } = usePermissions();
  const [isbool, setIsBool] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [billModal, setbillModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const { getCurrentModule } = useSharedOrganization();
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const sessionPrint = JSON.parse(getKeyFromSS("print"));
  //@ts-ignore
  const [fetchList, refetchBillPayment] = useState(false);
  const [details, setDetails] = useState<BillDetailProps>();
  const [customerDetail, setCustomerDetail] = useState(false);
  const { status = undefined } = getCurrentModule("bill-payments") || {};
  const { has_BillEdit_permission } = checkPermission("BillEdit");
  const { has_BillDelete_permission } = checkPermission("BillDelete");
  const { has_BillCreate_permission } = checkPermission("BillCreate");
  const { has_BillPaymentRecordCreate_permission } = checkPermission("BillPaymentRecordCreate");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${BILLS}/${detailpage ? detail?.id : !isModal ? localObj?.curr_id : detail?.id}`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setAttachments(res?.bill_info?.attachments);
        setFalse?.(false);
        if (fetchList) {
          toggleBillPayments();
        }
        setLoader(false);
      });
    }
    if (tabkey) {
      setTabKey(tabkey);
      removeKeyFromSS("tabKey");
    }
    return () => {
      // setTabKey("1");
      setEmail(false);
      setPdfModal(false);
    };
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id, bool, fetchList]);

  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  useEffect(() => {
    if (sessionPrint) setPdfModal(true);
    else setPdfModal(false);
  }, [sessionPrint]);

  const handleEmail = () => setEmail(!email);
  const handleTabChange = (key) => setTabKey(key);
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const toggleBillPayments = () => {
    refetchBillPayment(!fetchList);
  };
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `/bills/${details?.bill_info?.id}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `${details?.bill_info?.vendor?.display_name} Statement.pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };

  const handleImage = (e: any) => {
    setTabKey("3");
    if (e.target.files !== undefined) {
      const file = e.target.files[0];
      const tempSize = file.size;
      if (file.name.includes(".jfif")) {
        e.target.value = "";
        Toast({
          message:
            "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
          type: "error",
        });
        return;
      }
      if (file.type.includes("video")) {
        e.target.value = "";
        Toast({ message: "Video can't be attached", type: "error" });
        return;
      }
      if (attachments.length === 10) {
        e.target.value = "";
        Toast({
          message: "Only  allowed quantity (i.e 10 attachments) are allowed to be uploaded.",
          type: "error",
        });
        return;
      }

      if (!attachementAllowedFormats.includes(file.type)) {
        Toast({
          message: attachmentTypeToastMessage,
          type: "error",
        });
        return;
      }
      if (tempSize >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        e.target.value = "";
        return;
      }
      setIsBool(true);
      const formdata = new FormData();
      formdata.append("subjectId", details?.bill_info?.id as any);
      formdata.append("name", details?.bill_info?.bill_no as string);
      formdata.append(`files[0]`, file as any);

      callAxios({
        url: "/bills/attachments",
        method: "post",
        data: formdata,
      })
        .then((res) => {
          setIsBool(false);
          e.target.value = "";
          if (res) {
            Toast({ message: res?.message });
            setAttachments([...attachments, res?.data[0]] as any);
          }
        })
        .catch((err) => {
          setIsBool(false);
          Toast({ type: "error", message: err?.message });
        });
    }
  };

  const singleAttachmentDelete = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.INVOICES}${endpoints.ATTACHMENT}/${id}`,
      method: "delete",
    }).then((res) => {
      setIsBool(false);
      Toast({ message: res?.message });
      setAttachments(attachments?.filter((attach: { id: number }) => attach?.id !== id));
      setTrue();
    });
  };
  const multipleDownloads = () => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.BILLS}/${details?.bill_info?.id}/download-all`,
    }).then((res) => {
      if (res.name) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setIsBool(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setIsBool(false);
      }
    });
  };
  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.BILLS}/${id}/download-attachment`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setIsBool(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setIsBool(false);
      }
    });
  };

  const handleButton = () => {
    setbillModal(!billModal);
  };
  const MarkAsSent = useCallback(
    () =>
      callAxios({
        url: `${endpoints.BILLS}/${details?.bill_info?.id}/markasopen`,
        method: "put",
        data: {},
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetchBills();
          toggleBillPayments();
        }
      }),
    //eslint-disable-next-line
    [details, isbool]
  );
  const memoizeTabs = useMemo(
    () =>
      [
        {
          key: "1",
          label: "Details",
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <DetailBillsTable isModal={isModal} details={details} setDetails={setDetails} />
              )}
            </>
          ),
        },
        {
          key: "2",
          label: "Payments",
          hidden: !status,
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <Payment
                  from={from}
                  isModal={isModal}
                  detail={details}
                  fetchList={fetchList}
                  refetchBills={refetchBills}
                  refetchBillPayments={toggleBillPayments}
                  url={`${BILLS}/${details?.bill_info?.id}${PAYMENT_RECORDS}`}
                />
              )}
            </>
          ),
        },
        {
          key: "3",
          hide: false,
          label: "Attachments",
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <Attachments
                  isModal={isModal}
                  setIsBool={setIsBool}
                  attachments={attachments}
                  handleImage={handleImage}
                  details={details?.bill_info}
                  hasDelete={has_BillEdit_permission}
                  multipleDownloads={multipleDownloads}
                  singleAttachmentDelete={singleAttachmentDelete}
                  singleAttachmentDownload={singleAttachmentDownload}
                />
              )}
            </>
          ),
        },
        {
          key: "4",
          label: "History",
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <ActivityLog
                  isModal={isModal}
                  url={`${BILLS}/${details?.bill_info?.id}${ACTIVITY_LOG}`}
                />
              )}
            </>
          ),
        },
      ].filter((col) => !col.hidden),

    //eslint-disable-next-line
    [details, fetchList, refetchBills, toggleBillPayments, isbool, tabKey]
  );

  const option: MenuProps["items"] = useMemo(
    () => [
      {
        key: "0",
        label: "Duplicate",
        disabled: !has_BillCreate_permission,
        onClick: () => navigate(`/clone-bill?id=${details?.bill_info?.id}`),
      },
      {
        key: "1",
        label: "Mark as open",
        onClick: MarkAsSent,
        disabled: details?.bill_info?.status !== "draft" || !has_BillEdit_permission,
        className: details?.bill_info?.status !== "draft" ? "disabled-option" : "",
        // disabled:
        //   details?.status === "sent" ||
        //   !(!has_SalesOrderModule_permission && has_SalesOrderCreate_permission),
      },
      {
        key: "2",
        label: (
          <Popconfirm
            key="confirm"
            placement="left"
            disabled={
              !(
                (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
                has_BillDelete_permission
              ) || details?.bill_info?.status !== "draft"
            }
            title={`Are you sure you want to delete "${details?.bill_info?.bill_no}"?`}
            okText={
              (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
              has_BillDelete_permission
                ? "YES"
                : "OK"
            }
            cancelText="No"
            showCancel={
              (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
              has_BillDelete_permission
            }
            onCancel={(e) => e?.stopPropagation()}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleConfirm(
                details?.bill_info,
                BILLS,
                refetchBills,
                data,
                // detail?.bill_info?.data as any,
                "/bills",
                setparam
              );
            }}
          >
            <label
              style={{
                cursor:
                  (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
                  details?.bill_info?.status === "draft"
                    ? "pointer"
                    : "not-allowed",
                width: "100%",
                display: "block",
                opacity:
                  (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
                  details?.bill_info?.status === "draft"
                    ? 1
                    : 0.8,
              }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),
        disabled:
          !(
            (imsEdit === "false" ? details?.bill_info?.platform_type === "books" : true) &&
            has_BillDelete_permission
          ) || details?.bill_info?.status !== "draft",
      },
    ],
    [
      data,
      isbool,
      details,
      setparam,
      navigate,
      MarkAsSent,
      refetchBills,
      handleConfirm,
      has_BillDelete_permission,
    ]
  );

  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        moduleName="Bills"
        refetch={refetchBills}
        handleFullScreen={handleFullScreen}
      />
      <div className="_no"> {`Bill No. ${details?.bill_info?.bill_no}`}</div>
    </div>
  );

  return (
    <>
      {loader || loading ? (
        <Spinner />
      ) : (
        <>
          <div
            style={
              isModal
                ? {}
                : {
                    animation: "fadeInRight",
                    animationDuration: "0.3s",
                  }
            }
          >
            <div style={{ pointerEvents: isbool ? "none" : "auto" }}>
              <PageHeader
                className=" __items_details_header bill_header flex-md-unset flex-md-column _bill_details_header   __journal--details"
                title={titleElement}
                subTitle={
                  <Tag
                    className={`generic-badge
                  ${
                    details?.bill_info?.status && details?.bill_info?.status === "partially paid"
                      ? "partially-paid"
                      : details?.bill_info?.status
                  }`}
                  >
                    {capitalize(
                      details?.bill_info?.status && details?.bill_info?.status === "partially paid"
                        ? "Partially paid"
                        : details?.bill_info?.status
                    )}
                  </Tag>
                }
                extra={
                  isModal
                    ? []
                    : [
                        <>
                          {!email && (
                            <>
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt compact--margin">
                                  <TooltipX title="PDF">
                                    <img
                                      alt="Pdf Icon"
                                      onClick={pdfDownload}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf_icon.svg`}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Print">
                                    <img
                                      alt="Print Icon"
                                      onClick={togglePdfModal}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/print.svg`}
                                    />
                                  </TooltipX>{" "}
                                  <TooltipX title="Email">
                                    <img
                                      alt="Email Box Icon"
                                      onClick={handleEmail}
                                      className="mr-5 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/email.svg`}
                                    />
                                  </TooltipX>
                                  <label
                                    htmlFor="myattachements"
                                    className=""
                                    style={{
                                      cursor: !has_BillEdit_permission ? "not-allowed" : "pointer",
                                    }}
                                  >
                                    <TooltipX placement="bottom" title="Attachment">
                                      <img
                                        alt="Attachment Icon"
                                        className="hover-effect"
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/attachment.svg`}
                                        style={{
                                          cursor: !has_BillEdit_permission
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      />
                                    </TooltipX>
                                    <input
                                      type="file"
                                      name="myfile"
                                      id="myattachements"
                                      onChange={handleImage}
                                      style={{ display: "none" }}
                                      accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                                      disabled={!has_BillEdit_permission}
                                    />
                                  </label>
                                </div>
                              )}
                              <Dropdown.Button
                                menu={{ items: option }}
                                trigger={["click"]}
                                icon={
                                  <img
                                    alt="arrow icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                  />
                                }
                                className="mr-5 btn-edit _detailpage_edit_btn"
                              >
                                <div
                                  className={`${
                                    details?.bill_info?.status === "draft" &&
                                    (imsEdit === "false"
                                      ? details?.bill_info?.platform_type === "books"
                                      : true)
                                      ? "edit base-style"
                                      : "no-edit base-style"
                                  }`}
                                  onClick={() =>
                                    details?.bill_info?.status === "draft" &&
                                    (imsEdit === "false"
                                      ? details?.bill_info?.platform_type === "books"
                                      : true)
                                      ? navigate(`/bill-edit?id=${details?.bill_info?.id}`)
                                      : null
                                  }
                                >
                                  Edit
                                </div>
                              </Dropdown.Button>
                              {!!status && (
                                <Button
                                  className={`btn-form-size btn-primary ${
                                    details?.bill_info.status === "paid" ||
                                    (details?.bill_info?.total ?? 0) <= 0
                                      ? "disabled-option"
                                      : ""
                                  }`}
                                  type="primary"
                                  onClick={handleButton}
                                  disabled={
                                    details?.bill_info.status === "paid" ||
                                    (details?.bill_info?.total ?? 0) <= 0
                                  }
                                >
                                  Pay this bill
                                </Button>
                              )}
                            </>
                          )}
                        </>,
                      ]
                }
                footer={
                  <>
                    {!email ? (
                      <div
                        className={`__generic_content_side  ${isModal ? "vh-0" : ""} ${
                          detail ? "dashboard-bills--details" : ""
                        }`}
                      >
                        <div className="_bills_detial_page">
                          <DetailTopSection
                            details={details}
                            isModal={isModal}
                            setDetails={setDetails}
                            toggleCustomerDetailModal={toggleCustomerDetailModal}
                          />

                          {/* <EstimateDetailModal
                            isModal
                            bool={estimateDetailModal}
                            toggle={toggleEstimateDetailModal}
                            detail={{ id: details?.invoice_info?.estimate_id }}
                          /> */}
                          {isbool && (
                            <div className="pdf_spinner">
                              <Spinner />
                            </div>
                          )}
                        </div>
                        <div className="bg-white">
                          <Tabs
                            activeKey={tabKey}
                            items={memoizeTabs}
                            onChange={handleTabChange}
                            className={`__items-details_container __item_details_tab_container res--scroll ${
                              isModal ? "px-0 bill-detail-table" : ""
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      <Email
                        setEmail={setEmail}
                        refetch={refetchBills}
                        handleEmail={handleEmail}
                        emailUrl={`${endpoints.BILLS}/${
                          details?.bill_info?.id ?? localObj?.curr_id
                        }/mail`}
                      />
                    )}
                  </>
                }
              />
            </div>
          </div>
          {pdfModal && (
            <PdfViewer
              pdfModal={pdfModal}
              togglePdfModal={togglePdfModal}
              pdfUrl={`/bills/${details?.bill_info?.id}/pdf`}
            />
          )}
          {billModal && (
            <CreatePayment
              showModal={billModal}
              toggleModal={handleButton}
              refetchBills={refetchBills}
              refetchBillPayments={toggleBillPayments}
              bill_id={details?.bill_info?.id as any}
              has_permission={has_BillPaymentRecordCreate_permission}
              url={`${BILLS}/${details?.bill_info?.id}${PAYMENT_RECORDS}/create`}
            />
          )}
        </>
      )}
      {customerDetail && (
        <ContactModal
          supplier
          bool={customerDetail}
          toggle={toggleCustomerDetailModal}
          detail={{ id: details?.bill_info?.vendor?.id }}
        />
      )}
    </>
  );
};

export default DetailPage;
