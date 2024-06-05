import { AxiosInstance } from "axios";
import { DelegateInfo, ProvidersList } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

export const inviteDelegate = async (api: AxiosInstance, providerId: number, email: string) => {
  try {
    const response = await api.post(
      BASE_URL + "/api/Notification/Invite",
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
    const response = await api.get(BASE_URL + `/api/Delegate?email=${email}`)

    return response.data;
  } catch (error) {
    return [];
  }
};

export const linkDelegateWithProvider = async (api: AxiosInstance, delegateId: number, providerId: number) => {
  
  try {
    const response = await api.post(
      BASE_URL + `/api/Delegate/Link`, {
        delegateId: delegateId,
        providerId: providerId,
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

export const registerDelegate = async (api: AxiosInstance, delegateInfo: DelegateInfo) => {

  try {
    const response = await api.post(
      BASE_URL + "/api/Delegate/CompleteRegistration",
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
    const response = await api.get(BASE_URL + `/api/Delegate/Providers?delegateId=${delegateId}`)

    return response.data;
  } catch (error) {
        return null;
  }
};

export const notifyProvider = async (api: AxiosInstance, email: string) => {

  try {
    const response = await api.post(
      BASE_URL + "/api/Notification/Provider",
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
    const response = await api.post(BASE_URL + `/api/Delegate/Exist?email=${email}`)
    return response;
  } catch (error) {
    console.log("Delegate not found");
    return null;
  }
};
