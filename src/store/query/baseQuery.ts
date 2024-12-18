import axios from "axios";
import { endpoints } from "static";
import { RootState } from "store/store";
import { ssoLogoutPath } from "../../utils";
//@ts-ignore
import { currentUserRole, Logout, setDetails } from "store/slices/authSlice";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { setDeploymentTime } from "utils/deploymentTimeHelper";
// import { Toast } from "app/shared";
import { removeCookies } from "utils/Storage";
const { LOGOUT } = endpoints;
const sso_logout_url = ssoLogoutPath();
let alertShown = false;

export const baseQuery = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const { authReducer } = getState() as RootState;
      headers.set("authorization", authReducer.token.access_token);
      headers.set("organization", authReducer.organization_id);
      return headers;
    },
  })(args, api, extraOptions);

  try {
    const responseData = await axios.get("/deploymentTime", {
      baseURL: import.meta.env.VITE_SERVER_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setDeploymentTime(responseData?.data);
  } catch (error) {
    console.error("Error in deploymentTime call:", error);
  }

  // Handle 401 error and ensure alert is only shown once
  if (result.error?.status === 401 && !alertShown) {
    alertShown = true; // Set flag to true to prevent re-entry

    if (import.meta.env.VITE_SSO_ENABLE === "true") {
      removeCookies();
      //@ts-ignore
      if (result.error?.data?.message === "User is inactive in this organization.") {
        alert("User is inactive in this organization.");
      }
      //@ts-ignore
      else if (result.error?.data?.message === "User does not exist in this organization.") {
        alert("User does not exist in this organization.");
      } else {
        localStorage.setItem("anotherSession", JSON.stringify(true));
        alert("Due to another active session, you have been logged out from this device.");
      }

      // Ensure alert handling is complete before redirecting
      setTimeout(() => {
        window.location.href = sso_logout_url;
      }, 100);
    } else {
      api?.dispatch(Logout({ url: LOGOUT }));
      localStorage.setItem("anotherSession", JSON.stringify(true));
    }
  } else if (result.error?.status === 403) {
    // Handle 403 errors similarly, checking for relevant flags and messages
    //@ts-ignore
    if (result.error?.data?.status === "access_denied") {
      // const { authReducer } = api?.getState() as RootState;
      // Toast({
      //   message:
      //     "Admin has changed the permissions. Forcefully Refreshing to load latest set permissions for you.",
      //   type: "info",
      // });
      // axios
      //   .get(`${import.meta.env.VITE_SERVER_URL}auth/user`, {
      //     headers: {
      //       authorization: authReducer.token.access_token,
      //       organization: authReducer.organization_id,
      //     },
      //   })
      //   .then(({ data }) => {
      //     data && api?.dispatch(setDetails(data));
      //     api?.dispatch(currentUserRole({ url: endpoints.CURRENT_USER_ROLE }));
      //   })
      //   .catch((err) => console.log(err));
      // setTimeout(() => {
      //   // location.reload();
      // }, 1500);
      //@ts-ignore
    } else if (result?.error?.data?.status === "logout") {
      if (import.meta.env.VITE_SSO_ENABLE === "true") {
        setTimeout(function () {
          window.location.href = sso_logout_url;
        }, 100);
      } else {
        api?.dispatch(Logout({ url: endpoints.LOGOUT }));
        localStorage.clear();
      }
    }
  }

  return result;
};

// /**@format */
// import axios from "axios";
// import { endpoints } from "static";
// import { RootState } from "store/store";
// import { ssoLogoutPath } from "../../utils";
// //@ts-ignore
// import { currentUserRole, Logout, setDetails } from "store/slices/authSlice";
// import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
// import { setDeploymentTime } from "utils/deploymentTimeHelper";
// import { Toast } from "app/shared";
// import { removeCookies } from "utils/Storage";
// const { LOGOUT } = endpoints;
// const sso_logout_url = ssoLogoutPath();

// // export const baseQuery = fetchBaseQuery({
// //   baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
// //   prepareHeaders: (headers, { getState }) => {
// //     const { authReducer } = getState() as RootState;
// //     headers.set("authorization", authReducer.token.access_token);
// //     headers.set("organization", authReducer.organization_id);
// //     return headers;
// //   },
// // });

// // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// let alertShown = false;

// export const baseQuery = async (args, api, extraOptions) => {
//   const result = await fetchBaseQuery({
//     baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
//     prepareHeaders: (headers, { getState }) => {
//       const { authReducer } = getState() as RootState;
//       headers.set("authorization", authReducer.token.access_token);
//       headers.set("organization", authReducer.organization_id);
//       return headers;
//     },
//   })(args, api, extraOptions);
//   try {
//     const responseData = await axios.get("/deploymentTime", {
//       baseURL: import.meta.env.VITE_SERVER_URL,
//       headers: {
//         "Content-Type": "application/json", // Set content type or other headers if needed
//       },
//     });
//     setDeploymentTime(responseData?.data);
//   } catch (error) {
//     console.error("Error in deploymentTime call:", error);
//   }
//   if (result.error?.status === 401) {
//     if (import.meta.env.VITE_SSO_ENABLE === "true" && !alertShown) {
//       removeCookies();
//       //@ts-ignore
//       if (result.error?.data?.message === "User is inactive in this organization.") {
//         alert("User is inactive in this organization.");
//         //@ts-ignore
//       } else if (result.error?.data?.message === "User does not exist in this organization.") {
//         alert("User does not exist in this organization.");
//       } else {
//         localStorage.setItem("anotherSession", JSON.stringify(true));
//         alert("Due to another active session, you have been logged out from this device.");
//       }
//       //this part comment for testing perpose by afzaal

//       setTimeout(() => {
//         window.location.href = sso_logout_url;
//       }, 100);
//       // eslint-disable-next-line
//     } else {
//       api?.dispatch(Logout({ url: LOGOUT }));
//       localStorage.setItem("anotherSession", JSON.stringify(true));
//       //return false;
//     }
//   }
//   if (result.error?.status === 403) {
//     //@ts-ignore
//     if (result.error?.data?.status === "access_denied") {
//       const { authReducer } = api?.getState() as RootState;
//       Toast({
//         message:
//           "Admin has changed the permissions. Forcefully Refreshing to load latest set permissions for you.",
//         type: "info",
//       });
//       axios
//         .get(`${import.meta.env.VITE_SERVER_URL}auth/user`, {
//           headers: {
//             authorization: authReducer.token.access_token,
//             organization: authReducer.organization_id,
//           },
//         })
//         .then(({ data }) => {
//           data && api?.dispatch(setDetails(data));
//           api?.dispatch(currentUserRole({ url: endpoints.CURRENT_USER_ROLE }));
//         })
//         .catch((err) => console.log(err));

//       setTimeout(() => {
//         location.reload();
//       }, 1500);
//       //@ts-ignore
//     } else if (result?.error?.data?.status === "logout") {
//       if (import.meta.env.VITE_SSO_ENABLE === "true") {
//         setTimeout(function () {
//           window.location.href = sso_logout_url;
//         }, 100);
//       } else {
//         api?.dispatch(Logout({ url: endpoints.LOGOUT }));
//         localStorage.clear();
//       }
//     }
//   }

//   return result;
// };
