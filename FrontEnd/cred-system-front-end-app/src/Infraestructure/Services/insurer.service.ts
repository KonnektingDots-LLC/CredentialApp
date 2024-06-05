import { AxiosInstance } from "axios";
import { AdminInsurerInfo } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

// ----------- ADMIN INSURER --------------
export const inviteInsurer = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.post(
      BASE_URL + "/api/insurers/employees",
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
      BASE_URL + "/api/insurers/admins",
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
    const response = await api.get(BASE_URL + `/api/insurers/employees?currentPage=${currentPage}&limitPerPage=${limitPerPage}`)
    return response.data;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};

export const getInsurerAdminValidation = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.post(BASE_URL + `/api/insurers/admin/${email}/valid`)
    return response;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};

export const updateInsurerStatus = async (api: AxiosInstance, email: string, isActive: boolean) => {
  try {
    const response = await api.put(
      BASE_URL + `/api/insurers/employees/${email}`,
      {
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
    const response = await api.get(BASE_URL + `/api/insurers/providers/${providerId}/credentialing-forms/statuses`)
    return response.data;
  } catch (error) {
    console.log("Provider history list not found");
    return null;
  }
};

export const updateInsurerFormStatus = async (api: AxiosInstance, providerId: number, picsId: number, statusCode: string, comment: string) => {
  try {
    const response = await api.patch(
      BASE_URL + `/api/insurers/providers/${providerId}/credentialing-forms/statuses`,
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
