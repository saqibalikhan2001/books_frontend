import { useParams } from "react-router";
import { DetailPage } from "../DetailPage";
import { useGetInvoicesListingQuery } from "store/query/invoice";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useSharedOrganization } from "app/Hooks";
import { useEffect } from "react";
import { setKeyInSS } from "utils";

export default function InvoiceDetail() {
  const params = useParams();
  const { paginate } = useCustomPagination("invoices");
  const { checkModulePermission } = useSharedOrganization();

  const { refetch, isFetching } = useGetInvoicesListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("invoices"),
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  return (
    <>
      <DetailPage
        detail={{ id: Number(params?.id) }}
        refetchInvoices={refetch}
        loading={isFetching}
        detailpage
      />
    </>
  );
}
