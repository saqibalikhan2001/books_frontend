import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { setKeyInSS } from "utils";
import DetailPage from "../DetailPage";
import { usePermissions, useSharedOrganization } from "app/Hooks";
import { useGetCustomersListingQuery } from "store/query/customers";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { AccessDenied } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";

export default function CustomerDetail() {
  const params = useParams();
  const [email, setEmail] = useState(false);
  const { paginate } = useCustomPagination("contacts");
  const { getCurrentModule } = useSharedOrganization();

  const { checkPermission, fetchingRoles } = usePermissions();
  const { status = true } = getCurrentModule("contact") || {};
  const { has_CustomerView_permission } = checkPermission("CustomerView");
  const { refetch, isFetching } = useGetCustomersListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_CustomerView_permission || !status,
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  if(fetchingRoles) return <SpinnerX />

  return (
    <>
      {!has_CustomerView_permission ? (
        <AccessDenied />
      ) : (
        <DetailPage
          detailpage
          email={email}
          refetch={refetch}
          setEmail={setEmail}
          loading={isFetching}
          detail={{ id: Number(params?.id) }}
        />
      )}
    </>
  );
}
