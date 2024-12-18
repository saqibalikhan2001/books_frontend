/**@format */

import { useState, useEffect } from "react";
import { endpoints } from "static";
import { axiosCall } from "services";
import { useStore } from "./useStore";

const { TERMS } = endpoints;

export const useTerms = () => {
  const [terms, setTerms] = useState([]);
  const { access_token, organization_id } = useStore();

  useEffect(() => {
    axiosCall({
      url: TERMS,
      headers: {
        authorization: access_token,
        organization: organization_id,
      },
    }).then((res: any) => {
      if (res) {
        const list = res.map(
          (val: {
            id: number;
            name: string;
            value: string;
            organization_id: number | null;
          }) => ({
            id: val.id,
            label: val.name,
            value: val.value,
            org_id: val.organization_id,
          })
        );
        setTerms(list);
      }
    });
    //eslint-disable-next-line
  }, [access_token, organization_id]);

  return { terms, setTerms };
};
