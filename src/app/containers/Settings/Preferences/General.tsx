/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import timezone from "moment-timezone";
import { Typography, Form } from "antd";
import { endpoints, Labels } from "static";
import { BaseCurrecnyProps } from "app/containers/Sales/Types";
import { Buttonx, Selectx, Spinner, Toast, Breadcrumbx } from "app/shared";
import { useAxios, useBool, useListing, usePermissions, useStore } from "app/Hooks";

const { Title } = Typography;
const { GENERAL_PREFERENCE } = endpoints;

const dateformat = dayjs(new Date());

export const General = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { currncy_list } = useListing();
  const { checkPermission } = usePermissions();
  const { org_date_format, created_by_platform } = useStore();
  const [disableCurrency, setCurrencyStatus] = useState(false);
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const [globalCurrencyId, setGlobalCurrencyId] = useState<BaseCurrecnyProps>();
  const { has_GeneralPreferenceEdit_permission } = checkPermission("GeneralPreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: GENERAL_PREFERENCE,
    }).then((res) => {
      setHasContentLoading(false);
      setCurrencyStatus(res.disabled_currency);
      setGlobalCurrencyId(res.currency.global_currency_id);
      form.setFieldsValue({
        ...res,
        date_format: `${org_date_format} [${dateformat.format(org_date_format)}]`,
        currency_id: res.currency.global_currency_id,
      });
    });
    //eslint-disable-next-line
  }, [callAxios]);

  const handleSubmit = (values) => {
    const shared_org_data = {
      ...values,
      date_format: "long6",
      currency_updated: globalCurrencyId === values.currency_id ? false : true,
    };
    const data = {
      ...values,
      date_format: "long6",
      date_separator: "/",
      currency_updated: globalCurrencyId === values.currency_id ? false : true,
    };
    toggle();
    callAxios({
      method: "put",
      url: GENERAL_PREFERENCE,
      data: created_by_platform === "books" ? data : shared_org_data,
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res?.message || "" });
        }
      })
      .catch(() => toggle());
  };

  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper preference_general_form">
          <Breadcrumbx name="General" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Title level={4} className="form_heading">
                Time & Date
              </Title>
              <div className="form_box">
                <div className="flexbox  form-row-container justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      allowClear={false}
                      placeholder="Select time zone"
                      name="time_zone"
                      className="input_field dropdown--scroll"
                      options={timezone.tz.names()}
                      label={<label>{Labels.TIMEZONE}</label>}
                      size="large"
                      // rules={rules({ message: Content.enter_time_zone })}
                    />
                  </div>
                  <div className="form_group flex-47">
                    <Selectx
                      disabled
                      className="input_field"
                      name="date_format"
                      placeholder="Select date format"
                      label={<label>Date Format</label>}
                      size="large"
                    />
                  </div>
                </div>
              </div>

              {/* for future use */}
              {/* <Title level={4}>Number Format</Title>
            <Selectx disabled name="number_format" label={<label>Number Format</label>} />
            <Title level={4}>Language</Title>
            <Selectx disabled name="language" label={<label>Language</label>} /> */}
              <Title level={4} className="form_heading">
                Currency
              </Title>
              <div className="form_box">
                <div className="flexbox  form-row-container justify-content-between mb-10">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      name="currency_id"
                      className="input_field dropdown--scroll"
                      options={currncy_list}
                      disabled={disableCurrency}
                      placeholder="Select currency"
                      label={<label>{Labels.BASE_CURRENCY}</label>}
                    />
                  </div>
                </div>
                {/* for future use */}
                {/* <Title level={4}>Activity</Title>
            <Selectx disabled name="inactive" label={<label>Sign me out if inactive for</label>} /> */}

                {has_GeneralPreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      btnText="Cancel"
                      htmlType="button"
                      className="btn-default btn-form-size mr-20"
                      clickHandler={() => navigate(-1)}
                    />
                    <Buttonx btnText="Save" className="btn-primary btn-form-size" loading={bool} />
                  </div>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

/** This form might be used in future */
// const SharedPopup = ({ info, title, value, onConfirm }: SharedPopupProps) => (
//   <Popconfirm okText="Yes" title={title} onConfirm={onConfirm} cancelText="No">
//     <Radio value={value}>{info}</Radio>
//   </Popconfirm>
// );
// export const General = () => {
//   // const navigate = useNavigate();
//   const { callAxios } = useAxios();
//   const [value, setValue] = useState({
//     physical: false,
//     accounting: false,
//   });
//   const [discounts, setDiscounts] = useState({
//     no_discount: false,
//     at_transaction_level: false,
//     at_individual_item_level: false,
//   });

//   useLayoutEffect(() => {
//     callAxios({
//       url: GENERAL_PREFERENCE,
//     }).then((res: any) => {
//       setValue(res.stock);
//       setDiscounts(res.discount);
//     });
//     //eslint-disable-next-line
//   }, []);

//   const onChange = (e: RadioChangeEvent) => {
//     const { value, checked } = e.target;
//     console.log("radio checked", checked);
//     if (value === "physical" || value === "accounting")
//       setValue({ physical: false, accounting: false, [value]: checked });
//     else
//       setDiscounts({
//         no_discount: false,
//         at_individual_item_level: false,
//         at_transaction_level: false,
//         [value]: checked,
//       });
//   };

//   const handleSubmitStock = () => {
//     callAxios({
//       method: "put",
//       url: STOCK_PREFERENCE,
//       data: { status: value },
//     }).then((res) => {
//       if (res) Toast({ message: res?.message || "" });
//     });
//   };

//   const handleDiscountPreference = () => {
//     callAxios({
//       method: "put",
//       url: DISCOUNT_PREFERENCE,
//       data: { status: discounts },
//     }).then((res) => {
//       if (res) Toast({ message: res?.message || "" });
//     });
//   };

//   return (
//     <>
//       {/* <PageHeader
//         style={{ boxShadow: "0px 2px lightgray" }}
//         title="General"
//         extra={
//           <Button key="1" type="link" icon={<VscClose size={25} />} onClick={() => navigate(-1)} />
//         }
//       /> */}
//       <Row>
//         <Col span={24} style={{ padding: "25px" }}>
//           <Title level={4}>Mode of stock tracking</Title>
//           <Radio.Group onChange={onChange} value={value.physical ? "physical" : "accounting"}>
//             <Space direction="vertical">
//               <SharedPopup
//                 value="physical"
//                 onConfirm={handleSubmitStock}
//                 title="Are you sure Update Stock to Physical?"
//                 info={`Physical Stock - The stock on hand will be calculated based on
//                 Receives & Shipments`}
//               />
//               <SharedPopup
//                 value="accounting"
//                 onConfirm={handleSubmitStock}
//                 title="Are you sure Update Stock to Accounting?"
//                 info={`Accounting Stock - The stock on hand will be calculated based
//                 on Bills & Invoice`}
//               />
//             </Space>
//           </Radio.Group>
//         </Col>

//         <Divider />

//         <Col span={24} style={{ padding: "25px" }}>
//           <Title level={4}>Do you give discounts?</Title>
//           <Radio.Group
//             onChange={onChange}
//             value={
//               discounts.no_discount
//                 ? "no_discount"
//                 : discounts.at_individual_item_level
//                 ? "at_individual_item_level"
//                 : "at_transaction_level"
//             }
//           >
//             <Space direction="vertical">
//               <SharedPopup
//                 value="no_discount"
//                 info={`I don't give discounts`}
//                 onConfirm={handleDiscountPreference}
//                 title="Are you sure Update Discount Options?"
//               />

//               <SharedPopup
//                 value="at_individual_item_level"
//                 info={`At individual item level`}
//                 onConfirm={handleDiscountPreference}
//                 title="Are you sure Update Discount Options?"
//               />

//               <SharedPopup
//                 value="at_transaction_level"
//                 info={`At transaction level`}
//                 onConfirm={handleDiscountPreference}
//                 title="Are you sure Update Discount Options?"
//               />
//             </Space>
//           </Radio.Group>
//         </Col>
//       </Row>
//     </>
//   );
// };
