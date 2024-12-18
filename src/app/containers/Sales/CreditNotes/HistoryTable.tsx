/**@format */

import { endpoints } from "static";
import { ActivityLog } from "app/shared";
import { CreditNoteHistoryProps } from "./Types";

export const HistoryTable = ({ detail, isModal }: CreditNoteHistoryProps) => {
  // const { org_date_format } = useStore();
  return (
    <>
      {/* <Form className="__report_tabs_align mb-10 _history_tab">
        <div className="flexbox">
          <div className="form_group flex-47 d-flex align-center mr-10">
            <label className="mr-10">From</label>
            <DatePickerx name="from" format={org_date_format} />
          </div>
          <div className="form_group flex-47 d-flex align-center">
            <label className="mr-10">To</label>
            <DatePickerx name="to" format={org_date_format} />
          </div>
        </div>
      </Form> */}

      <ActivityLog
        isModal={isModal}
        url={`${endpoints.CREDIT_NOTES}/${detail?.id}${endpoints.ACTIVITY}-log`}
      />
    </>
  );
};
