// import { IPublicClientApplication } from "@azure/msal-browser";
// import { Form } from "../../Presentation/Layouts/formLayout/credInterfaces";

// export const mockJson = (formData: Form | undefined, instance: IPublicClientApplication) => {
//     const name = instance.getActiveAccount()?.idTokenClaims?.given_name + " " + instance.getActiveAccount()?.idTokenClaims?.family_name
//     const email = instance.getActiveAccount()?.username
//     const addressesPhysical = formData?.steps.addressesLocations.data?.values[0].physical.address1 + " " 
//     + formData?.steps.addressesLocations.data?.values[0].physical.city + " " + "Puerto Rico " + formData?.steps.addressesLocations.data?.values[0].physical.zipcode
//     const addressMail = formData?.steps.addressesLocations.data?.values[0].physical.address1 + " " 
//     + formData?.steps.addressesLocations.data?.values[0].physical.city + " " + "Puerto Rico " + formData?.steps.addressesLocations.data?.values[0].physical.zipcode

//     const corpAddressesPhysical = formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.address1 + " " 
//     + formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.zipcode
//     const corpAddressMail = formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.address1 + " " 
//     + formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.incorporatedPracticeProfile.data?.values[0].addressInfo.physical.zipcode

//     const pcpAddressesPhysical = formData?.steps.pcpContract.data?.addressInfo.physical.address1 + " " 
//     + formData?.steps.pcpContract.data?.addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.pcpContract.data?.addressInfo.physical.zipcode
//     const pcpAddressMail = formData?.steps.pcpContract.data?.addressInfo.physical.address1 + " " 
//     + formData?.steps.pcpContract.data?.addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.pcpContract.data?.addressInfo.physical.zipcode

//     const f330AddressesPhysical = formData?.steps.f330.data?.addressInfo.physical.address1 + " " 
//     + formData?.steps.f330.data?.addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.f330.data?.addressInfo.physical.zipcode
//     const f330AddressMail = formData?.steps.f330.data?.addressInfo.physical.address1 + " " 
//     + formData?.steps.f330.data?.addressInfo.physical.city + " " + "Puerto Rico " + formData?.steps.f330.data?.addressInfo.physical.zipcode

