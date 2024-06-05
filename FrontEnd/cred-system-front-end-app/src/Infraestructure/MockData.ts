import { STEPS } from "../Application/utils/enums";
import { NavStepperProps } from "../Presentation/Pages/CredForm/Components/NavStepper";
import NavStepperStatus from "../Presentation/Pages/CredForm/Components/NavStepperStatus";

export const entityTypeList = [
  { id: 1, name: "Sole Proprietorship" },
  { id: 2, name: "Partnership" },
  { id: 3, name: "Corporation" },
  { id: 4, name: "Limited Liability Partnership (Llp)" },
  { id: 5, name: "Limited Liability Company (Llc)" },
  { id: 6, name: "Professional Corporation" },
  { id: 7, name: "Non-Profit" },
  { id: 8, name: "Other" }
];

export const formSteps: NavStepperProps[] = [
  // { label: "Welcome", status: NavStepperStatus.Inactive },
  { step: STEPS.PracticeProfile, label: "Individual Practice Profile", status: NavStepperStatus.Inactive},
  { step: STEPS.IncorporatedPracticeProfile, label: "Incorporated Practice Profile", status: NavStepperStatus.Inactive},
  { step: STEPS.Addresses, label: "Addresses & Locations", status: NavStepperStatus.Inactive},
  { step: STEPS.Specialties, label: "Specialties & Subspecialties", status: NavStepperStatus.Inactive},
  { step: STEPS.PCP, label: "PCP Contract", status: NavStepperStatus.Inactive},
  { step: STEPS.F330, label: "Federally Qualified Health Centers (330)", status: NavStepperStatus.Inactive},
  { step: STEPS.HospitalAffiliations, label: "Hospital Affiliations", status: NavStepperStatus.Inactive},
  { step: STEPS.Education, label: "Education and Training", status: NavStepperStatus.Inactive},
  { step: STEPS.CriminalRecord, label: "Criminal Record", status: NavStepperStatus.Inactive},
  { step: STEPS.ProfessionalLiability, label: "Professional Liability", status: NavStepperStatus.Inactive},
  // { step: STEPS.AdditionalInformation, label: "Additional Information", status: NavStepperStatus.Inactive},
  { step: STEPS.Submit, label: "Submit", status: NavStepperStatus.Inactive, isLastStep: true },
]