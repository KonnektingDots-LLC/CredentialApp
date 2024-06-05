import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: import.meta.env.VITE_PROV_AUTH,
    knownAuthorities: [import.meta.env.VITE_KNOWN_AUTH],
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
};