import { AxiosInstance } from "axios";
import { UserInfo } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";
import { msalInstance } from "../..";

export const getProviderByEmail = async (api: AxiosInstance, email: string) => {
    try {
        const response = await api.get(BASE_URL + `/api/Provider/ByEmail`, {
          params: { email }
        })
        return response.data
    } catch(error) {
        return null;
    }
}

export const CreateUser = async (api: AxiosInstance, data: UserInfo | undefined) => {
    const json = {
        "providerTypeId": parseInt(data?.providerTypeId ?? ""),
        "firstName": msalInstance.getActiveAccount()?.idTokenClaims?.given_name ?? "",
        "middleName": msalInstance.getActiveAccount()?.idTokenClaims?.extension_MiddleName ?? "",
        "lastName": msalInstance.getActiveAccount()?.idTokenClaims?.extension_LastName ?? "",
        "surName": msalInstance.getActiveAccount()?.idTokenClaims?.family_name ?? "",
        "phoneNumber": data?.phoneNumber ?? "",
        "birthDate": data?.birthDate,
        "gender": data?.gender,
        "renderingNPI": data?.renderingNpi,
        "billingNPI": data?.billingSameAsRenderingNpi ? data.renderingNpi : data?.billingNpi,
        "sameAsRenderingNPI": data?.billingSameAsRenderingNpi,
        "multipleNPI": data?.multipleNpi
    }
    try {
        const response = await api.post(BASE_URL + '/api/CredForm/Create', json, {
            headers: {
                'Content-Type': 'application/json'
            }});      

        return response;
    } catch(error) {
        return null;
    }
}

export const getProviderType = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Provider/ProviderType`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getDelegatesList = async (api: AxiosInstance, providerId: number, currentPage: number, limitPerPage: number) => {
    try {
      const response = await api.get(BASE_URL + `/api/Delegate/ByProvider?id=${providerId}&currentPage=${currentPage}&limitPerPage=${limitPerPage}`)
      return response.data;
    } catch (error) {
      console.log("Delegates list not found");
      return null;
    }
};

export const updateDelegateStatus = async (api: AxiosInstance, delegateId: number, isActive: boolean) => {
    try {
      const response = await api.put(
        BASE_URL + "/api/Delegate/SetStatus",
        {
          delegateId: delegateId,
          isActive: isActive
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

export const getProviderFormStatusList = async (api: AxiosInstance, providerId: number, currentPage: number, limitPerPage: number) => {
  try {
    const response = await api.get(BASE_URL + `/api/Insurer/Status?currentPage=${currentPage}&limitPerPage=${limitPerPage}&providerId=${providerId}`)
    return response.data;
  } catch (error) {
    console.log("Provider form status list not found");
    return null;
  }
};
