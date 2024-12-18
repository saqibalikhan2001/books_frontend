import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert } from "antd";
import { getStringValueFromSS, setKeyInSS } from "utils";

export const SearchAlert = ({ description = [] }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const handleClear = async () => {
    const dataFromLS: any = getStringValueFromSS("params");
    const params = {
      ...dataFromLS,
      search: "",
    };
    await setKeyInSS("params", params);
    navigate(pathname, { replace: true });
  };

  return (
    <>
      {search && (
        <>
          <div style={{ position: "relative", padding: "8px" }}>
            <Alert
              showIcon
              type="success"
              message="Search Criteria"
              description={
                <>
                  {description.map((x, i) => (
                    <>
                      <a>{x}</a> {i < description.length - 1 ? " or " : `contains : ${search}`}
                    </>
                  ))}
                </>
              }
              style={{ paddingRight: "80px" }}
            />
            <a
              style={{
                position: "absolute",
                top: "24px",
                right: "40px",
                color: "#1890ff",
                textDecoration: "underline",
              }}
              onClick={handleClear}
            >
              Clear Search
            </a>
          </div>
        </>
      )}
    </>
  );
};
