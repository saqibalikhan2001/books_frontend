/** @format */

import { useEffect, useState } from "react";
import { Tabs, Typography } from "antd";
import Overview from "./OverviewTab";
import Statement from "./Statement";
import { endpoints } from "static";
import { PageHeader } from "@ant-design/pro-layout";
import Transactions from "./Transactions/Transactions";
import { useAxios } from "app/Hooks";
import { getKeyFromSS } from "utils";
import { ActivityLog,  Spinner } from "app/shared";

const { CUSTOMERS, ACTIVITY, SUPPLIERS } = endpoints;

const DetailPageModal = ({ detail }) => {
  const { callAxios } = useAxios();
  const [loader, setLoader] = useState(true);
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [details, setDetails] = useState<any>();
  const [tabKey, setTabKey] = useState<any>("1");
  const handleTabChange = (value) => setTabKey(value);
  useEffect(() => {
    if (detail?.id || localObj?.curr_id) {
      callAxios({
        url: `contacts/${detail?.id ?? localObj?.curr_id}`,
      }).then((res) => {
        setDetails(res);
        // setFalse?.(false);
        setLoader(false);
      });
    }
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id]);

  let isSupplier = details?.contact_type === "vendor";

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <div>
          <PageHeader
            className=" __items_details_header modals-header"
            title={isSupplier ? "View Supplier details" : "View Customer details"}
          />

          <div className="__items-details_container mx-100 transaction-tab-main supplier-popup-main custom--statement-module">
            <Tabs onChange={handleTabChange} defaultActiveKey={tabKey} activeKey={tabKey}>
              <Tabs.TabPane key="1" tab={<label className="detail_tab_label">Overview</label>}>
                <Overview
                  details={details}
                  supplier={isSupplier}
                  handleTabChange={handleTabChange}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key="2" tab={<label className="detail_tab_label">History</label>}>
                <ActivityLog
                  isModal={true}
                  url={`${isSupplier ? SUPPLIERS : CUSTOMERS}/${details?.id}${ACTIVITY}`}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key="3" tab={<label className="detail_tab_label">Transactions</label>}>
                <Transactions
                  url={`${isSupplier ? SUPPLIERS : CUSTOMERS}/${details?.id}`}
                  contact_type={details?.contact_type as string}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key="4" tab={<label className="detail_tab_label">Statement</label>}>
                <Statement
                  supplier={isSupplier}
                  url={`${isSupplier ? SUPPLIERS : CUSTOMERS}/${details?.id}`}
                />
              </Tabs.TabPane>
              {!isSupplier && (
                <Tabs.TabPane key="5" tab={<label className="detail_tab_label">Tax info</label>}>
                  <TaxInfo details={details} />
                </Tabs.TabPane>
              )}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailPageModal;

const TaxInfo = ({ details }) => {
  const { Title, Text } = Typography;
  return (
    <div className="product_details res-d-block px-16 tax--detail">
      <div className="product_details-left flex-40">
        <div className="product_row res--adj">
          <div className="product_key flex-50">
            <Title level={5}>Tax Exemption</Title>
          </div>
          <div className="product_value d-flex align-center">
            <Text className="tax_exemption_icon">
              {details?.tax_exempt ? (
                <div>
                <img
                width={18}
                alt="tick Icon"
                src={`${
                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                }/static/media/tick.svg`}
              />
              </div> 
             ) : (
               <div>
                 <img
                       alt="cross Icon"
                       src={`${
                         import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                       }/static/media/cross.svg`}
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
            <div className="product_key flex-50">
              <Title level={5}>Tax Rate</Title>
            </div>
            <div className="product_value">
              <Text>{details?.tax_rate ? details.tax_rate + "%" : ""}</Text>
            </div>
          </div>
        )}

        {Boolean(details?.tax_exempt) && (
          <div className="product_details-right flex-50">
            <div className="product_row res--adj">
              <div className="product_key flex-50">
                <Title level={5}>Reason</Title>
              </div>
              <div className="product_value flex-50">
                <Text>{details?.reason_exemption}</Text>
              </div>
            </div>
            <div className="product_row res--adj">
              <div className="product_key flex-50">
                <Title level={5}>Detail</Title>
              </div>
              <div className="product_value flex-50">
                <Text>{details?.exemption_details}</Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
