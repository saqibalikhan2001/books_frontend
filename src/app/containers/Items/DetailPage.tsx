/**@format */

import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Input, Modal, Dropdown, Typography, Form, Tag } from "antd";
import type { MenuProps } from "antd";
import { ModalProps } from "./Types";
import Adjustments from "./Adjustments";
import { DetailPageProps } from "./Types";
import Transactions from "./Transactions";
import { ImageDetails } from "./ImageDetails";
import { routeNames, endpoints } from "static";
import { TooltipX } from "app/shared/ToolTip";
import { ProductDetail } from "./ProductDetails";
import { PageHeader } from "@ant-design/pro-layout";
import { useAxios, usePermissions } from "app/Hooks";
import { SalesInformation } from "./SalesInformation";
import { PurchaseInformation } from "./PurchaseInformation";
import { ModalForm } from "./ItemAdjustment/AdjustmentModal";
import { getKeyFromSS, handleStockColors, handleTabChange } from "utils";
import {
  Toast,
  Spinner,
  Buttonx,
  Processing,
  ActivityLog,
  Breadcrumbx,
  AccessDenied,
} from "app/shared";

const { TextArea } = Input;
const { Text } = Typography;
const { ITEMS, ACTIVITY } = endpoints;
const { EDIT_ITEM, ITEM_CLONE } = routeNames;

