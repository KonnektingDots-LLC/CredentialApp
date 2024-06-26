import { AxiosInstance } from "axios";
import { InsurerInfo } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

// --------- INSURER EMPLOYEE --------------

export const getInsurerEmployee = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.get(BASE_URL + `/api/Insurer?email=${email}`)

    return response.data;
  } catch (error) {
    return "Insurer not found";
  }
};

export const registerInsurerEmployee = async (api: AxiosInstance, insurerInfo: InsurerInfo) => {

  try {
    const response = await api.put(
      BASE_URL + "/api/Insurer/UpdateInsurerEmployee",
        insurerInfo,
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

export const getInsurerProviderList = async (api: AxiosInstance, currentPage: number, limitPerPage: number) => {
  try {
    const response = await api.get(BASE_URL + `/api/Provider/All?currentpage=${currentPage}&limitperpage=${limitPerPage}`)
    return response.data;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};

export const getInsurerEmployeeValidation = async (api: AxiosInstance, email: string) => {
  try {
    const response = await api.post(BASE_URL + `/api/Insurer/ValidateInsurer`,
    {
      email: email
    })
    return response;
  } catch (error) {
    console.log("Insurer not found");
    return null;
  }
};
