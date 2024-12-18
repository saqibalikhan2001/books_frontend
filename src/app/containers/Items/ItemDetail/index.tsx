import { useEffect } from "react";
import { useParams } from "react-router";
import { setKeyInSS } from "utils";
import { AccessDenied } from "app/shared";
import { DetailPage } from "../DetailPage";
import { SpinnerX } from "app/shared/PageLoader";
import { useGetItemsListingQuery } from "../../../../store/query/items";
import { usePermissions, useSharedOrganization } from "../../../Hooks";
import { useCustomPagination } from "../../../Hooks/useCustomPagination";

export default function ItemDetail() {
  const params = useParams();
  const { paginate } = useCustomPagination("items");
  const { checkModulePermission } = useSharedOrganization();
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_ItemView_permission } = checkPermission("ItemView");

  const { refetch, isFetching } = useGetItemsListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("item"),
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {!has_ItemView_permission ? (
        <AccessDenied />
      ) : (
        <DetailPage
          detailpage
          refetch={refetch}
          loading={isFetching}
          detail={{ id: Number(params?.id) }}
        />
      )}
    </>
  );
}
