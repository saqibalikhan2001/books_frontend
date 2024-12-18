import { Card, Tabs } from "antd";
// import { AiOutlineInfoCircle } from "react-icons/ai";
import { EstimateOrderDetail } from "./Estimates";
import { InvoicesOrderDetails } from "./invoices";
import { BillsOrderDetails } from "./Bills";
import { StatsHeader } from "../StatsHeader";
export const OrderDetail = () => {

    const items = [
        {
            label: "Estimates",
            key: "0",
            children: <EstimateOrderDetail />,
        },
        {
            label: "Invoices",
            key: "1",
            children: <InvoicesOrderDetails />,

        },
        {
            label: "Bills",
            key: "2",
            children: <BillsOrderDetails />,
        },
    ]
    return (

        <Card className="card-layout salesOrderHead">
            <StatsHeader
                
                tittle="Order details"
            
            />
            <Tabs className="sales-tabs" items={items} defaultActiveKey="0"
                // tabBarExtraContent={
                //     <Typography.Text type="secondary" style={{ fontSize: "12px", display: "flex", justifyContent: "space-around" }}>
                //     <AiOutlineInfoCircle />  Showing Last 10 Entries
                //     </Typography.Text>}
            />
        </Card>

    );
}

