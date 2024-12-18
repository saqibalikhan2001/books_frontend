/** @format */

import { Image, Typography } from "antd";
import { useStore } from "app/Hooks";
import { capitalize, ImagePath, NaNull } from "utils";

const { Title, Text } = Typography;

const getBillLabel = (data) => {
  return (
    <>
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
const billAddress3 = (data) => {
  return `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
    data?.zip_code ? data?.zip_code + ", " : ""
  }${data?.country_name ? data?.country_name + "." : ""}`;
};

const Overview = ({ details, supplier = false, handleTabChange }: any) => {
  const { created_by_platform } = useStore();
  const billingAddress = details?.contact_addresses?.find(
    (address) => address.address_type === "billing"
  );
  const shippingAddress = details?.contact_addresses?.find(
    (address) => address.address_type === "shipping"
  );
  const additionalAddress = details?.contact_addresses?.filter(
    (address) => address.address_type === "additional"
  );
  {
    /* this code is modified to handle ticket BMS-3103 */
  }
  const current_balance = supplier
    ? details?.transaction_summary?.total_outstanding_payable?.toFixed(2)
    : details?.transaction_summary?.total_receivable?.toFixed(2);
  return (
    <>
      <div className="supplier-details-popup">
        <div className="supplier-profile-info d-flex align-center">
          <div className="supplier-info-left">
            {details?.photo ? (
              <div className="user_default_image">
                <Image
                  className="customer-dp"
                  preview={false}
                  src={ImagePath(details?.photo as string, created_by_platform)}
                />
              </div>
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
          <div className="supplier-info-right">
            <div className=" mb-5 d-flex">
              <Typography.Text className="stock-heading supplier-name">
                {details?.display_name}
              </Typography.Text>
            </div>
            <div className=" mb-5 d-flex">
              <Typography.Text className="stock-dues">
                {details?.note && details?.note}
              </Typography.Text>
            </div>
            <div className=" mb-5 d-flex">
              <Typography.Text className="stock-heading">License number:</Typography.Text>
              <Typography.Text className="stock-dues">
                {details?.license_no && details?.license_no !== "null"
                  ? details?.license_no
                  : "Not Allocated"}
              </Typography.Text>
            </div>
            <div className=" mb-5 d-flex">
              <Typography.Text className="stock-heading">Contact type:</Typography.Text>
              <Typography.Text className="stock-dues ">
                <p className="supplier-value">{supplier ? "Supplier" : "Customer"}</p>
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
      <div className="suppiler-payable-sec d-flex">
        <div className="suppiler-payable-left">
          <div className="product_row ">
            <div className="product_key">
              <Title level={5}> Outstanding {supplier ? "Payables" : "Receivables"}:</Title>
            </div>
            <div className="product_value">
              <Text>
                {current_balance ? details?.currency?.symbol : ""}
                {current_balance && parseFloat(current_balance)?.toFixed(2)}
              </Text>
            </div>
          </div>
          {!supplier && (
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Unapplied credits:</Title>
              </div>
              <div className="product_value">
                <Text>
                  {" "}
                  {details?.currency?.symbol}
                  {details?.unused_credits && parseFloat(details?.unused_credits)?.toFixed(2)}
                </Text>
              </div>
            </div>
          )}
        </div>
        <div className="supplier-details-border">
          <span></span>
        </div>
        <div className="suppiler-payable-right">
          {supplier && (
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Items to be {supplier ? "received" : "invoiced"}:</Title>
              </div>
              <div className="product_value">
                <Text>
                  {supplier
                    ? details?.transaction_summary?.total_items_to_be_received
                    : details?.transaction_summary?.total_to_be_invoiced}
                </Text>
              </div>
            </div>
          )}

          {!supplier && (
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Tax Exemption:</Title>
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
                <span
                  className="_display_name _customer_info_name cursor ml-10"
                  onClick={() => handleTabChange("5")}
                >
                  Show Detail
                </span>
              </div>
            </div>
          )}
          <div className="product_row ">
            <div className="product_key">
              <Title level={5}>{supplier ? "Items ordered:" : ""}</Title>
            </div>
            <div className="product_value">
              <Text>{supplier ? details?.transaction_summary?.total_items_ordered : ""}</Text>
            </div>
          </div>
          <div className="product_row ">
            <div className="product_key">
              <Title level={5}>{supplier ? "Total Payable:" : ""}</Title>
            </div>
            <div className="product_value">
              <Text>
                {supplier && current_balance ? details?.currency?.symbol : ""}
                {supplier ? current_balance : ""}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="supplier-details-sec ">
        <header className="supplier-header">More details</header>
        <div className="supplier-details-inner d-flex">
          <div className="supplier-detalis-left dir-col--unset">
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Department:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.department)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Designation:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.designation)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Phone(primary):</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.work_phone)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Phone(secondary):</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.work_phone_secondary)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Mobile (primary):</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.mobile)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Mobile (secondary):</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.mobile_secondary)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Currency:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.currency?.currency_code)}</Text>
              </div>
            </div>
          </div>
          <div className="supplier-details-border">
            <span></span>
          </div>
          <div className="supplier-detalis-right dir-col--unset">
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Email:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.email)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Website:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.website)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Facebook:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.facebook)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Instagram:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.instagram)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Twitter:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.twitter)}</Text>
              </div>
            </div>
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Skype:</Title>
              </div>
              <div className="product_value">
                <Text>{NaNull(details?.skype)}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="supplier-details-sec address-details-sec">
        <header className="supplier-header">Address</header>
        <div className="supplier-details-inner d-flex">
          <div className="supplier-detalis-left">
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Billing address:</Title>
              </div>
              <div className="product_value">
                <Text className="address_detail"> {getBillLabel(billingAddress)}</Text>
              </div>
            </div>
          </div>
          <div className="supplier-details-border">
            <span></span>
          </div>
          <div className="supplier-detalis-right">
            <div className="product_row ">
              <div className="product_key">
                <Title level={5}>Shipping address:</Title>
              </div>
              <div className="product_value">
                <Text className="address_detail">{getBillLabel(shippingAddress)}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      {additionalAddress?.length > 0 && (
        <div className="supplier-details-sec address-details-sec">
          <header className="supplier-header">Additional Addresses</header>
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
    </>
  );
};

export default Overview;