export const DetailPage = ({
  detail,
  refetch,
  setFalse,
  base_currency,
  loading = false,
  isModal = false,
  handleFullScreen,
  detailpage = false,
}: DetailPageProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(false);
  const [loader, setLoader] = useState(true);
  const { checkPermission } = usePermissions();
  const [primary, setPrimary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const { has_ItemEdit_permission } = checkPermission("ItemEdit");
  const { has_BillCreate_permission } = checkPermission("BillCreate");
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");
  const { has_EstimatesCreate_permission } = checkPermission("EstimatesCreate");
  const { has_ItemAdjustmentView_permission } = checkPermission("ItemAdjustmentView");

  const toggleModal = () => setOpen(!open);
  const Notes = Form.useWatch("notes", form);
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${ITEMS}/${isModal || detailpage ? detail?.id : localObj?.curr_id ?? detail?.id}`,
      }).then((res) => {
        form.setFieldValue("notes", res?.notes);
        setData(res);
        setFalse?.(false);
        setLoader(false);
        setPrimary(false);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id, primary]);

  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `/items/${data?.id}/product_note`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${ITEMS}/${data?.id}`,
          }).then((res) => {
            setData(res);
          });
          Toast({ message: res?.message });
        }
      });
    }
  };
  /*const availiable_stocks = data?.stocks?.reduce((accumulator, obj) => {
    return accumulator + obj.accounting_quantity;
  }, 0);*/

  const ActiveInactive = () => {
    callAxios({
      url: data?.is_active ? `/items/${data?.id}/inactive` : `/items/${data?.id}/active`,
      method: "put",
    }).then((res) => {
      setPrimary(true);
      Toast({ message: res?.message });
      refetch?.();
    });
  };

  const EditItems: MenuProps["items"] = [
    {
      key: "0",
      label: "Adjust quantity ",
      onClick: toggleModal,
      disabled: !Boolean(data?.is_active),
    },
    {
      key: "1",
      label: `${data?.is_active ? "Make Inactive" : "Make Active"}`,
      onClick: ActiveInactive,
      disabled: !has_ItemEdit_permission,
    },
    {
      key: "2",
      label: "Clone",
      onClick: () => navigate(`${ITEM_CLONE}?id=${data?.id}`),
    },
  ];

  const TransacionItems: MenuProps["items"] = [
    {
      key: "0",
      label: "Estimates",
      onClick: () => navigate("/estimates-new", { state: { itemDetail: data } }),
      disabled: !has_EstimatesCreate_permission,
    },
    {
      key: "1",
      label: "Invoices",
      onClick: () => navigate("/invoice-new", { state: { itemDetail: data } }),
      disabled: !has_InvoiceCreate_permission,
    },
    {
      key: "2",
      label: "Bills",
      onClick: () => navigate("/new-bill", { state: { itemDetail: data } }),
      disabled: !has_BillCreate_permission,
    },
  ];

  const tabChildren = useMemo(
    () => [
      {
        key: "1",
        label: "Product details",
        children: (
          <>
            {data && Object.keys(data).length > 0 && (
              <ProductDetail
                data={data || {}}
                isModal={isModal}
                base_currency={base_currency}
                setUploading={setUploading}
              />
            )}
          </>
        ),
      },
      {
        key: "2",
        label: "Sales information",
        children: (
          <>{data && Object.keys(data).length > 0 && <SalesInformation list={data || {}} />}</>
        ),
      },
      {
        key: "3",
        label: "Purchase information",
        children: (
          <>{data && Object.keys(data).length > 0 && <PurchaseInformation list={data || {}} />}</>
        ),
      },
      // {
      //   key: "4",
      //   label: "Stock location",
      //   children: (
      //     <>{data && Object.keys(data).length > 0 && <StockLocation list={data || {}} />}</>
      //   ),
      // },
      {
        key: "5",
        label: "Transactions",
        children: (
          <>
            {data && Object.keys(data).length > 0 && (
              <Transactions url={`${ITEMS}/${data?.id}`} symbol={data.base_currency_symbol} />
            )}
          </>
        ),
      },
      // {
      //   key: "6",
      //   label: "Asset value (FIFO)",
      //   children: <>{data && Object.keys(data).length > 0 && <AssetValue data={data} />},</>,
      // },
      {
        key: "7",
        label: "Adjustments",
        children: (
          <>
            {data && Object.keys(data).length > 0 && has_ItemAdjustmentView_permission ? (
              <Adjustments url={`${ITEMS}/${data?.id}`} />
            ) : (
              <AccessDenied />
            )}
          </>
        ),
      },
      {
        key: "8",
        label: "Activity log",
        children: (
          <>
            {data && Object.keys(data).length > 0 && (
              <ActivityLog isModal={isModal} url={`${ITEMS}/${data?.id}${ACTIVITY}`} />
            )}
          </>
        ),
      },
    ],
    [data, base_currency, isModal]
  );
  const stockStatus = handleStockColors(
    data?.reorder_level,
    data?.physicalStock?.stock_on_hand || 0
  );
  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetch}
        moduleName={"Products"}
        handleFullScreen={handleFullScreen}
      />
      <div className="product_title">{data?.name}</div>
    </div>
  );
  return (
    <>
      {loader || loading ? (
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
            className={`__items_details_header modals-header ${detailpage ?"modal_product_detail":""} ${uploading ? "uploading" : ""}`}
            title={titleElement}
            subTitle={
              <Tag
                className={`generic-badge badge-on-mobile ${
                  stockStatus == "outStock"
                    ? "cancelled"
                    : stockStatus == "In stock"
                    ? "accepted"
                    : "expired"
                }`}
                // color={
                //   stockStatus == "outStock"
                //     ? "red"
                //     : stockStatus == "In stock"
                //     ? "green"
                //     : "#AD6200"
                // }
              >
                {stockStatus == "low_stock"
                  ? "low stock"
                  : stockStatus == "In stock"
                  ? "In stock"
                  : stockStatus == "outStock"
                  ? "Out of stock"
                  : stockStatus}
              </Tag>
            }
            extra={
              isModal
                ? []
                : [
                    <div className="__items_details_actions item_detail_header_actions ">
                      <Dropdown.Button
                        placement="top"
                        trigger={["click"]}
                        className="btn-edit "
                        menu={{ items: EditItems }}
                        onClick={() => navigate(`${EDIT_ITEM}?id=${data.id}`)}
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                        disabled={
                          imsEdit === "false" && data?.platform_type !== "books" ? true : false
                        }
                        icon={
                          <img
                            alt="dropdown icon"
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/dropdown.svg`}
                          />
                        }
                      >
                        Edit
                      </Dropdown.Button>
                      <Dropdown
                        trigger={["click"]}
                        disabled={!data?.is_active}
                        menu={{ items: TransacionItems }}
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                      >
                        <div
                          className="btn-primary btn-trascation generic-dropdown-icon"
                          style={{ cursor: data?.is_active === 0 ? "not-allowed" : "" }}
                        >
                          New transaction
                          <img
                            alt="dropdown"
                            className=" ml-10"
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/dropdown.svg`}
                          />
                        </div>
                      </Dropdown>
                    </div>,
                  ]
            }
            footer={
              <>
                <div className={`__main_content_side ${isModal ? "item-detail-modal" : ""}`}>
                  <div className="item_details-inner  p--unset">
                    <Typography.Title level={5} className="form_heading mb--30 ">
                      Product Details
                    </Typography.Title>
                  </div>
                  <div
                    className={`__items-details_container mb-15 ${
                      isModal ? "responsive-modal" : ""
                    }`}
                  >
                    <div className="product-details d-flex align-start ">
                      <div className="custom_spacing">
                        <div className="product_images" style={{ width: 250 }}>
                          <ImageDetails
                            isModal={isModal}
                            itemId={data?.id}
                            refetch={refetch}
                            setPrimary={setPrimary}
                            Images={data?.images || []}
                            platformType={data?.platform_type}
                            primaryImage={data?.item_primary_image}
                            Add_New_button={has_ItemEdit_permission}
                          />
                        </div>
                      </div>

                      <div className="product-details-center custom_dot">
                        <div className="available_stock mb-30">
                          <Text className="heading " style={{ minWidth: 117 }}>
                            Available Stock
                            <TooltipX
                              overlayClassName={isModal ? "overlap" : ""}
                              title="Available Current stock for sale"
                            >
                              <img
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/tooltip.svg`}
                                alt="tooltip Icon"
                                className="hover-effect pl-9"
                              />
                            </TooltipX>
                          </Text>
                          <Text className="stock-values">
                            {data?.available_stock} &nbsp;
                            {data?.unit ? `${data?.unit}(s)` : ""}
                          </Text>
                        </div>
                        <div className="asset_value d-flex mb-30">
                          <Text className="heading">Asset Value</Text>
                          <Text className="stock-values">
                            {data?.base_currency_symbol}
                            {(data?.purchase_unit_price * data?.available_stock).toFixed(2) || 0}
                          </Text>
                        </div>
                        <div className="available_stock">
                          <Text className="heading ">
                            Origin
                            <TooltipX
                              overlayClassName={isModal ? "overlap" : ""}
                              title={`The origin of this product is ${
                                data?.platform_type === "ims" ? "IMS" : "BOOKS"
                              }`}
                            >
                              <img
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/tooltip.svg`}
                                alt="tooltip Icon"
                                className="hover-effect pl-9"
                              />
                            </TooltipX>
                          </Text>
                          <Text className="stock-values">
                            {data?.platform_type === "ims" ? "IMS" : "BOOKS"}
                          </Text>
                        </div>
                      </div>
                      <div className="product-details-right">
                        <div className="product_note">
                          <Text className="details-notes">Product notes</Text>
                          {!isModal && (
                            <>
                              {notes && (
                                <div className="note_cancel_btn">
                                  <Buttonx
                                    type="link"
                                    btnText="Cancel"
                                    clickHandler={() => {
                                      setNotes(false);
                                      form.setFieldValue("notes", data?.notes);
                                    }}
                                  />
                                </div>
                              )}
                              <Buttonx
                                type="link"
                                clickHandler={handleNotes}
                                btnText={!notes ? "Edit" : "Save"}
                                className={!notes ? "edit_btn" : "save_btn"}
                                disabled={
                                  !has_ItemEdit_permission ||
                                  (notes && data?.notes === Notes?.trim()) ||
                                  (imsEdit === "false" && data?.platform_type !== "books"
                                    ? true
                                    : false)
                                }
                              />
                            </>
                          )}
                        </div>
                        <Form form={form}>
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
                        </Form>
                      </div>
                    </div>
                    {uploading && <Processing />}
                  </div>
                  <Tabs
                    items={tabChildren}
                    defaultActiveKey={"1"}
                    onChange={handleTabChange}
                    className={`__items-details_container res--scroll product--item__detail_tabs ${
                      isModal ? "px-0" : ""
                    }`}
                  />
                </div>
              </>
            }
          />
          <>
            <AdjusmentModal
              open={open}
              itemDetail={data}
              refetch={refetch}
              handleCancel={toggleModal}
            />
          </>
        </div>
      )}
    </>
  );
};

export const AdjusmentModal = ({ handleCancel, open, itemDetail, refetch }: ModalProps) => {
  const { checkPermission } = usePermissions();
  const { has_ItemAdjustmentCreate_permission } = checkPermission("ItemAdjustmentCreate");

  return (
    <>
      <Modal
        centered
        open={open}
        width={1100}
        footer={false}
        style={{ top: 0 }}
        destroyOnClose={true}
        onCancel={handleCancel}
        title="Quantity Adjustment"
        className="estimate_modal estimate_md_modal"
        closeIcon={
          <img
            alt="close Icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
        wrapClassName={`generic_modal_style qty_adjustment_modal ${
          !itemDetail ? "visible-buttons" : ""
        }`}
        bodyStyle={{
          height: "100%",
        }}
      >
        <>
          {has_ItemAdjustmentCreate_permission ? (
            <ModalForm
              refetch={refetch}
              className="no-radius"
              itemDetail={itemDetail}
              handleCancel={handleCancel}
            />
          ) : (
            <AccessDenied />
          )}
        </>
      </Modal>
    </>
  );
};
