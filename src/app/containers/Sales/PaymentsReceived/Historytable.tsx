/**@format */

import { ActivityLog } from "app/shared";

export const HistoryTable = ({ details, isModal }: any) => {
  return (
    <>
      <ActivityLog
        isModal={isModal}
        url={`advancepayment/${details?.id}/activity-log/${
          details?.payment_type === "advance" ? "advance" : "invoice_payment"
        }`}
      />
    </>
  );
};
