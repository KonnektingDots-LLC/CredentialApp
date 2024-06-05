import { FileForm } from "../../../Application/interfaces"
import NavStepperStatus from "../../Pages/CredForm/Components/NavStepperStatus"

export interface Form {
  setup: SetupForm,
  steps: {
    individualPracticeProfile: {
      status: NavStepperStatus 
      data: IndividualInterface | undefined
    },
    incorporatedPracticeProfile: {
      status: NavStepperStatus,
      count: number,
      data: IncorporatedPracticeProfile | undefined
    },
    addressesLocations: {
      status: NavStepperStatus,
      count: number,
      data: AddressLocations | undefined
    },
    specialtiesAndSubspecialties: {
      status: NavStepperStatus,
      // countSpec: number,
      // countSubspec: number,
      data: SpecialtiesForm | undefined
    },
    pcpContract: {
      status: NavStepperStatus
      data: PCPInterface | undefined
    },
    f330: {
      status: NavStepperStatus
      data: F330Interface | undefined
    },
    hospitalAffiliations: {
      status: NavStepperStatus
      data: HospitalAffiliationsInterface | undefined
    },
    educationTraining: {
      status: NavStepperStatus,
      countMedSchool: number,
      countInternship: number,
      countFellowship: number,
      countResidency: number,
      countBoard: number,
      data: EducationAndTraining | undefined
    },
    criminalRecord: {
      status: NavStepperStatus
      data: CriminalRecordInterface | undefined
    },
    professionalLiability: {
      status: NavStepperStatus
      data: PLInterface | undefined
    },
    submit: {
      status: NavStepperStatus
      data: Attestation | undefined
    }
  }
}

export interface SetupForm {
  hasStarted: boolean;
  f330Applies: boolean;
  pcpApplies: boolean
  hospitalAffiliationsApplies: boolean;
  insuranceApplies: boolean;
  currentStep: string;
  providerId: number;
  providerEmail: string;
}

export interface IndividualInterface {
  citizenshipTypeId: string;
  idType: string;
  ssn?: string;
  idFile?: FileForm;
  idExpDate?: string;
  isPassportForeign?: boolean;
  immigrantDocumentFile?: FileForm;
  taxId: string;
  prMedicalLicenseNumber: string;
  npiCertificateFile: FileForm;
  npiCertificateNumber: string;
  negativePenalCertificateFile?: FileForm;
  negativePenalCertificateIssuedDate?: string;
  negativePenalCertificateExpDate?: string;
  curriculumVitaeFile: FileForm;
  foreignPassport?: string;
  foreignPassportExpDate?: string;
  planAccept: number[];
}

export interface IncorporatedPracticeProfile {
  "values": [{
    publicId: string,
    corporatePracticeName: string;
    incorporationEffectiveDate?: string;
    corporationNpiNumber?: string;
    renderingNpiNumber: string;
    corporateTaxType: string;
    corporateTaxNumber: string;
    specialtyTypeId?: string;
    subspecialty?: number[];
    medicaidIdLocation?: string;
    addressInfo: {
      isPhysicalAddressSameAsMail: boolean;
      physical: Address;
      mail: Address;
    };
    corporatePhoneNumber: string;
    employerIDAddressInfo: {
      physical: Address;
    };
    entityTypeId: string;
    entityTypeOther: string;
    corporationCertificateFile: FileForm;
    corporateNpiCertificateFile: FileForm;
    w9File?: FileForm;
    taxIdNumber?: string;
    taxIdName?: string;
    participateMedicaid: string;
  }]
  // "additionals": AdditionalIncorporatedPracticeProfile[]
}

export interface AdditionalIncorporatedPracticeProfile {
  corporatePracticeName: string;
  renderingNpiNumber: string;
  taxIdNumber: string;
  specialtySubspecialty: string;
  taxIdName?: string;
  incorporatePhysicalAddress: string;
  incorporateMailingAddress: string;
  incorporatePhoneNumber: string;
  employerIdPhysicalAddress: string;
  entityType: string;
  entityTypeOther: string;
  corporationCertificateFile: string;
  corporateNpiCertificateFile: string;
  w9File?: string;
}

