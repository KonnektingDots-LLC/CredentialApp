import { AxiosInstance } from "axios";
import { ProvidersList } from "../../Application/interfaces";
import { BASE_URL } from "../axiosConfig";

const SearchService = {
  getSearchResults: (list: ProvidersList[], searchValue: string) => {
    //TODO: Use a parameter to build a URL with seach query
      const filteredResults = list.filter((item) => {
        const fullName = [
          item.name,
          item.middleName,
          item.lastName,
          item.surName
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
  
        return fullName.includes(searchValue.toLowerCase())
          || item.email.toLowerCase().includes(searchValue.toLowerCase())
          || item?.phoneNumber?.toLowerCase().includes(searchValue.toLowerCase())
          || item?.renderingNPI.includes(searchValue) 
          || item?.billingNPI?.includes(searchValue)
      });
      if (filteredResults) {
        return filteredResults;
      }
      return list;
  },
};

export default SearchService;

export const searchProviderList = async (api: AxiosInstance, currentPage: number, limitPerPage: number, searchTerm: string) => {
  try {
    const response = await api.get(BASE_URL + `/api/providers?currentPage=${currentPage}&limitPerPage=${limitPerPage}&search=${searchTerm}&dofilterByRole=true`)
    console.log('searchProviderList', response);
    return response.data;
  } catch (error) {
    console.log("Providers not found for search term:", searchTerm);
    return null;
  }
};

export const searchInsurersList = async (api: AxiosInstance, currentPage: number, limitPerPage: number, searchTerm: string) => {
  try {
    const response = await api.get(BASE_URL + `/api/insurers/employees?currentPage=${currentPage}&limitPerPage=${limitPerPage}&search=${searchTerm}`)
    console.log('searchInsurersList', response);
    return response.data;
  } catch (error) {
    console.log("Insurer employees not found for search term:", searchTerm);
    return null;
  }
};