import { Form, IncorporatedResultItem } from "../../Presentation/Layouts/formLayout/credInterfaces";
import NavStepperStatus from "../../Presentation/Pages/CredForm/Components/NavStepperStatus";
import { FileForm } from "../interfaces";
import { formatServiceHours, processCertificate, processZipcode } from "./helperMethods";

export const jsonFormatter = (formData: Form | undefined) => {
    let individualResult, incorporatedResult, addressResult, specialtyResult, 
        pcpResult: any = {}, f330Result: any = {}, hospitalResult: Partial<HospitalAffiliation> = {}, 
        educationResult, criminalResult, insuranceResult: InsuranceResult = {};


    const individual = formData?.steps.individualPracticeProfile.data;
    if (individual) {
        individualResult = {
            ...individual,
            citizenshipTypeId: parseInt(formData?.steps.individualPracticeProfile.data?.citizenshipTypeId ?? "2"),
            idType: parseInt(formData.steps.individualPracticeProfile.data?.idType ?? "9"),
        }

        if (formData?.steps.individualPracticeProfile.data?.negativePenalCertificateExpDate) {
            delete individualResult.negativePenalCertificateExpDate;
        }
        if (formData?.steps.individualPracticeProfile.data?.negativePenalCertificateIssuedDate) {
            delete individualResult.negativePenalCertificateIssuedDate;
        }
        if (formData?.steps.individualPracticeProfile.data?.negativePenalCertificateFile?.documentTypeId) {
            delete individualResult.negativePenalCertificateFile;
        }
    }
    
    const incorporated = formData?.steps?.incorporatedPracticeProfile?.data;
    const isValidIncorporatedData = incorporated && formData?.steps?.incorporatedPracticeProfile?.status === NavStepperStatus.Completed;
    if (isValidIncorporatedData) {
        incorporatedResult = incorporated.values.map(value => {
            const { w9File, ...otherValues } = value;
            const processedPhysical = processZipcode(value.addressInfo?.physical);
            const processedMail = processZipcode(value.addressInfo?.mail);
            const processedEmployer = processZipcode(value?.employerIDAddressInfo?.physical);

            const sameAsPhysical = value?.addressInfo?.isPhysicalAddressSameAsMail;
            const subspecialtyArray = typeof value?.subspecialty === 'string' ? [] : value?.subspecialty;

            const result: IncorporatedResultItem = {
                ...otherValues,
                corporateTaxType: parseInt(value?.corporateTaxType ?? "1"),
                participateMedicaid: value?.participateMedicaid === "Yes" ? true : false,
                specialtyTypeId: 1,
                subspecialty: subspecialtyArray,
                medicaidIdLocation: value?.medicaidIdLocation ?? "",
                addressInfo: {
                    ...value.addressInfo,
                    physical: {
                        ...processedPhysical,
                        stateId: parseInt(value?.addressInfo?.physical?.stateId ?? "56"),
                        addressCountryId: 226,
                        internationalCode: ""
                    },
                    mail: {
                        ...processedMail,
                        stateId: parseInt(sameAsPhysical ? value?.addressInfo?.physical?.stateId : value?.addressInfo?.mail?.stateId),
                        addressCountryId: 226,
                        internationalCode: ""
                    }
                },
                employerIDAddressInfo: {
                    ...processedEmployer,
                    stateId: parseInt(value?.addressInfo?.physical?.stateId ?? "56"),
                    addressCountryId: 226,
                    internationalCode: ""
                },
            entityTypeId: parseInt(value?.entityTypeId ?? "1")
            }
            if (w9File?.documentTypeId) {
                result.w9File = {
                    name: w9File?.name ?? "",
                    documentTypeId: parseInt(w9File?.documentTypeId)
                };
            }
        return result
        });
    }

    const address = formData?.steps?.addressesLocations?.data;
    if (address && address.values) {
        addressResult = address?.values.map(value => {
            const processedPhysical = processZipcode(value.addressInfo?.physical);
            const processedMail = processZipcode(value.addressInfo?.mail);

            return {
                ...value,
                addressPrincipalTypeId: parseInt(value?.addressPrincipalTypeId ?? "1"),
                isActive: value?.isActive === "active" ? true : false,
                isAcceptingNewPatients: value?.isAcceptingNewPatients === "yes" ? true : false,
                isComplyWithAda: value?.isComplyWithAda === "yes" ? true : false,
                medicalId: value?.medicalId ?? "",
                addressInfo: {
                    ...value.addressInfo,
                    physical: {
                        ...processedPhysical,
                        stateId: parseInt(value?.addressInfo?.physical?.stateId ?? "56"),
                        addressCountryId: 226,
                        internationalCode: ""
                    },
                    mail: {
                        ...processedMail,
                        stateId: parseInt(value?.addressInfo?.mail?.stateId ?? "56"),
                        addressCountryId: 226,
                        internationalCode: ""
                    },
                },
                serviceHours: formatServiceHours(value?.serviceHours ?? [])
            };
        });
    }

    const specialtyPage = formData?.steps?.specialtiesAndSubspecialties?.data;
    if (specialtyPage) {
        const updatedSpecialties = specialtyPage.specialties.map(specialty => ({
            ...specialty,
            id: parseInt(specialty?.id ?? "1")
        }));

        const updatedSubspecialties = specialtyPage.subspecialties
        .filter(subspecialty => subspecialty.id && subspecialty.id !== "0" && subspecialty.id !== "")
        .map(subspecialty => ({
            ...subspecialty,
            id: parseInt(subspecialty?.id ?? "1")
        }));

        specialtyResult = {
            ...specialtyPage,
            specialties: updatedSpecialties,
            subspecialties: updatedSubspecialties
        };
    }

    const pcp = formData?.steps?.pcpContract?.data;
    const sameAsPhysicalPCP = pcp?.addressInfo?.isPhysicalAddressSameAsMail
    if (pcp) {
        pcpResult = {
            ...pcp,
            pcpOrSpecialistId: 1,
            specifyPrimaryCareId: parseInt(pcp?.specifyPrimaryCareId ?? "1"),
            typeOfSpecialistId: 0,
            addressInfo: {
                ...pcp.addressInfo,
                physical: {
                    ...processZipcode(pcp.addressInfo?.physical),
                    stateId: parseInt(pcp.addressInfo?.physical?.stateId),
                    addressCountryId: 226,
                    internationalCode: ""
                },
                mail: {
                    ...processZipcode(pcp.addressInfo?.mail),
                    stateId: parseInt(sameAsPhysicalPCP ? pcp.addressInfo?.physical?.stateId : pcp.addressInfo?.mail?.stateId),
                    addressCountryId: 226,
                    internationalCode: ""
                },
            },
        }
        if (pcp.serviceHours) {
            pcpResult.serviceHours = formatServiceHours(pcp?.serviceHours ?? []);
        }
    
    }

    const f330 = formData?.steps?.f330?.data;
    const sameAsPhysical330 = f330?.addressInfo?.isPhysicalAddressSameAsMail
    if (f330) {
        f330Result = {
            ...f330,
            pcpOrSpecialistId: parseInt(f330?.pcpOrSpecialistId ?? "1"),
            specifyPrimaryCareId: parseInt(f330?.specifyPrimaryCareId ?? "1"),
            typeOfSpecialistId: parseInt(f330?.typeOfSpecialistId ?? "1"),
            addressInfo: {
                ...f330.addressInfo,
                physical: {
                    ...processZipcode(f330.addressInfo?.physical),
                    stateId: parseInt(f330.addressInfo?.physical?.stateId),
                    addressCountryId: 226,
                    internationalCode: ""
                },
                mail: {
                    ...processZipcode(f330.addressInfo?.mail),
                    stateId: parseInt(sameAsPhysical330 ? f330.addressInfo?.physical?.stateId : f330.addressInfo?.mail?.stateId),
                    addressCountryId: 226,
                    internationalCode: ""
                },
            },
            endorsementLetterDate: f330?.endorsementLetterDate ?? "",
        }
        if (f330Result.endorsementLetterFile.name === "" || !f330Result.endorsementLetterFile.documentTypeId) {
            delete f330Result.endorsementLetterFile;
        }
        if (f330.serviceHours) {
            f330Result.serviceHours = formatServiceHours(f330?.serviceHours ?? []);
        }
    }

    const hospitals = formData?.steps?.hospitalAffiliations?.data;
    type HospitalAffiliation = {
        primary: {
            hospitalListId: number;
            hospitalPrivilegesType: number;
            providerStartingMonth: number;
            providerStartingYear: number;
            providerEndingMonth: number;
            providerEndingYear: number;
            hospitalListOther: string;
            hospitalPrivilegesTypeOther: string;
        };
        secondary?: {
            hospitalListId: number;
            hospitalPrivilegesType: number;
            providerStartingMonth: number;
            providerStartingYear: number;
            providerEndingMonth: number;
            providerEndingYear: number;
            hospitalListOther: string;
            hospitalPrivilegesTypeOther: string;
        };
    }
    if (hospitals) {
        hospitalResult = {
            primary: {
                ...hospitals?.primary,
                hospitalListId: parseInt(hospitals?.primary?.hospitalListId ?? "1"),
                hospitalPrivilegesType: parseInt(hospitals?.primary?.hospitalPrivilegesType ?? "1"),
                providerStartingMonth: parseInt(hospitals?.primary?.providerStartingMonth ?? "1"),
                providerStartingYear: parseInt(hospitals?.primary?.providerStartingYear ?? "1"),
                providerEndingMonth: parseInt(hospitals?.primary?.providerEndingMonth ?? "1"),
                providerEndingYear: parseInt(hospitals?.primary?.providerEndingYear ?? "1"),
                hospitalListOther: hospitals?.primary?.hospitalListOther ?? "",
                hospitalPrivilegesTypeOther: hospitals?.primary?.hospitalPrivilegesTypeOther ?? ""
            },
        }
        const hasValidSecondaryHospitalListId = hospitals?.secondary?.hospitalListId && hospitals?.secondary?.hospitalListId !== "0";
        const hasValidSecondaryHospitalPrivilegesType = hospitals?.secondary?.hospitalPrivilegesType && hospitals?.secondary?.hospitalPrivilegesType !== "0";
    
        if (hasValidSecondaryHospitalListId && hasValidSecondaryHospitalPrivilegesType) {
            hospitalResult.secondary = {
                ...hospitals?.secondary,
                hospitalListId: parseInt(hospitals?.secondary?.hospitalListId ?? "1"),
                hospitalPrivilegesType: parseInt(hospitals?.secondary?.hospitalPrivilegesType ?? "1"),
                providerStartingMonth: parseInt(hospitals?.secondary?.providerStartingMonth ?? "1"),
                providerStartingYear: parseInt(hospitals?.secondary?.providerStartingYear ?? "1"),
                providerEndingMonth: parseInt(hospitals?.secondary?.providerEndingMonth ?? "1"),
                providerEndingYear: parseInt(hospitals?.secondary?.providerEndingYear ?? "1"),
                hospitalListOther: hospitals?.secondary?.hospitalListOther ?? "",
                hospitalPrivilegesTypeOther: hospitals?.secondary?.hospitalPrivilegesTypeOther ?? ""
            }
        }
    }

    const education = formData?.steps?.educationTraining?.data;
    let internshipArray: any = [];
    let residencyArray: any = [];
    let fellowshipArray: any = [];
    let boardCertificatesArray: any = [];
    type Certificate = {
        haveCertificate?: string;
        certificateNumber?: string;
        expDate?: string;
        certificateFile?: {
            name: string;
            documentTypeId?: number;
        };
    };
    
    type LicensesCertificatesObject = {
        prMedicalLicenseNumber?: string;
        prMedicalLicenseExpDate?: string;
        prMedicalLicenseFile?: FileForm;
        membershipCertificate?: Certificate;
        assmcaCertificate?: Certificate;
        deaCertificate?: Certificate;
        ptanCertificate?: Certificate;
        telemedicineCertificate?: Certificate;
        [key: string]: any | undefined;
    };
    
    const licensesCertificatesObject: LicensesCertificatesObject  = {};
    if (education) {
        if (education.internship) {
            internshipArray = education.internship.map(item => {
                return  !item?.institutionName && !item?.programType ? {} : {
                ...item,
                addressInfo: {
                    ...processZipcode(item?.addressInfo),
                    stateId:  parseInt(item?.addressInfo?.stateId ?? "1"),
                    addressCountryId: parseInt(item.addressInfo?.addressCountryId ?? "226"),
                    internationalCode: item?.addressInfo?.internationalCode ?? ""
                },
                attendance: {
                    ...item?.attendance,
                    fromMonth:  parseInt(item?.attendance?.fromMonth ?? "1"),
                    fromYear: parseInt(item?.attendance?.fromYear ?? "1"),
                    toMonth:  parseInt(item?.attendance?.toMonth ?? "1"),
                    toYear:  parseInt(item?.attendance?.toYear ?? "1"),
                }
            }}).filter(item => Object.keys(item).length !== 0);
        }

        if (education.residency) {
            residencyArray = education.residency.map(item => {
                return !item?.institutionName && !item?.programType ? {} : {
                ...item,
                addressInfo: {
                    ...processZipcode(item?.addressInfo),
                    stateId:  parseInt(item?.addressInfo?.stateId ?? "1"),
                    addressCountryId: parseInt(item.addressInfo?.addressCountryId ?? "226"),
                    internationalCode: item?.addressInfo?.internationalCode ?? ""
                },
                attendance: {
                    ...item?.attendance,
                    fromMonth:  parseInt(item?.attendance?.fromMonth ?? "1"),
                    fromYear: parseInt(item?.attendance?.fromYear ?? "1"),
                    toMonth:  parseInt(item?.attendance?.toMonth ?? "1"),
                    toYear:  parseInt(item?.attendance?.toYear ?? "1"),
                },
            }}).filter(item => Object.keys(item).length !== 0);
        }
        
        if (education.fellowship) {
            fellowshipArray = education.fellowship.map(item => {
                return !item?.institutionName && !item?.completionDate ? {} : {
                    ...item,
                    addressInfo: {
                        ...processZipcode(item?.addressInfo),
                        stateId: parseInt(item?.addressInfo?.stateId ?? "1"),
                        addressCountryId: parseInt(item.addressInfo?.addressCountryId ?? "226"),
                        internationalCode: item?.addressInfo?.internationalCode ?? ""
                    },
                    attendance: {
                        ...item?.attendance,
                        fromMonth: parseInt(item?.attendance?.fromMonth ?? "1"),
                        fromYear: parseInt(item?.attendance?.fromYear ?? "1"),
                        toMonth: parseInt(item?.attendance?.toMonth ?? "1"),
                        toYear: parseInt(item?.attendance?.toYear ?? "1"),
                    },
                    completionDate: item?.completionDate ?? "",
                    evidenceFile: {
                        name: item?.evidenceFile?.name ?? "",
                        documentTypeId: parseInt(item?.evidenceFile?.documentTypeId ?? "1")
                    }
                };
            }).filter(item => Object.keys(item).length !== 0);
        }
    
        if (education.boardCertificates) {
            boardCertificatesArray = education.boardCertificates.map(item => {
                return !item?.expirationDate && !item?.issuedDate ? {} : {
                    ...item,
                    certificateFile: {
                        name: item?.certificateFile?.name ?? "",
                        documentTypeId: parseInt(item?.certificateFile?.documentTypeId ?? "1")
                    },
                    specialtyBoard: item?.specialtyBoard ?? [],
                    issuedDate: item?.issuedDate ?? "",
                    expirationDate: item?.expirationDate ?? ""
                };
            }).filter(item => Object.keys(item).length !== 0);
        }
    
        if (education.licensesCertificates) {
            const assmcaResult = processCertificate(education?.licensesCertificates?.assmcaCertificate);
            if (assmcaResult) licensesCertificatesObject.assmcaCertificate = assmcaResult;
        
            const deaResult = processCertificate(education?.licensesCertificates?.deaCertificate);
            if (deaResult) licensesCertificatesObject.deaCertificate = deaResult;

            const ptanResult = processCertificate(education?.licensesCertificates?.ptanCertificate);
            if (ptanResult) licensesCertificatesObject.ptanCertificate = ptanResult;

            const telemedicineResult = processCertificate(education?.licensesCertificates?.telemedicineCertificate);
            if (telemedicineResult) licensesCertificatesObject.telemedicineCertificate = telemedicineResult;

            const membershipResult = processCertificate(education?.licensesCertificates?.membershipCertificate);
            if (membershipResult) licensesCertificatesObject.membershipCertificate = membershipResult;

            licensesCertificatesObject.prMedicalLicenseNumber = education.licensesCertificates.prMedicalLicenseNumber;
            licensesCertificatesObject.prMedicalLicenseExpDate = education.licensesCertificates.prMedicalLicenseExpDate;
            licensesCertificatesObject.prMedicalLicenseFile = education.licensesCertificates.prMedicalLicenseFile;

            Object.keys(licensesCertificatesObject).forEach(key => {
                if (licensesCertificatesObject[key] === null) {
                    delete licensesCertificatesObject[key];
                }
            });
        }

        educationResult = {
            ...education,
            medicalSchool: education.medicalSchool.map(item => {
                return {
                ...item,
                addressInfo: {
                    ...processZipcode(item?.addressInfo),
                    stateId:  parseInt(item.addressInfo?.stateId ?? "1"),
                    addressCountryId: parseInt(item.addressInfo?.addressCountryId ?? "226")
                },
                graduationMonth:  parseInt(item?.graduationMonth ?? "1"),
                graduationYear:  parseInt(item?.graduationYear ?? "1"),
            }}),
            internship: internshipArray.length ? internshipArray : [],
            residency: residencyArray.length ? residencyArray : [],
            fellowship: fellowshipArray.length ? fellowshipArray : [],
            boardCertificates: boardCertificatesArray.length ? boardCertificatesArray : [],
            licensesCertificates: licensesCertificatesObject,
        };
    }

    const criminalRecord = formData?.steps?.criminalRecord?.data;
    if (criminalRecord) {
        criminalResult = {
            ...criminalRecord,
        }

        if (formData?.steps.criminalRecord.data?.negativePenalRecordsDate) {
            delete criminalResult.negativePenalRecordsDate;
        }
    }

    const insurance = formData?.steps?.professionalLiability?.data;

    let professionalLiabilityObject = {};
    if (insurance?.professionalLiability.isSelected) {
        professionalLiabilityObject = {
            ...insurance.professionalLiability,
            professionalLiabilityCarrierId: parseInt(insurance?.professionalLiability?.professionalLiabilityCarrierId ?? "1"),
            isSelected: insurance?.professionalLiability?.isSelected ?? false,
            policyNumber: insurance?.professionalLiability?.policyNumber ?? "",
            coverageAmountPerOcurrence: insurance?.professionalLiability?.coverageAmountPerOcurrence ?? "",
            coverageAggregateLimit: insurance?.professionalLiability?.coverageAggregateLimit ?? "",
            insurancePolicyEffectiveDate: insurance?.professionalLiability?.insurancePolicyEffectiveDate ?? "",
            insurancePolicyExpDate: insurance?.professionalLiability?.insurancePolicyExpDate ?? "",
            certificateCoverageFile: insurance?.professionalLiability?.certificateCoverageFile?.documentTypeId ? {
                name: insurance?.professionalLiability?.certificateCoverageFile?.name ?? "",
                documentTypeId: insurance?.professionalLiability?.certificateCoverageFile?.documentTypeId ?? 1 
            } : {}
        };
    }
    interface InsuranceResult {
        malpractice?: any; 
        professionalLiability?: typeof professionalLiabilityObject;
        actionExplanationFormFile?: FileForm;
    }
    if (insurance) {
        const nonEmptyOigCaseNumbers = insurance?.malpractice?.oigCaseNumber?.filter(caseNumber => caseNumber.trim() !== '') ?? [];
        insuranceResult = {
            malpractice: {
                ...insurance.malpractice,
                malpracticeCarrierId: parseInt(insurance?.malpractice?.malpracticeCarrierId ?? "1"),
                oigCaseNumber: nonEmptyOigCaseNumbers
            }
            // ...(insurance?.link1File?.documentTypeId ? { link1File: { name: insurance?.link1File?.name, documentTypeId: insurance?.link1File?.documentTypeId } } : {}),
            // ...(insurance?.link2File?.documentTypeId ? { link2File: { name: insurance?.link2File?.name, documentTypeId: insurance?.link2File?.documentTypeId } } : {}),
            // ...(insurance?.link3File?.documentTypeId ? { link3File: { name: insurance?.link3File?.name, documentTypeId: insurance?.link3File?.documentTypeId } } : {}),
            // ...(insurance?.link4File?.documentTypeId ? { link4File: { name: insurance?.link4File?.name, documentTypeId: insurance?.link4File?.documentTypeId } } : {})
        }
        if (Object.keys(professionalLiabilityObject).length > 0) {
            insuranceResult.professionalLiability = professionalLiabilityObject;
        }
        if (Object.keys(insurance?.actionExplanationFormFile).length > 0) {
            insuranceResult.actionExplanationFormFile = insurance?.actionExplanationFormFile
        }
    }

    const attestation = {
        isAccept: true,
        attestationDate: new Date()
    }

    const result = {
        "setup": formData?.setup,
        "individualPracticeProfile": individualResult,
        "incorporatedPracticeProfile": incorporatedResult,
        "addressAndLocation": addressResult,
        "specialtiesAndSubspecialties": specialtyResult,
        ...(Object.keys(pcpResult).length !== 0 ? { "pcp": pcpResult } : {}),
        ...(Object.keys(f330Result).length !== 0 ? { "f330": f330Result } : {}),
        ...(Object.keys(hospitalResult).length !== 0 ? { "hospitalAffiliations": hospitalResult } : {}),
        "educationAndTraining": educationResult,
        "criminalRecord": criminalResult,
        ...(Object.keys(insuranceResult).length !== 0 ? { "insurance": insuranceResult } : {}),
        "attestation": attestation
    }

    if (isValidIncorporatedData) result["incorporatedPracticeProfile"] = incorporatedResult;

    return result
};