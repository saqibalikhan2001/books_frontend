/**@format */

import { Typography } from "antd";

const { Title, Text } = Typography;

export const SalesInformation = ({ list }: any) => {
  return (
    <>
      <div className="container-400 w-100">
        <div className="product_details ">
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Sales price/rate</Title>
            </div>
            <div className="product_value">
              <Text>
                {list?.base_currency_symbol}
                {list?.sales_unit_price.toFixed(2)}
              </Text>
            </div>
          </div>
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Income account</Title>
            </div>
            <div className="product_value">
              <Text>{list?.sales_account?.title}</Text>
            </div>
          </div>
        </div>
        {list?.sales_description && (
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Sales description</Title>
            </div>
            <div className="product_value w-100">
              <Text>{list?.sales_description}</Text>
            </div>
          </div>
        )}
        <div className="product_row w-100 ">
          <div className="product_key flex-18 flex-md-31">
            <Title level={5}>Sales Tax</Title>
          </div>
          <div className="product_value">
            <Text>{list?.tax?.name ? `${list.tax.name} (${list.tax.rate || 0}%)` : ""}</Text>
          </div>
        </div>
      </div>
    </>
  );
};