export interface AddressLocations {
  values: [{
    publicId: string,
    addressPrincipalTypeId: string;
    isActive: string;
    isAcceptingNewPatients: string;
    isComplyWithAda: string;
    adaCompliantComment: string;
    medicalId: string;
    addressInfo: {
      isPhysicalAddressSameAsMail: boolean;
      physical: Address;
      mail: Address;
    }
    serviceHours: ServiceHours[];
  }]
}
  
export interface Specialties {
  // publicId: string,
  id: string,
  evidenceFile: FileForm;
}
  
export interface SpecialtiesForm {
  specialties: Specialties[];
  subspecialties: Specialties[];
}

export interface PCPInterface {
  pmgName: string;
  billingNpiNumber: string;
  taxIdGroup: string;
  medicaidIdLocation: string;
  npiGroupNumber: string;
  addressInfo: {
    isPhysicalAddressSameAsMail: boolean;
    physical: Address;
    mail: Address;
  };
  endorsementLetterDate: string;
  employerId: string;
  contactNumber: string;
  email: string;
  specifyPrimaryCareId: string;
  endorsementLetterFile: FileForm;
  serviceHours: ServiceHours[];
}

export interface F330Interface {
  pmgName: string;
  billingNpiNumber: string;
  taxIdGroup: string;
  medicaidIdLocation: string;
  npiGroupNumber: string;
  addressInfo: {
    isPhysicalAddressSameAsMail: boolean;
    physical: Address;
    mail: Address;
  };
  endorsementLetterDate: string;
  employerId: string;
  contactNumber: string;
  email: string;
  pcpOrSpecialistId: string;
  specifyPrimaryCareId?: string;
  typeOfSpecialistId?: string;
  serviceHours: ServiceHours[];
  endorsementLetterFile: FileForm;
}

export interface HospitalAffiliationsInterface {
  primary: {
    hospitalListId: string;
    hospitalPrivilegesType: string;
    providerStartingMonth: string;
    providerStartingYear: string;
    providerEndingMonth: string;
    providerEndingYear: string;
    hospitalListOther: string;
    hospitalPrivilegesTypeOther: string;
  },
  secondary?: {
    hospitalListId: string;
    hospitalPrivilegesType: string;
    providerStartingMonth: string;
    providerStartingYear: string;
    providerEndingMonth: string;
    providerEndingYear: string;
    hospitalListOther: string;
    hospitalPrivilegesTypeOther: string;
  }
}

export interface EducationAndTraining {
  "medicalSchool" : MedicalSchool[];
  "internship": Internship[];
  "residency": Residency[];
  "fellowship": Fellowship[];
  "boardCertificates": boardCertificates[];
  "licensesCertificates": LicensesAndCertificates;
}

export interface MedicalSchool {
  publicId: string,
  schoolName: string;
  addressInfo: Address;
  graduationMonth: string;
  graduationYear: string;
  specialty: string;
  specialtyCompletionDate: string;
  specialtyDegree: string;
  diplomaFile: FileForm;
}

export interface Internship {
  publicId: string,
  institutionName: string;
  addressInfo: Address;
  attendance: {
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
  }
  programType: string;
  evidenceFile: FileForm;
}

export interface Residency {
  publicId: string,
  institutionName: string;
  addressInfo: Address;
  attendance: {
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
  }
  programType: string;
  completionDate: string;
  evidenceFile: FileForm;
  postGraduateCompletionDate: string;
}

export interface Fellowship {
  publicId: string,
  institutionName: string;
  addressInfo: Address;
  attendance: {
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
  }
  programType: string;
  completionDate: string;
  evidenceFile: FileForm;
}

