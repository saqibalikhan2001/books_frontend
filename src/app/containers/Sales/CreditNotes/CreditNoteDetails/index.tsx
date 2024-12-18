import { useParams } from "react-router";
import { DetailPage } from "../DetailPage";
import { useGetCreditNotesListingQuery } from "store/query/creditNotes";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useSharedOrganization } from "app/Hooks";
import { setKeyInSS } from "utils";
import { useEffect } from "react";

export default function CreditNoteDetail() {
  const params = useParams();
  const { paginate } = useCustomPagination("creditNote");
  const { checkModulePermission } = useSharedOrganization();

  const { refetch, isFetching } = useGetCreditNotesListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: checkModulePermission("credit-notes"),
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
