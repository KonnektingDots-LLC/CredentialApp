import { FieldValues } from "react-hook-form";
import { AdditionalInfo, CriminalRecordInterface, EducationAndTraining, HospitalAffiliationsInterface, 
    IndividualInterface, PCPInterface, PLInterface, SpecialtiesForm, F330Interface, Address, IncorporatedPracticeProfile, Residency, Fellowship, Internship, boardCertificates } from "../../Presentation/Layouts/formLayout/credInterfaces";
import { UserInfo } from "../interfaces";

export type ExtendedFieldValues = FieldValues 
    & SpecialtiesForm 
    & IndividualInterface
    & IncorporatedPracticeProfile
    // & AddressLocations
    & Address
    & PLInterface
    & F330Interface
    & HospitalAffiliationsInterface
    & EducationAndTraining
    & CriminalRecordInterface
    & PCPInterface
    & AdditionalInfo
    & UserInfo

    export const LIMIT_PER_PAGE = 10;

    export const roleRouteMap = {PROV:'/provider', DELG:'/delegate',INSR:'/insurance', AINS:'/admin-insurer', ADMI:'/admin'};

    export const FormStatusColor = {Draft: "E5A000", Submitted: "005ea2", Returned: "B50909", Approved: "00A91C", Pending: "E5A000", Rejected: "B50909", Completed: "00A91C"};

export const defaultInternshipStruct: Partial<Internship>[] = [{
    "institutionName": "",
    "addressInfo": {
        "stateId": "",
        "addressCountryId": "",
        "address1": "",
        "address2": "",
        "city": "",
        "zipcode": "",
        "zipcodeExtension": "",
        "internationalCode": ""
    },
    "attendance": {
        "fromMonth": "",
        "fromYear": "",
        "toMonth": "",
        "toYear": ""
    },
    "programType": "",
    "evidenceFile": {
        "name": "",
        "documentTypeId": ""
    }
}];

export const defaultResidencyStruct: Partial<Residency>[] = [{
    "institutionName": "",
    "addressInfo": {
        "stateId": "",
        "addressCountryId": "",
        "address1": "",
        "address2": "",
        "city": "",
        "zipcode": "",
        "zipcodeExtension": "",
        "internationalCode": "",
        "stateOther": ""
    },
    "attendance": {
        "fromMonth": "",
        "fromYear": "",
        "toMonth": "",
        "toYear": ""
    },
    "programType": "",
    "evidenceFile": {
        "name": "",
        "documentTypeId": ""
    },
    "completionDate": "",
    "postGraduateCompletionDate": ""
}];

export const defaultFellowshipStruct: Partial<Fellowship>[] = [{
    "institutionName": "",
    "addressInfo": {
        "stateId": "",
        "addressCountryId": "",
        "address1": "",
        "address2": "",
        "city": "",
        "zipcode": "",
        "zipcodeExtension": "",
        "internationalCode": "",
        "stateOther": ""
    },
    "attendance": {
        "fromMonth": "",
        "fromYear": "",
        "toMonth": "",
        "toYear": "",
    },
    "programType": "",
    "evidenceFile": {
        "name": "",
        "documentTypeId": ""
    }, 
    "completionDate": ""
}];

export const defaultBoardStruct: Partial<boardCertificates>[] = [{
    "certificateFile": {
        "name": "",
        "documentTypeId": ""
    },
    "expirationDate": "",
    "issuedDate": "",
    "specialtyBoard": []
}];