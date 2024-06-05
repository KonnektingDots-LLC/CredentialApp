import { STATUS, STATUS_CODE } from "./utils/enums";

export interface DocumentData{
    azureBlobFilename: string;
    name: string;
}

export interface PaginationData {
    page: number;
    totalPages: number;
    documents: DocumentData[];
}

export interface NPIData {
    id:string;
}

export interface UserInfo {
    providerTypeId: string,
    email: string,
    firstName: string,
    middleName: string,
    lastName: string,
    surName: string,
    birthDate: string,
    gender: string,
    phoneNumber: string,
    renderingNpi: string,
    billingNpi: string,
    billingSameAsRenderingNpi: boolean,
    multipleNpi?: [
        {
        npi: string,
        corporateName: string
        }
    ],
    attestation: boolean,
    credFormId: number
}

export interface ProviderType {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
}

export interface Country {
    id: number;
    name: string;
}

export interface HospitalList {
    id: number;
    name: string;
    businessName: string;
}

export interface HospitalPrivilegesType {
    id: number;
    name: string;
}

export interface InsuranceCarrierName {
    id: number;
    name: string;
}

export interface Specialty {
    id: number;
    name: string;
}

export interface PlanAcceptanceInterface {
    id: number;
    name: string;
}

export interface DelegateInfo {
    email: string,
    fullName: string,
    delegateTypeId: number,
    delegateCompanyId: number
}

export interface ProvidersList {
    providerId: number;
    name: string;
    middleName: string;
    lastName: string;
    surName: string;
    email: string;
    phoneNumber?: string;
    renderingNPI: string;
    billingNPI?: string;
    statusName: STATUS;
}

export interface Files {
    documentTypeId: string;
    file: File;
    oldFilename?: string;
    npi?: string;
    issueDate?: string;
    expirationDate?: string;
}

export interface FileForm {
    name: string;
    documentTypeId: string;
}

export interface InsurerInfo {
    name: string,
    middleName: string,
    lastName: string,
    surName: string
}

export interface InsurersList {
    id: number,
    email: string,
    name: string,
    middleName: string,
    lastName: string,
    surname: string,
    isActive: boolean
}

export interface AdminInsurerInfo {
    name: string,
    middleName: string,
    lastName: string,
    surname: string,
    email: string
}

export interface AdminInfo {
    name: string,
    middleName: string,
    lastName: string,
    surname: string,
    email: string
}

export interface DelegatesList {
    id: number,
    email: string,
    fullName: string,
    isActive: boolean
}

export interface FormStatus {
    name: string;
    status: STATUS;
    currentStatusDate: string;
    note?: string;
}

export interface ProviderSubmitInterface {
    providerId: number;
    name: string;
    middleName: string;
    lastName: string;
    surname: string;
    email: string;
    renderingNPI: string;
    summary: {
        lastSubmitDate: string
    },
    insurerStatusList: FormStatus[];
}

export interface StatusHistory {
    providerInsurerCompanyStatusId: number;
    insurerStatusTypeId: STATUS_CODE;
    statusDate: string;
    comment: string;
    commentDate: string;
    createdBy: string;
}

export interface ProviderDetail {
    providerId: number;
    name: string;
    middleName: string;
    lastName: string;
    surName: string;
    email: string;
    phoneNumber?: string;
    renderingNPI: string;
    billingNPI?: string;
    StatusSummary: {
        picsId: number;
        insurerStatusTypeId: STATUS_CODE;
        providerId: number;
        insurerCompanyId: string;
        currentStatusDate: string;
        submitDate?: string;
        comment: string;
        commentDate: string;
    },
    StatusHistory: StatusHistory[];
}
