import { AxiosInstance } from 'axios';
import { BASE_URL } from '../axiosConfig';

export const getStates = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Address/State`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getCountries = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Address/Country`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getHospitalList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Hospital/List`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getHospitalPrivilegesType = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Hospital/PrivilegesType`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getInsuranceCarrierList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Insurance/ProfessionalLiabilityCarrierList`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getMalpracticeCarrierList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Insurance/MalpracticeCarrierList`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getSpecialtyList = async (api: AxiosInstance, orgId: number) => {
    try {
        const response = await api.get(BASE_URL + `/api/Specialty?organizationTypeId=${orgId}`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getPlanAcceptanceList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/Provider/AcceptPlanList`)
        return response.data
    } catch(error) {
        return null;
    }
}
