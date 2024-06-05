import { AxiosInstance } from "axios";
import { BASE_URL } from "../axiosConfig";
import { downloadDocument, downloadZipFile, openDocumentInNewTab } from "../../Application/utils/helperMethods";

export const getFormDocument = async (api: AxiosInstance, documentTypeId: number, uploadFilename: string, open: boolean, providerId: string) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/Document/DownloadReview`,
      {
        documentTypeId: documentTypeId,
        uploadFilename: uploadFilename,
        providerId: providerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob"
      }
    );
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
      BASE_URL + `/api/Document/IsDocumentFound`,
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
      const response = await api.get(BASE_URL + `/api/Document/DocumentByProvider?providerId=${providerId}`);
      return response.data
  } catch(error) {
      return null;
  }
}

export const getDownloadDocument = async (api: AxiosInstance, filename: string, documentType: string) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/Document/Download`, { azureBlobFilename: filename}, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob"
      }
    );
    downloadDocument(response, documentType);

    return response;
  } catch (error) {
    return null;
  }
};


export const getOpenDocument = async (api: AxiosInstance, filename: string) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/Document/Download`, { azureBlobFilename: filename }, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob"
      }
    );
    openDocumentInNewTab(response);

    return response;
  } catch (error) {
    return null;
  }
};

export const getDownloadAllDocuments = async (api: AxiosInstance, providerId: string) => {
  try {
      const response = await api.get(BASE_URL + `/api/Document/DownloadZipByProvider?providerId=${providerId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
         responseType: "blob"
      })
      downloadZipFile(response);

      return response
  } catch(error) {
      return null;
  }
}

export const getDownloadSelectedDocument = async (api: AxiosInstance, files: { azureBlobFilename: string; }[]) => {

  try {
    const response = await api.post(
      BASE_URL + `/api/Document/DownloadZipByProviderSelection`, files, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob"
      }
    );
    downloadZipFile(response);

    return response;
  } catch (error) {
    return null;
  }
};
