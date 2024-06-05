import { Form } from "../../../Layouts/formLayout/credInterfaces"

export const individualDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.individualPracticeProfile?.data;
};

export const incorporatedDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.incorporatedPracticeProfile.data;
};

export const addressDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.addressesLocations.data
}

export const specialtiesDefaultValues = (formData: Form | undefined) => {
    const specialties = formData?.steps.specialtiesAndSubspecialties.data?.specialties ?? [{ id: "", "evidenceFile": {name: "", documentTypeId: ""} }];
    const subspecialties = formData?.steps.specialtiesAndSubspecialties.data?.subspecialties ?? [{ id: "", "evidenceFile": {name: "", documentTypeId: ""} }];

    return {
        specialties: specialties,
        subspecialties: subspecialties,
    };
};

export const pcpDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.pcpContract?.data
};

export const F330DefaultValues = (formData: Form | undefined) => {
    return formData?.steps.f330?.data
};

export const hospitalDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.hospitalAffiliations?.data
};

export const educationDefaultValues = (formData: Form | undefined) => {
    const data = formData?.steps.educationTraining?.data

    return {
        "medicalSchool": data?.medicalSchool ?? [],
        "internship": data?.internship ?? [],
        "residency": data?.residency ?? [],
        "fellowship": data?.fellowship ?? [],
        "boardCertificates": data?.boardCertificates ?? [],
        "licensesCertificates": data?.licensesCertificates ??  {
            "prMedicalLicenseNumber": "",
            "prMedicalLicenseExpDate": "",
            "prMedicalLicenseFile": {
                name: "",
                documentTypeId: ""
            },
            "assmcaCertificate": {
                "haveCertificate": "",
                "certificateNumber": "",
                "certificateFile": {
                name: "",
                documentTypeId: ""
            },
                "expDate": "",
            },
            "deaCertificate": {
                "haveCertificate": "",
                "certificateNumber": "",
                "certificateFile": {
                name: "",
                documentTypeId: ""
            },
                "expDate": "",
            },
            "membershipCertificate": {
                "haveCertificate": "",
                "certificateNumber": "",
                "certificateFile": {
                name: "",
                documentTypeId: ""
            },
                "expDate": "",
            },
            "ptanCertificate": {
                "haveCertificate": "",
                "certificateNumber": "",
                "certificateFile": {
                name: "",
                documentTypeId: ""
            },
                "expDate": "",
            },
            "telemedicineCertificate": {
                "haveCertificate": "",
                "certificateNumber": "",
                "certificateFile": {
                name: "",
                documentTypeId: ""
            },
                "expDate": "",
              },
        }
    };
};

export const criminalRecordDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.criminalRecord?.data
};

export const insuranceDefaultValues = (formData: Form | undefined) => {
    return formData?.steps.professionalLiability?.data
};

// export const additionalInfoDefaultValues = (formData: Form | undefined) => {
//     return formData?.steps.additionalInformation?.data
// };