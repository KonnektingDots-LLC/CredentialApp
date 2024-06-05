import { AxiosInstance } from "axios";
import { BASE_URL } from "../axiosConfig";

export const postWelcomeEmail = async (api: AxiosInstance, email: string) => {

    try {
      const response = await api.post(
        BASE_URL + "/api/Notification/Complete",
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