export interface boardCertificates {
  publicId: string,
  certificateFile: FileForm;
  specialtyBoard: number[];
  issuedDate: string;
  expirationDate: string;
}

export interface LicensesAndCertificates {
  prMedicalLicenseNumber: string;
  prMedicalLicenseExpDate: string;
  prMedicalLicenseFile: FileForm;
  assmcaCertificate: Certificates,
  deaCertificate: Certificates,
  membershipCertificate: Certificates,  
  ptanCertificate: Certificates,
  telemedicineCertificate: Certificates
}

interface Certificates {
  haveCertificate: string;
  certificateNumber: string;
  certificateFile: FileForm;
  expDate: string;
}

export interface PLInterface {
  malpractice: {
    malpracticeCarrierId: string;
    malpracticeCarrierOther?: string;
    insurancePolicyEffectiveDate: string;
    insurancePolicyExpDate: string;
    policyNumber: string;
    coverageAmountPerOcurrence: string;
    coverageAggregateLimit: string;
    certificateCoverageFile: FileForm;
    oigCaseNumber?: string[];
  };
  professionalLiability: {
    isSelected?: boolean;
    professionalLiabilityCarrierId: string;
    professionalLiabilityCarrierOther?: string;
    insurancePolicyEffectiveDate: string;
    insurancePolicyExpDate: string;
    policyNumber: string;
    coverageAmountPerOcurrence: string;
    coverageAggregateLimit: string;
    certificateCoverageFile: FileForm;
  };
  actionExplanationFormFile: FileForm;
  link1File: FileForm;
  link2File: FileForm;
  link3File: FileForm;
  link4File: FileForm;
}

export interface AdditionalInfo {
  "individual-corporate-name-update": string;
  "email-update": string;
  physicalAddress: Address;
  mailAddress: Address;
  isPhysicalAddressSameAsMail: boolean;
  "office-phone-number-update": string;
  "facilities-adapted-to-disabled-patients": string;
  "new-patients-acceptance": string;
  npiChanges: string;
  "practice-transfer": string;
  "practice-closed": string;
  newAffiliations: string;
  "new-practice-associations": string;
  "new-billing-information": string;
  "practice-moved": string;
  "plan-acceptance-list": string;
  serviceHours: ServiceHours
}

export interface CriminalRecordInterface {
  negativePenalRecordIssuedDate: string;
  negativePenalRecordFile: FileForm;
  negativePenalRecordExpDate: string;
  // old value
  negativePenalRecordsDate?: string;
}

export interface ServiceHours {
  "dayOfWeek": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  "hourFrom": string;
  "hourTo": string;
  "isClosed": boolean
}

export interface Address {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  stateId: string;
  zipcode: string
  addressCountryId: string;
  stateOther?: string;
  zipcodeExtension: string;
  internationalCode: string;
}

export interface Attestation {
  isAccept: boolean;
  attestationDate: string;
}

export interface IncorporatedResultItem {
  corporateTaxType: number;
  participateMedicaid: boolean;
  specialtyTypeId: number;
  subspecialty?: number[];
  medicaidIdLocation: string;
  addressInfo: {
      physical: {
          stateId: number;
          name?: string;
          address1: string;
          address2?: string;
          city: string;
          zipcode: string;
          addressCountryId: number;
          zipcodeExtension: string;
          internationalCode: string;
      };
      mail: {
          stateId: number;
          name?: string;
          address1: string;
          address2?: string;
          city: string;
          zipcode: string;
          addressCountryId: number;
          zipcodeExtension: string;
          internationalCode: string;
      };
      isPhysicalAddress?: boolean;
  };
  employerIDAddressInfo: {
      stateId: number;
      name?: string;
      address1: string;
      address2?: string;
      city: string;
      zipcode: string;
      addressCountryId: number;
      zipcodeExtension: string;
      internationalCode: string;
  };
  entityTypeId: number;
  w9File?: {
      name: string;
      documentTypeId: number;
  };
}
