import { useEffect } from "react";
import { useParams } from "react-router";
import { setKeyInSS } from "utils";
import { DetailPage } from "../DetailPage";
import { useSharedOrganization } from "app/Hooks";
import { useGetEstimatesListingQuery } from "store/query/estimates";
import { useCustomPagination } from "app/Hooks/useCustomPagination";

export default function EstimateDetail() {
  const params = useParams();
  const { checkModulePermission } = useSharedOrganization();
  const { paginate } = useCustomPagination("estimates");
  const { refetch, isFetching } = useGetEstimatesListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("estimates"),
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  return (
    <>
      <DetailPage
        detail={{ id: Number(params?.id) }}
        refetch={refetch}
        loading={isFetching}
        detailpage
      />
    </>
  );
}
