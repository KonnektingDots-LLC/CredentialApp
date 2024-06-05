import { AxiosInstance } from "axios";
import { AdminInsurerInfo } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

// ----------- ADMIN INSURER --------------
export const inviteInsurer = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.post(
      BASE_URL + "/api/Notification/InsurerEmployee",
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

export const registerAdminInsurer = async (api: AxiosInstance, adminInsurerInfo: AdminInsurerInfo) => {

  try {
    const response = await api.put(
      BASE_URL + "/api/Insurer/UpdateInsurerAdmin",
      adminInsurerInfo,
        {
        headers: {
            'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

export const getInsurersList = async (api: AxiosInstance, currentPage: number, limitPerPage: number) => {
  try {
    const response = await api.get(BASE_URL + `/api/Insurer/GetEmployees?currentPage=${currentPage}&limitPerPage=${limitPerPage}`)
    return response.data;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};

export const getInsurerAdminValidation = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.post(BASE_URL + `/api/Insurer/ValidateInsurerAdmin`, 
    {
      email: email
    })
    return response;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};

export const updateInsurerStatus = async (api: AxiosInstance, email: string, isActive: boolean) => {
  try {
    const response = await api.put(
      BASE_URL + "/api/Insurer/SetEmployeeStatus",
      {
        email: email,
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

export const getProviderStatusHistory = async (api: AxiosInstance, providerId: number) => {
  try {
    const response = await api.get(BASE_URL + `/api/Insurer/StatusHistory?providerId=${providerId}`)
    return response.data;
  } catch (error) {
    console.log("Provider history list not found");
    return null;
  }
};

export const updateInsurerFormStatus = async (api: AxiosInstance, picsId: number, statusCode: string, comment: string) => {
  try {
    const response = await api.put(
      BASE_URL + "/api/Insurer/SetStatus",
      {
        picsId: picsId,
        statusCode: statusCode,
        comment: comment
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
