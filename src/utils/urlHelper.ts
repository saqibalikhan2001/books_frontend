const sso_url = import.meta.env.VITE_SSO_URL;
const books_url = import.meta.env.VITE_URL;

export const ssoForgetPasswordPath = () =>
  `${sso_url}/forgotPassword?serviceUrl=${books_url}/login`;

export const ssoSignInPath = () =>
  `${sso_url}/login?serviceUrl=${books_url}`;

export const ssoSignUpPath = () =>
  `${sso_url}/signup?serviceUrl=${books_url}`;

export const ssoMyProfilePath = () => `${sso_url}/myProfile`;

export const ssoLogoutPath = () => `${sso_url}/logout?lg=books`;
