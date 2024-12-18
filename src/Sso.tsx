import { useEffect } from "react";
import { useTypedDispatch } from "store";
// import { apiService, Logout } from "store/slices/authSlice";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { removeCookies } from "./utils/Storage";
// import { getCookieToken, removeCookieToken } from "utils/Storage";

export const Sso = () => {
  const dispatch = useTypedDispatch();
  useEffect(() => {
    SsoFunction();
    //eslint-disable-next-line
  }, []);

  const SsoFunction = () => {
    let url = window.location.href;
    let origins: string[];
    //@ts-ignore
    let Api_Url: string = "";

    const validToken = () => {  
      const { authReducer } = JSON.parse(localStorage.getItem("persist:root") as string);
      const {
        token: { access_token = "" },
      } = JSON.parse(authReducer);
      if (access_token) return access_token;
      return false;
    };
    if (url.includes("com")) {
      origins = [
        "https://accounts.seebiz.com",
        "https://www.accounts.seebiz.com",
        "https://accounts.seebiz.com/",
        "https://www.accounts.seebiz.com/",
      ];
      Api_Url = "https://books.api.seebiz.com/api/v1";
    } else if (url.includes("cloud")) {
      origins = [
        "https://accounts.seebiz.cloud",
        "https://www.accounts.seebiz.cloud",
        "https://accounts.seebiz.cloud/",
        "https://www.accounts.seebiz.cloud/",
        "https://accounts5.seebiz.cloud/",
        "https://www.accounts5.seebiz.cloud/",
      ];
      Api_Url = "https://booksapi.seebiz.cloud/api/v1";
    } else if (window.location.hostname === "localhost") {
      origins = ["http://localhost:3010"];
      Api_Url = "http://localhost:8000/api/v1";
    }
    window.addEventListener("message", async ({ origin, data }) => {
      if (origins?.includes(origin) && typeof data === "string") {
        //@ts-ignoreS
        const [token, userAction] = data.split(":#:");
        if (userAction === "login") {
          if (!validToken()) {
            const sso_check = JSON.parse(localStorage.getItem("sso_check") as any);
            //console.log("books SSO login --->", sso_check);
            if (sso_check === null) {
              localStorage.setItem("sso_check", "false");
              //console.log('after set sso_check in local storage')
            }
          }
        }
        if (userAction === "logout") {
          //console.log("books SSO logout");
          localStorage.setItem("sso_check", "false");
          dispatch({ type: RESET_STATE_ACTION_TYPE });
          localStorage.clear();
          sessionStorage.clear();
          removeCookies();
        }
      }
    });
  };

  return null;
};
