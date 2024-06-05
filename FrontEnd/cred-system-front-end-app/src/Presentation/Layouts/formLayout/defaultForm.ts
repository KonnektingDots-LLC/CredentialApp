import NavStepperStatus from "../../Pages/CredForm/Components/NavStepperStatus";
import { Form } from "./credInterfaces";

export const defaultForm: Form = {
        setup: {
            pcpApplies: true,
            insuranceApplies: true,
            f330Applies: true,
            hospitalAffiliationsApplies: true,
            currentStep: "Individual Practice Profile",
           hasStarted: false,
           providerId: 0,
           providerEmail: ""
        },
        steps: {
            individualPracticeProfile: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            incorporatedPracticeProfile: {
                status: NavStepperStatus.Inactive,
                count: 0,
                data: undefined
            },
            addressesLocations: {
                status: NavStepperStatus.Inactive,
                count: 0,
                data: undefined
            },
            specialtiesAndSubspecialties: {
                status: NavStepperStatus.Inactive,
                // countSpec: 0,
                // countSubspec: 0,
                data: undefined
            },
            pcpContract: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            f330: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            hospitalAffiliations: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            educationTraining: {
                status: NavStepperStatus.Inactive,
                countMedSchool: 0,
                countInternship: 0,
                countFellowship: 0,
                countResidency: 0,
                countBoard: 0,
                data: undefined
            },
            criminalRecord: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            professionalLiability: {
                status: NavStepperStatus.Inactive,
                data: undefined
            },
            submit: {
                status: NavStepperStatus.Inactive,
                data: undefined
            }
        }
    }
    