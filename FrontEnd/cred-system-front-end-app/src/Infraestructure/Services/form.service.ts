import { Form } from "../../Presentation/Layouts/formLayout/credInterfaces";
import { AxiosInstance } from 'axios';
import { BASE_URL } from "../axiosConfig";
import { Files } from "../../Application/interfaces";
  
export const getForm = async (api: AxiosInstance, providerId: number) => {
    try {
        const response = await api.get(BASE_URL + `/api/providers/${providerId}/credentialing-forms/snapshot`)
        return JSON.parse(response.data.jsonBody)
    } catch(error) {
        return null;
    }
}

export type FileToDelete = {documentTypeId: number, uploadFilename: string}

export const postForm = async (
    api: AxiosInstance,
    providerId: number,
    formPayload: Form,
    filesArray: Files[],
    filesToDelete?: FileToDelete[]
) => {
    const formData = new FormData();
    // Append the files to the FormData
    filesArray.forEach((file: Files, index: number) => {
        formData.append(`fileDetail[${index}].documentTypeId`, file.documentTypeId);
        formData.append(`fileDetail[${index}].file`, file.file);
        if (file.oldFilename) {
            formData.append(`fileDetail[${index}].oldFilename`, file.oldFilename);
        }
        if (file.npi) {
            formData.append(`fileDetail[${index}].npi`, file.npi);
        }

        if (file.issueDate) {
            formData.append(`fileDetail[${index}].issueDate`, file.issueDate);
        }

        if (file.expirationDate) {
            formData.append(`fileDetail[${index}].expirationDate`, file.expirationDate);
        }
    });
    
    formData.append('providerId', providerId.toString());
    formData.append('json', JSON.stringify(formPayload)); 

    if(filesToDelete && filesToDelete.length > 0) {
        formData.append('filesToDelete', JSON.stringify(filesToDelete)); 
    }

    try {
        const response = await api.put(BASE_URL + `/api/providers/${providerId}/credentialing-forms/snapshot`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        return response;
    } catch(error) {
        console.error(error);
        return null;
    }
}

export const getValidationNPI = async (api: AxiosInstance, npi: string) => {
    try {
        const response = await api.get(BASE_URL + `/api/admin/helpers/npi/${npi}/valid`, {
            validateStatus: null,
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const submitForm = async (api: AxiosInstance, providerId: number, jsonFormatted: any, jsonDraft: any) => {
    try {
        const response = await api.post(BASE_URL + `/api/providers/${providerId}/credentialing-forms`,
            {
                jsonSubmit: jsonFormatted,
                jsonProviderForm: JSON.stringify(jsonDraft)
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response;
    } catch(error) {
        console.error(error);
        return null;
    }
}
