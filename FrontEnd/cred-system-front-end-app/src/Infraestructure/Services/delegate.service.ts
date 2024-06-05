import { AxiosInstance } from "axios";
import { DelegateInfo, ProvidersList } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

export const inviteDelegate = async (api: AxiosInstance, providerId: number, email: string) => {
  try {
    const response = await api.post(
      BASE_URL + `/api/providers/${providerId}/delegates`,
      {
        providerId: providerId,
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

export const getDelegate = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.get(BASE_URL + `/api/delegates?email=${email}`)

    return response.data;
  } catch (error) {
    return [];
  }
};

export const linkDelegateWithProvider = async (api: AxiosInstance, delegateId: number, providerId: number) => {
  
  try {
    return await api.post(
      BASE_URL + `/api/delegates/${delegateId}/providers/${providerId}`, {
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return null;
  }
};

export const registerDelegate = async (api: AxiosInstance, delegateInfo: DelegateInfo) => {

  try {
    const response = await api.put(
      BASE_URL + "/api/delegates",
        delegateInfo,
        {
        headers: {
            'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getDelegateProviderList = async (api: AxiosInstance, delegateId: string): Promise<ProvidersList[] | null> => {
  try {
    const response = await api.get(BASE_URL + `/api/delegates/${delegateId}/providers`)

    return response.data;
  } catch (error) {
        return null;
  }
};

export const notifyProvider = async (api: AxiosInstance, email: string, delegateId: string, providerId: string) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/delegates/${delegateId}/providers/${providerId}/notification`,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

export const getDelegateValidation = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.get(BASE_URL + `/api/delegates/${email}/valid`)
    return response;
  } catch (error) {
    console.log("Delegate not found");
    return null;
  }
};
