import { AxiosInstance } from "axios";
import { BASE_URL } from "../axiosConfig";
import { downloadDocument, downloadZipFile, openDocumentInNewTab } from "../../Application/utils/helperMethods";

export const getFormDocument = async (api: AxiosInstance, documentTypeId: number, uploadFilename: string, open: boolean, providerId: string) => {

  try {
    const documentRequestDto = {
          documentTypeId: documentTypeId,
          filename: [uploadFilename],
          isAzureBlobFilename: false,
          format: "PDF",
          downloadAll: false
    };
    const response = await apiDownloadDocument(api, +providerId, documentRequestDto);
    if (open) {
      openDocumentInNewTab(response);
    }

    return response;
    } catch (error) {
        return null;
    }
};

export const verifyFormDocument = async (api: AxiosInstance, documentTypeId: number, uploadFilename: string, providerId: string) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/providers/${providerId}/credentialing-forms/documents/valid`,
      {
        documentTypeId: documentTypeId,
        uploadFilename: uploadFilename,
        providerId: providerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json"
      }
    );

    return response;
    } catch (error) {
        return null;
    }
};

export const getDocumentByProvider = async (api: AxiosInstance, providerId: string) => {
  try {
      const response = await api.get(BASE_URL + `/api/providers/${providerId}/credentialing-forms/documents`);
      return response.data
  } catch(error) {
      return null;
  }
}

export const getDownloadDocument = async (api: AxiosInstance, providerId:string , filename: string, documentType: string) => {

  try {
    const documentRequestDto = {
      filename: [filename],
      isAzureBlobFilename: true,
      format: "PDF",
      downloadAll: false
    };
    const response = await apiDownloadDocument(api, +providerId, documentRequestDto);
    downloadDocument(response, documentType);

    return response;
  } catch (error) {
    return null;
  }
};


export const getOpenDocument = async (api: AxiosInstance, providerId: string, filename: string) => {

  try {
    const documentRequestDto = {
        filename: [filename],
        isAzureBlobFilename: true,
        format: "PDF",
        downloadAll: false
    };
    const response = await apiDownloadDocument(api, +providerId, documentRequestDto);
    openDocumentInNewTab(response);

    return response;
  } catch (error) {
    return null;
  }
};

export const getDownloadAllDocuments = async (api: AxiosInstance, providerId: string) => {
  try {
      const documentRequestDto = {
          format: "ZIP",
          downloadAll: true
      };
      const response = await apiDownloadDocument(api, +providerId, documentRequestDto);
      downloadZipFile(response);
      return response
  } catch(error) {
      return null;
  }
}

export const getDownloadSelectedDocument = async (api: AxiosInstance, providerId: number, files: string[]) => {

  try {
    const documentRequestDto = {
        filename: files,
        isAzureBlobFilename: true,
        format: "ZIP",
        downloadAll: false
    };
    const response = await apiDownloadDocument(api, providerId, documentRequestDto);
    downloadZipFile(response);
    return response;
  } catch (error) {
    return null;
  }
};

const apiDownloadDocument = async (api: AxiosInstance, providerId:number, dto: object) => {

    try {
        return await api.post(
            BASE_URL + `/api/providers/${providerId}/credentialing-forms/documents`, dto, {
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "blob"
            }
        );
    } catch (error) {
        throw "Error downloading document";
    }
};
