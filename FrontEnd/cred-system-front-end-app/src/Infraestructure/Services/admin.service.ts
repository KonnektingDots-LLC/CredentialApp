import { AxiosInstance } from "axios";
import { BASE_URL } from "../axiosConfig";
import { AdminInfo } from "../../Application/interfaces";

export const getAdminValidation = async (api: AxiosInstance, email: string) => {
    try {
      const response = await api.post(BASE_URL + `/api/OCSAdmin/ValidateOCSAdmin`,
      {
        email: email
      },{
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log('getAdminValidation', response);
      return response;
    } catch (error) {
      console.log("Admin not found");
      return null;
    }
  };

  export const registerAdmin = async (api: AxiosInstance, insurerInfo: AdminInfo) => {

    try {
      const response = await api.put(
        BASE_URL + "/api/OCSAdmin/UpdateOCSAdmin",
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