import { useSearchParams } from "react-router-dom";

export const useGetSearchParam = (name: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param: string = searchParams.get(name) ?? "";

  return { param, searchParams, setSearchParams };
};
