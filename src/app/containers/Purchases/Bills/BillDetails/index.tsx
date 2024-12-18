import { useParams } from "react-router";
import DetailPage from "../DetailPage";
import { useGetBillsListingQuery } from "store/query/bills";
import { useSharedOrganization } from "app/Hooks";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useEffect } from "react";
import { setKeyInSS } from "utils";
export default function BillsDetail() {
  const params = useParams();
  const { paginate } = useCustomPagination("bills");
  const { checkModulePermission } = useSharedOrganization();

  const { refetch, isFetching } = useGetBillsListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("bills"),
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  return (
    <>
      <DetailPage
        detail={{ id: Number(params?.id) }}
        refetchBills={refetch}
        loading={isFetching}
        detailpage
      />
    </>
  );
}
