import { Button, Modal, Popconfirm, Typography } from "antd";
import { useEffect, useState } from "react";
import { capitalize, NaNull } from "utils";
import { AddressModal } from "../Estimates/AddressModal";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Spinner, Toast } from "app/shared";
import { MenuActions } from "app/shared/MenuActions";

const { Text, Title } = Typography;

export const Addresses = ({ details: data }) => {
  const { callAxios, bool, toggle } = useAxios();
  const [details, setDetails] = useState<any>([]);
  const [billModal, setBillModal] = useState(false);
  const [billObjId, setBillObjId] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [billEditModal, setBillEditModal] = useState(false);
  const [billCreateModal, setBillCreateModal] = useState(false);
  const [makeDefaultBilling, setMakeDefaultBilling] = useState(false);
  const [makeDefaultShipping, setMakeDefaultShipping] = useState(false);
  const billingAddress = details?.find((address) => address.address_type === "billing");
  const shippingAddress = details?.find((address) => address.address_type === "shipping");
  const additionalAddress = details?.filter((address) => address.address_type === "additional");
  useEffect(() => {
    setMakeDefaultBilling(false);
    setMakeDefaultShipping(false);
    callAxios({
      url: `${endpoints.CUSTOMERS}/${data?.id}/addresses`,
    }).then((res) => {
      setDetails(res);
      toggle();
    });
  }, [makeDefaultBilling, makeDefaultShipping]);
  const toggleBillModal = () => {
    setBillModal(!billModal);
    setBillEditModal(false);
  };

  const SubmitBill = (values) => {
    toggle();
    callAxios({
      method: billEditModal ? "put" : "post",
      url: billEditModal
        ? `${endpoints.CUSTOMERS}/${data?.id}/addresses/${billObjId}`
        : `${endpoints.CUSTOMERS}/${data?.id}/addresses`,
      data: {
        fax: values.bill_fax,
        city: values.bill_city,
        state: values.bill_state,
        phone: values.bill_phone,
        street: values.bill_street,
        street_2: values.bill_street_2,
        zip_code: values.bill_zip_code,
        attention: values.bill_attention,
        country_id: values.bill_country_id,
        address_type: billEditModal ? values?.address_type : "additional",
      },
    }).then((res) => {
      if (res) {
        billEditModal ? setDetails(res?.contact_address) : setDetails(res?.data);
        toggleBillModal();
        setBillEditModal(false);
        setBillCreateModal(false);
        Toast({ message: res.message });
      }
    });
  };
  const handleDelete = (value) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${endpoints.CUSTOMERS}/${data?.id}/addresses/${value}`,
    }).then((res) => {
      if (res) {
        setDetails(res?.contact_address);
        Toast({ message: res.message });
      }
    });
  };
  const handleShipping = (value) => {
    toggle();
    callAxios({
      method: "put",
      url: `${endpoints.CUSTOMERS}/${data?.id}/addresses/${value}/mark/shipping`,
    }).then((res) => {
      setMakeDefaultShipping(true);
      if (res) {
        Toast({ message: res.message });
      }
    });
  };
  const handleBilling = (value) => {
    toggle();
    callAxios({
      method: "put",
      url: `${endpoints.CUSTOMERS}/${data?.id}/addresses/${value}/mark/billing`,
    }).then((res) => {
      if (res) {
        setMakeDefaultBilling(true);
        Toast({ message: res.message });
      }
    });
  };
  const getBillLabel = (data) => {
    const MenuData = [
      {
        key: "0",
        label: "Edit",
        disabled: false,
        show: true,
        onClick: () => {
          toggleBillModal();
          setBillEditModal(true);
          setBillObjId(data?.id);
        },
      },
      {
        key: "1",
        label: (
          <Popconfirm
            showCancel
            key="confirm"
            okText="Yes"
            cancelText="No"
            overlayClassName="confirm-popp--main w--auto"
            onCancel={(e) => e?.stopPropagation()}
            getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
            title={`Are you sure you want to delete?`}
            placement={"left"}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(data?.id);
            }}
          >
            <label
              style={{ display: "block", width: "100%" }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),

        show: data?.address_type !== "additional" ? false : true,
      },
      {
        key: "2",
        style: { width: "160px" },
        label: "Make Default Billing",
        onClick: () => {
          handleBilling(data?.id);
        },
        show: data?.address_type !== "additional" ? false : true,
      },
      {
        key: "3",
        label: "Make Default Shipping",
        onClick: () => {
          handleShipping(data?.id);
        },
        show: data?.address_type !== "additional" ? false : true,
      },
    ].filter((x) => x.show);
    return (
      <>
        <MenuActions value={MenuData} />
        <span className="bill_address_detail">
          {NaNull(data?.attention) && (
            <>
              {data?.attention}
              <br />
            </>
          )}
        </span>
        <span className="bill_address_detail">
          {NaNull(data?.street) && (
            <>
              {data?.street}
              <br />
            </>
          )}
          {NaNull(data?.street_2) && (
            <>
              {data?.street_2}
              <br />
            </>
          )}
        </span>
        <span className="bill_address_detail">{billAddress3(data)}</span>
      </>
    );
  };
  return (
    <>
      {!bool ? (
        <>
          <div className="add_new_btn">
            {additionalAddress?.length <= 3 && (
              <Button className="btn-primary btn-form-size " onClick={toggleBillModal}>
                <span className="add-new-btn">
                  <img
                    alt="add icon"
                    className="mr-5 "
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                  />
                  New
                </span>
              </Button>
            )}
          </div>
          <div className="supplier-details-sec address-details-sec">
            <div className="supplier-details-inner d-flex">
              <div className="supplier-detalis-left">
                {billingAddress && (
                  <div className="product_row">
                    <div className="product_key">
                      <Title level={5}>Billing address:</Title>
                    </div>
                    <div className="product_value">
                      <Text className="address_detail"> {getBillLabel(billingAddress)}</Text>
                    </div>
                  </div>
                )}
              </div>
              <div className="supplier-details-border">
                <span></span>
              </div>
              <div className="supplier-detalis-right">
                {billingAddress && (
                  <div className="product_row">
                    <div className="product_key">
                      <Title level={5}>Shipping address:</Title>
                    </div>
                    <div className="product_value">
                      {/* <Text>{NaNull(details?.website)}</Text> */}
                      <Text className="address_detail">{getBillLabel(shippingAddress)}</Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {additionalAddress?.length > 0 && (
            <div className="supplier-details-sec address-details-sec">
              <div className="supplier-details-inner d-flex">
                <div className="supplier-detalis-left additional_address">
                  {additionalAddress?.map((address, i) => (
                    <div className="address_container">
                      <div className="product_row ">
                        <div className="product_key">
                          <Title level={5}>
                            {capitalize(address.address_type)} address {i + 1}:
                          </Title>
                        </div>
                        <div className="product_value">
                          <Text className="address_detail"> {getBillLabel(address)}</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Modal
            width={940}
            footer={false}
            destroyOnClose
            centered
            style={{ top: 0 }}
            open={billModal}
            title={`${billEditModal ? "Edit Address" : "Add New Address"}`}
            onCancel={toggleBillModal}
            className="estimate_modal estimate_md_modal __customers--address-popup "
            wrapClassName="generic_modal_style address_modal  h-635"
            closeIcon={
              <img
                alt="close Icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
              />
            }
            // bodyStyle={{
            //   height: "100%",
            // }}
          >
            <AddressModal
              contactForm
              bool={bool}
              onSubmit={SubmitBill}
              loading={billLoading}
              editBill={billEditModal}
              createBill={billCreateModal}
              handleCancel={toggleBillModal}
              setEditBill={setBillEditModal}
              setBillLoading={setBillLoading}
              setCreateBill={setBillCreateModal}
              url={
                billEditModal
                  ? `${endpoints.CUSTOMERS}/${data?.id}/addresses/${billObjId}`
                  : `${endpoints.CUSTOMERS}/${data?.id}/addresses`
              }
            />
          </Modal>
        </>
      ) : (
        <div style={{ height: "calc(100vh - 515px)" }}>
          <Spinner />
        </div>
      )}
    </>
  );
};

const billAddress3 = (data) =>
  `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
    data?.zip_code ? data?.zip_code + ", " : ""
  }${data?.country_name ? data?.country_name + "." : ""}`;
