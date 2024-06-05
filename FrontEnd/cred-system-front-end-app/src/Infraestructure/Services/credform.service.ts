import { AxiosInstance } from "axios";
import { BASE_URL } from "../axiosConfig";

export const getCredFormByEmail = async (api: AxiosInstance, email: string) => {
    try {
        const response = await api.get(BASE_URL + `/api/CredForm/ByEmail`, {
          params: { email }
        })
        return response.data;
    } catch(error) {
        return null;
    }
}

export const createCredForm = async (api: AxiosInstance, email: string) => {
    try {
      const response = await api.post(
        BASE_URL + `/api/CredForm/Create`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { email }
        }
      );
      return response;
    } catch (error) {
      return null;
    }
  };

  export const getCredFormByCredFormId = async (api: AxiosInstance, credFormId: string) => {
    try {
        const response = await api.get(BASE_URL + `/api/Provider/ByCredFormId`, {
          params: { credFormId }
        })
        return response.data;
    } catch(error) {
        return null;
    }
}
