import { AxiosInstance } from 'axios';
import { BASE_URL } from '../axiosConfig';

export const getStates = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/AddressState`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getCountries = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/AddressCountry`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getHospitalList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/HospitalList`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getHospitalPrivilegesType = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/HospitalPrivilegesType`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getInsuranceCarrierList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/InsuranceProfessionalLiabilityCarrierList`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getMalpracticeCarrierList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/InsuranceMalpracticeCarrierList`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getSpecialtyList = async (api: AxiosInstance, orgId: number) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/Specialty?organizationTypeId=${orgId}`)
        return response.data
    } catch(error) {
        return null;
    }
}

export const getPlanAcceptanceList = async (api: AxiosInstance) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/ui-lists/AcceptPlanList`)
        return response.data
    } catch(error) {
        return null;
    }
}
