import axios, {HttpStatusCode} from "axios";
import { useLoading } from "../Application/utils/helperMethods";
import { msalInstance } from "..";
import { toast } from "react-toastify";
import { NetworkAlert } from "../App";
import { logout } from "../Application/utils/auth";

export const BASE_URL = import.meta.env.VITE_API_URL;
const whitelistedPaths = [
  '/api/OCSAdmin/ValidateOCSAdmin',
  '/api/Insurer/ValidateInsurerAdmin',
  '/api/Insurer/ValidateInsurer',
  '/api/Delegate/Exist'
]

async function getToken() {
  const currentAccount = msalInstance.getActiveAccount();
  const flow = msalInstance.getActiveAccount()?.idTokenClaims?.tfp
  const accessTokenRequest = {
    scopes: [
      import.meta.env.VITE_SCOPES_READ,
      import.meta.env.VITE_SCOPES_WRITE
    ],
    account: currentAccount || undefined,
    authority: import.meta.env.VITE_AUTH_BASE + "/" + flow
  };
  const accessTokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
  return `Bearer ${accessTokenResponse.accessToken}`;

}

const api = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAxiosInterceptors = () => {
  const { setLoading } = useLoading();

  api.interceptors.request.use(
    async (config) => {
      setLoading(true);
      try {
        const configUrl = config.url ?? ""
        const url = new URL(configUrl);
        if (!whitelistedPaths.includes(url.pathname)) {
          const token = await getToken();
          if (token) {
              config.headers.Authorization = token;
          }      
        }
    } catch (error) {
          logout();
    }
      return config;
    },
    (error) => {
      setLoading(false);

        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                logout();
                window.location.href = "/";
            }
        }

      return Promise.reject(error);
    }
  );

    api.interceptors.response.use(
        (response) => {
            setLoading(false);
            return response;
        },
        (error) => {
            setLoading(false);
            if (axios.isAxiosError(error) && error.response) {
                const excludeCodes = [
                    HttpStatusCode.Unauthorized,
                    HttpStatusCode.Forbidden,
                    HttpStatusCode.NotFound,
                ];

                const errorType = getStatusErrorType(error.response.status, excludeCodes);

                const pathname = window.location.pathname;
                if (errorType && (pathname.includes("/cred") || pathname.includes("/form-setup"))) {
                    toast.warn(NetworkAlert({ variant: "client" }), {
                        toastId: "client",
                        containerId: "main",
                    });
                } else if (errorType) {
                    const message = "An error has occurred. Please retry later.";
                    toast.warn(NetworkAlert({ message, variant: "client" }), {
                        toastId: "client",
                        containerId: "main",
                    });
                }
            }

            return Promise.reject(error);
        }
    );

  return api;
};

export type StatusError = "client" | "server";
function getStatusErrorType(statusCode: number, exclude: number[] = []): StatusError | null {
    if (exclude.includes(statusCode)) {
        return null;
    }

    if (statusCode >= 400 && statusCode <= 499) {
        return "client";
    } else if (statusCode >= 500 && statusCode <= 599) {
        return "server";
    }

    return null;
}
