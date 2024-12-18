/** @format */

import { PageHeader } from "@ant-design/pro-layout";
import { Space, Typography } from "antd";
import { CurrencyForm } from "./Form";
import { Toast, Icons } from "app/shared";
import { endpoints, Content } from "static";
import { useAxios, useBool } from "app/Hooks";
import { CreateCurrencyProps, CurrencySubmitProps } from "./Types";

const { currency } = Content;
const { GrCurrency } = Icons;
const { Title } = Typography;
const { CURRENCY } = endpoints;
// const { NEW_CURRENCY } = Labels;

export const CreateCurrency = ({ refetch, currncy_list, has_permission }: CreateCurrencyProps) => {
  const { callAxios, bool, toggle } = useAxios();
  const { bool: createBool, toggle: createToggle } = useBool();

  const onSubmit = (values: CurrencySubmitProps) => {
    createToggle();
    callAxios({
      method: "post",
      data: { ...values, currency_code: `${values.currency_code}` },
      url: CURRENCY,
    }).then((res) => {
      createToggle();
      if (res) {
        refetch();
        Toast({ message: res.message });
        toggle();
      }
    });
  };

  return (
    <>
      <CurrencyForm
        bool={bool}
        toggle={toggle}
        onSubmit={onSubmit}
        loading={createBool}
        currncy_list={currncy_list}
        has_permission={has_permission}
      />
      <PageHeader
        title={
          <Space>
            <GrCurrency size={25} />
            <Title level={3}>{currency}</Title>
          </Space>
        }
        // extra={
        //   <Button key="1" className="pr-color" onClick={toggle} icon={<VscAdd size={14} />}>
        //     {NEW_CURRENCY}
        //   </Button>
        // }
        style={{ borderBottom: "1px solid gray", paddingBottom: "0" }}
      />
    </>
  );
};
