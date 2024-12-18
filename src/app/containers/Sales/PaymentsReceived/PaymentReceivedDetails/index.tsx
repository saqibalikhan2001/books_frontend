import { useParams } from "react-router";
import DetailPage from "../DetailPage";
import { useGetPaymentReceivedListingQuery } from "store/query/paymentReceived";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useSharedOrganization } from "app/Hooks";
import { setKeyInSS } from "utils";
import { useEffect } from "react";
export default function PaymentReceivedDetail() {
  const params = useParams();
  const { checkModulePermission } = useSharedOrganization();

  const { paginate } = useCustomPagination("paymentReceive");
  const { refetch, isFetching } = useGetPaymentReceivedListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("payment-received"),
    }
  );
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);
  return (
    <>
      <DetailPage
        detail={{ id: Number(params?.id) }}
        refetchPaymentReceived={refetch}
        loading={isFetching}
        detailpage
      />
    </>
  );
}
