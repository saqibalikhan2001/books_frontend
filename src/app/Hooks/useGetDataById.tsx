/**@format */

import { useEffect, useState } from "react";
import { axiosCall } from "services";
import { useStore } from "./useStore";

export const useGetDataById = (url: string, hasAccess: boolean) => {
  const [details, setDetails] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const { access_token, organization_id } = useStore();

  useEffect(() => {
    if (hasAccess)
      axiosCall({
        url: url,
        headers: { authorization: access_token, organization: organization_id },
      }).then((response) => {
        setDetails(response);
        const invoiceData =
          response?.invoice_payments?.map((invoice: any, i: number) => {
            return {
              key: `${i}`,
              id: invoice.invoice_id,
              payment: invoice.payment_made,
              total: invoice.get_invoice?.total,
              invoice_no: invoice.get_invoice?.invoice_no,
              payment_due: invoice.get_invoice?.payment_due,
              invoice_date: invoice.get_invoice?.invoice_date,
            };
          }) || [];
        setInvoicesList(invoiceData);
      });
    //eslint-disable-next-line
  }, [access_token, organization_id, hasAccess, url]);

  return { details, invoicesList };
};
