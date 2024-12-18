import { useEffect, useState } from "react";
import { endpoints } from "static";
import { axiosCall } from "services";
import { useStore } from "./useStore";

const { GET_SKU } = endpoints;

export const useGenerateSKU = () => {
  const [sku, setSku] = useState("");
  const { access_token, organization_id } = useStore();

  useEffect(() => {
    axiosCall({
      url: GET_SKU,
      headers: { authorization: access_token, organization: organization_id },
    }).then((res) => setSku(res?.sku || ""));
    //eslint-disable-next-line
  }, [access_token, organization_id]);

  return { sku };
};
