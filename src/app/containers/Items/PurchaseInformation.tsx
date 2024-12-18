/**@format */

import { Typography } from "antd";

const { Title, Text } = Typography;

export const PurchaseInformation = ({ list }: any) => {
  return (
    <>
      <div className="container-400 w-100">
        <div className="product_details ">
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Cost</Title>
            </div>
            <div className="product_value">
              <Text>
                {list?.base_currency_symbol}
                {list?.purchase_unit_price.toFixed(2)}
              </Text>
            </div>
          </div>
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Expense account</Title>
            </div>
            <div className="product_value no-cap">
              <Text>
                {list?.purchase_account?.title}
              </Text>
            </div>
          </div>
        </div>
        {list?.purchase_description && (
          <div className="product_row w-100 ">
            <div className="product_key flex-18 flex-md-31">
              <Title level={5}>Purchase description</Title>
            </div>
            <div className="product_value w-100">
              <Text>{list?.purchase_description}</Text>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