//    return {
//     "FormSections": {
//       "IndPrimaryPracticeProfile1": {
//          "providerName": name,
//          "provDateOfBirth": "01/25/1980",
//          "provGender": "Female",
//          "provIRenderingNpi": formData?.steps.individualPracticeProfile.data?.npiCertificateNumber ?? "12345678901234",
//          "provSSN": "***-**-" + formData?.steps.individualPracticeProfile.data?.ssn?.slice(-4) ?? "5555",
//          "provIndivTaxId": formData?.steps.individualPracticeProfile.data?.taxId ?? "12322123",
//          "provIndivMedLic": formData?.steps.individualPracticeProfile.data?.prMedicalLicenseNumber ?? "987654321",
//          "provIndSubSpecialty": formData?.steps.specialtiesAndSubspecialties.data?.specialties[0].name ?? "Allergist",
//          "provIPhysicalAddress": addressesPhysical ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "provIndMailAddress": addressMail ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "provIndivOfficePhone": "",
//          "provIndivEmail": email ?? ""
//       },
//       "CorporatePracticeProfile2": {
//          "corpPracticeName": formData?.steps.incorporatedPracticeProfile.data?.values[0].corporatePracticeName ?? "CORPORATION 1",
//          "corpIncEffectiveDate": formData?.steps.incorporatedPracticeProfile.data?.values[0].incorporationEffectiveDate,
//          "corpNPINumber": formData?.steps.incorporatedPracticeProfile.data?.values[0].corporationNpiNumber,
//          "corpRenderingNPI": formData?.steps.incorporatedPracticeProfile.data?.values[0].renderingNpiNumber,
//          "corpTaxIdNumber": formData?.steps.incorporatedPracticeProfile.data?.values[0].taxIdNumber ?? "1111111111",
//          "corpProvSpecialty": formData?.steps.incorporatedPracticeProfile.data?.values[0].specialtyTypeId ? "Primary Care" : "Specialty Care",
//          "corpProvSubSpecialty": "Allergist",
//          "corpPracticePhys": corpAddressesPhysical ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corpProvMedicaidId": formData?.steps.incorporatedPracticeProfile.data?.values[0].medicaidIdLocation,
//          "corpProvMailAddress": corpAddressMail ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corpProvPhoneNumber": formData?.steps.incorporatedPracticeProfile.data?.values[0].corporatePhoneNumber,
//          "corpEmployerIdPhys": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corpEntityType": formData?.steps.incorporatedPracticeProfile.data?.values[0].entityTypeId ?? "LLP",
//          "corpW9Number": "123456789"
//       },
//       "CorporatePracticeProfile2a": {
//          "corp2aPracticeName": "CORPORATION 2A",
//          "corp2aRenderingNPI": "43215678901234",
//          "corp2aTaxIdNumber": "***-**-5555",
//          "corp2aPSpecSubSpec": "Primary Care, Alergista",
//          "corp2aTaxIdName": "CORPORATION 2A",
//          "corp2aPracticePhys": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2aProvMailAddres": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2aProvPhoneNum": "787-555-5555",
//          "corp2aEmployerIdPhys": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2aEntityType": "Limited Liability Corporation",
//          "corp2aW9Number": "123456789"
//       },
//       "CorporatePracticeProfile2b": {
//          "corp2bPracticeName": "CORPORATION 2B",
//          "corp2bRenderingNPI": "43215678901234",
//          "corp2bTaxIdNumber": "***-**-5555",
//          "corp2bPSpecSubSpec": "Primary Care, Alergista",
//          "corp2bTaxIdName": "CORPORATION 2B",
//          "corp2bPracticePhys": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2bProvMailAddres": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2bProvPhoneNum": "787-555-5555",
//          "corp2bEmployerIdPhys": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "corp2bEntityType": "Limited Liability Corporation",
//          "corp2bW9Number": "123456789"
//       },
//       "PrimaryCarePhysicianPCP": {
//          "pcpGroupName": formData?.steps.pcpContract.data?.pmgName ?? "PRIMARY CARE PHYSICIAN PCP",
//          "pcpBillingNPI": formData?.steps.pcpContract.data?.billingNpiNumber ?? "43215678232",
//          "pcpTaxIdNumber": formData?.steps.pcpContract.data?.taxIdGroup ?? "3343987",
//          "pcpMedicaidId": formData?.steps.pcpContract.data?.medicaidIdLocation ?? "987654321",
//          "pcpRenderingNPI": formData?.steps.pcpContract.data?.npiGroupNumber ?? "43215678232",
//          "pcpPhysicalAddress": pcpAddressesPhysical ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "pcpMailAddress": pcpAddressMail ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "pcpEndorsementDate": formData?.steps.pcpContract.data?.endorsementLetterDate ?? "12/20/2010",
//          "pcpContactPhoneNum": formData?.steps.pcpContract.data?.contactNumber ?? "78743256322",
//          "pcpEmployerIdNum": formData?.steps.pcpContract.data?.employerId ?? "498573322",
//          "pcpEmail": formData?.steps.pcpContract.data?.email ?? "gflores@wovenware.com",
//          "pcpSpecialist": formData?.steps.pcpContract.data?.careTypeId === "2" ? "Specialist" : "PCP " + formData?.steps.pcpContract.data?.pcpSpecialtyId,
//          "pcpProvSpecialty": formData?.steps.pcpContract.data?.careTypeId === "1" ? "Primary Care" : "Specialty Care",
//          "pcpVITALServHours": "Monday, Tuesday, 8:00-10:00AM, 2:00-4:00PM"
//       },
//       "FederalQualifiedHealthCenter330": {
//          "f330GroupName": formData?.steps.f330.data?.pmgName ?? "FEDERAL QUALIFIED HEALTH CENTER 330",
//          "f330BillingNPI": formData?.steps.f330.data?.billingNpiNumber ?? "43215678232",
//          "f330TaxIdNumber": formData?.steps.f330.data?.taxIdGroup ?? "3343987",
//          "f330MedicaidId": formData?.steps.f330.data?.medicaidIdLocation ?? "987654321",
//          "f330RenderingNPI": formData?.steps.f330.data?.npiGroupNumber ?? "43215678232",
//          "f330PhysicalAddress": f330AddressesPhysical ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "f330MailAddress": f330AddressMail ?? "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "f330EndorsementDate": formData?.steps.f330.data?.endorsementLetterDate ?? "12/20/2010",
//          "f330ContactPhoneNum": formData?.steps.f330.data?.contactNumber ?? "78743256322",
//          "f330EmployerIdNum": formData?.steps.f330.data?.employerId ?? "498573322",
//          "f330Email": formData?.steps.f330.data?.email ?? "gflores@wovenware.com",
//          "f330Specialist": formData?.steps.f330.data?.careTypeId === "2" ? "Specialist" : "PCP " + formData?.steps.f330.data?.pcpSpecialtyId,
//          "f330ProvSpecialty": "Specialty Care",
//          "f330VITALServHours": "Monday, Tuesday, 8:00-10:00AM, 2:00-4:00PM"
//       },
//       "HospitalAffiliations": {
//       "Hospital1Affiliations" : {
//          "hosp1Name": "BAYAMON MEDICAL CENTER",
//          "hosp1PrivType": "Consulting Affilliate",
//          "hosp1PrivFrom": "("+formData?.steps.hospitalAffiliations.data?.primary.providerStartingMonth+", "+formData?.steps.hospitalAffiliations.data?.primary.providerStartingYear+")",
//          "hosp1PrivTo": "("+formData?.steps.hospitalAffiliations.data?.primary.providerEndingMonth+", "+formData?.steps.hospitalAffiliations.data?.primary.providerEndingYear+")"
//       },
//       "Hospital2Affiliations" : {
//          "hosp2Name": "DOCTOR CENTER HOSPITAL SAN JUAN",
//          "hosp2PrivType": "Clinical",
//          "hosp2PrivFrom": "("+formData?.steps.hospitalAffiliations.data?.secondary.providerStartingMonth+", "+formData?.steps.hospitalAffiliations.data?.secondary.providerStartingYear+")",
//          "hosp2PrivTo": "("+formData?.steps.hospitalAffiliations.data?.secondary.providerEndingMonth+", "+formData?.steps.hospitalAffiliations.data?.secondary.providerEndingYear+")"
//       }
//       },
//       "EducationAndTraining": {
//       "EducationSchool": [{
//          "eduSchoolName": formData?.steps.educationTraining.data?.medicalSchool[0].schoolName ?? "EDUCATION AND TRAINING",
//          "eduSchAddress": "Calle Luna, Esquina Sol #40",
//          "eduSchCityStZipCode": "San Juan PR 00936",
//          "eduSchGradDateFrom": "("+formData?.steps.educationTraining.data?.medicalSchool[0].graduationMonth+", "+formData?.steps.educationTraining.data?.medicalSchool[0].graduationYear+")",
//          "eduSchGradDateTo": "12/20/2010",
//          "eduSchSpecialty": `${formData?.steps.educationTraining.data?.medicalSchool[0].specialty ?? "Allergist"}, ${formData?.steps.educationTraining.data?.medicalSchool[0].specialtyCompletionDate ?? "12/20/2010"}, ${formData?.steps.educationTraining.data?.medicalSchool[0].specialtyDegree ?? "Family Care"}`}],
//       "EducationInternship":[{
//          "eduInternshipName": formData?.steps.educationTraining.data?.internship[0].institutionName ?? "INTERNSHIP",
//          "eduInternshipAddress": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "eduInternshipFrom": "("+formData?.steps.educationTraining.data?.internship[0].attendance.fromMonth+", "+formData?.steps.educationTraining.data?.internship[0].attendance.fromYear+")" ?? "09/2010",
//          "eduInternshipTo": "("+formData?.steps.educationTraining.data?.internship[0].attendance.toMonth+", "+formData?.steps.educationTraining.data?.internship[0].attendance.toYear+")" ?? "05/2011",
//          "eduIntProgramType": formData?.steps.educationTraining.data?.internship[0].programType ??"Internship Program Type"}],
//       "EducationResidency":[{
//          "eduResidency": "RESIDENCY",
//          "eduResidencyName": formData?.steps.educationTraining.data?.residency[0].institutionName ?? "RESIDENCY NAME",
//          "eduResidencyAddress": "Calle Luna, Esquina Sol #40, San Juan PR 00936",
//          "eduResCityStZipCode": "San Juan PR 00936",
//          "eduResidencyFrom": "("+formData?.steps.educationTraining.data?.residency[0].attendance.fromMonth+", "+formData?.steps.educationTraining.data?.residency[0].attendance.fromYear+")" ?? "12/2008",
//          "eduResidencyTo": "("+formData?.steps.educationTraining.data?.residency[0].attendance.fromMonth+", "+formData?.steps.educationTraining.data?.residency[0].attendance.fromYear+")" ?? "12/2010",
//          "eduResidencyType": "Residency Type",
//          "eduResidencyComplDt": formData?.steps.educationTraining.data?.residency[0].completionDate ?? "12/20/2008",
//          "eduResHospComplDt": "HOSPITAL A, 12/20/2008"}],
//       "EducationFellowship":[{
//          "eduFellowship": formData?.steps.educationTraining.data?.fellowship[0].institutionName ?? "FELLOWSHIP",
//          "eduFellowshipName": "FELLOWSHIP NAME, 12/20/2008",
//          "eduFellowshipAddres": "Calle Luna, Esquina Sol #40",
//          "eduFellowshipCity": "San Juan PR 00936",
//          "eduFellowshipFrom": "("+formData?.steps.educationTraining.data?.fellowship[0].attendance.fromMonth+", "+formData?.steps.educationTraining.data?.fellowship[0].attendance.fromYear+")" ?? "12/2008",
//          "eduFellowshipTo": "("+formData?.steps.educationTraining.data?.fellowship[0].attendance.fromMonth+", "+formData?.steps.educationTraining.data?.fellowship[0].attendance.fromYear+")" ?? "12/2010",
//          "eduFellowshipType": formData?.steps.educationTraining.data?.fellowship[0].programType ?? "Residency Type",
//          "eduFellowshipComplDt": "12/20/2008"}],
//       "EducationBoards": [{
//          "brdCertification": "BOARD CETIFICATION",
//          "brdSpecialty": "Allergist",
//          "brdSpecialtyFrom": formData?.steps.educationTraining.data?.boardCertificates[0].issuedDate ?? "12/20/2020",
//          "brdSpecialtyTo": formData?.steps.educationTraining.data?.boardCertificates[0].expirationDate ?? "12/20/2021"}]
//       },
//       "LicenseAndCertification":{
//         "LicenseDEA": {
//             "licDEACert" : formData?.steps.educationTraining.data?.licensesCertificates?.deaCertificate?.certificateNumber ??""
//         },
//         "LicenseASSMCA": {
//             "licASSMCACert" : formData?.steps.educationTraining.data?.licensesCertificates?.assmcaCertificate?.certificateNumber ??""
//         },
//         "LicenseMedical": {
//             "licMedicalLicense" : formData?.steps.educationTraining.data?.licensesCertificates?.prMedicalLicenseNumber ?? ""
//         },
//         "LicenseCollegiateMembership": {
//             "licCollegiateMember" : formData?.steps.educationTraining.data?.licensesCertificates?.membershipCertificate?.certificateNumber ?? ""
//         },
//         "LicensePTAN": {
//             "licPTAN" : formData?.steps.educationTraining.data?.licensesCertificates?.ptanCertificate?.certificateNumber ?? ""
//         },
//         "licTelemedicine": {
//             "LicenseTelemedicine" : formData?.steps.educationTraining.data?.licensesCertificates?.telemedicineCertificate?.certificateNumber ??""
//         }
//       },
//     "Malpractice": {
//         "malpCarrierName": "SIMED",
//         "malpEffectiveFrom": formData?.steps.professionalLiability.data?.malpractice?.insurancePolicyEffectiveDate ?? "09/08/2023",
//         "malpEffectiveTo": formData?.steps.professionalLiability.data?.malpractice?.insurancePolicyExpDate ?? "09/08/2023",
//         "malpPolicyNum": formData?.steps.professionalLiability.data?.malpractice?.policyNumber ?? "2123432",
//         "malpCoverageAmt": formData?.steps.professionalLiability.data?.malpractice?.coverageAmountPerOcurrence ?? "string",
//         "malpOIGCaseNum": "string"
//     },
//     "ProfessionalLiability": {
//         "profLCarrierName": "Triple-S",
//         "profLPolicyNum": formData?.steps.professionalLiability.data?.professionalLiability?.policyNumber ?? "2123432",
//         "profLCoverageAmt": formData?.steps.professionalLiability.data?.professionalLiability?.coverageAmountPerOcurrence ?? "string",
//         "profLEffectiveFrom": formData?.steps.professionalLiability.data?.professionalLiability?.insurancePolicyEffectiveDate ?? "09/08/2023",
//         "profLEffectiveTo": formData?.steps.professionalLiability.data?.professionalLiability?.insurancePolicyExpDate ?? "09/08/2023"
//     },
//     "NegativeCertificatePenalRecordDate": {
//         "NegCertPenalRecDate": formData?.steps.criminalRecord.data?.negativePenalRecordsDate ?? "07/12/2019"
//     },
//       "AdditionalDirectory": {
//          "adddirName": "",
//          "adddirAddress": "",
//          "adddirEmail": "",
//          "adddirMailAddrs": "",
//          "adddirPhone": "",
//          "adddirFacDisability": "",
//          "adddirAcceptNewPat": "",
//          "adddirNPI": "",
//          "adddirTransfClose": "",
//          "adddirOfficeHours": "",
//          "adddirNewAffiliat": "",
//          "adddirNewPractice": "",
//          "adddirPractiveMove": "",
//          "adddirPlanAccepted": ""
//       }
//    }
// }

// };