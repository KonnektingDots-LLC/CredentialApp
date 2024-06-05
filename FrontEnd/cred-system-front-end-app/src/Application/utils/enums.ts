export enum ROLE {
  Provider = "PROV",
  Delegate = "DELG",
  Insurance = "INSR",
  Admin = "ADMI",
  AdminInsurer = "AINS",
}

export enum STEPS {
  PracticeProfile,
  Addresses,
  Specialties,
  IncorporatedPracticeProfile,
  PCP,
  F330,
  HospitalAffiliations,
  Education,
  CriminalRecord,
  ProfessionalLiability,
  Submit,
}

export enum EMAIL_EVENTS {
  DELEGATE_INVITED_BY_PROVIDER = "DIBP",
  REVIEW_PROVIDER = "RP",
  ADMIN_INSURER_INVITED = "AII",
  INSURER_EMPLOYEE_INVITATION = "II",
  ADMIN_REGISTRATION = "AR",
  INSURER_REVIEW_DOCS = "IRD"
}

export enum PAGES_NAME {
  Individual = "Individual Practice Profile",
  Addresses = "Addresses & Locations",
  Specialties = "Specialties & Subspecialties",
  Incorporated = "Incorporated Practice Profile",
  PCP = "PCP Contract",
  F330 = "330",
  Hospitals = "Hospital Affiliations",
  Education = "Education and Training",
  CriminalRecord = "Criminal Record",
  Insurance = "Professional Liability",
  Submit = "Submit",
}

export enum STATUS {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  RETURNED = "Returned to Provider",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PENDING = "Pending"
}

export enum STATUS_CODE {
  RETURNED = "RTP",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED"
}