import { useLocation } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { Link } from "@trussworks/react-uswds";
import NavStepper from "./NavStepper";
import NavStepperStatus from "./NavStepperStatus";
import { useMsal } from "@azure/msal-react";
import { roleRouteMap } from "../../../../Application/utils/constants";
import { ROLE } from "../../../../Application/utils/enums";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { List as SkeletonList } from "react-content-loader";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";
import { logout } from "../../../../Application/utils/auth";

// There will be props to receive the list of options/steps in the 
// Form, and it should be List<StepNavObject: {label, status, isLast}> 

const FormNavigationOptions = () => {
    const { instance } = useMsal();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isFormLoading} = useGetForm(api);

    const location = useLocation();
    const currentStep = location.pathname.split('/').pop();
    const username = instance.getActiveAccount()?.username ?? ""
    const role = instance.getActiveAccount()?.idTokenClaims?.extension_Role as string;

    if (isFormLoading && !formData) {
        return <SkeletonList />
    }

    return <>
        <div className="w-full pr-20 py-32">
            <NavStepper label={"Individual Practice Profile"} 
                status={currentStep === "1" ? NavStepperStatus.Active : formData?.steps?.individualPracticeProfile.status ?? NavStepperStatus.Inactive}
            />
            <NavStepper label={"Addresses & Locations"} 
                status={currentStep === "2" ? NavStepperStatus.Active : formData?.steps?.addressesLocations.status ?? NavStepperStatus.Inactive}
            />
            <NavStepper label={"Specialties & Subspecialties"} 
                status={currentStep === "3" ? NavStepperStatus.Active : formData?.steps?.specialtiesAndSubspecialties.status ?? NavStepperStatus.Inactive}
            />
            <NavStepper label={"Incorporated Practice Profile"} 
                status={currentStep === "4" ? NavStepperStatus.Active : formData?.steps?.incorporatedPracticeProfile.status ?? NavStepperStatus.Inactive}
            />
            {formData?.setup.pcpApplies && <NavStepper label={"PCP Contract"} 
                status={currentStep === "5" ? NavStepperStatus.Active : formData?.steps?.pcpContract.status}
            />}
            {formData?.setup.f330Applies &&<NavStepper label={"FQHC (330)"} 
                status={currentStep === "6" ? NavStepperStatus.Active : formData?.steps?.f330.status}
            />}
            {formData?.setup.hospitalAffiliationsApplies &&<NavStepper label={"Hospital Affiliations"} 
                status={currentStep === "7" ? NavStepperStatus.Active : formData?.steps?.hospitalAffiliations.status}
            />}
            <NavStepper label={"Education and Training"} 
                status={currentStep === "8" ? NavStepperStatus.Active : formData?.steps?.educationTraining.status ?? NavStepperStatus.Inactive}
            />
            <NavStepper label={"Criminal Record"} 
                status={currentStep === "9" ? NavStepperStatus.Active : formData?.steps?.criminalRecord.status ?? NavStepperStatus.Inactive}
            />
            {formData?.setup.insuranceApplies &&<NavStepper label={"Professional Liability"} 
                status={currentStep === "10" ? NavStepperStatus.Active : formData.steps.professionalLiability.status}
            />}
            {/* <NavStepper label={"Additional Information"} 
                status={currentStep === "11" ? NavStepperStatus.Active : formData.steps.additionalInformation.status ?? NavStepperStatus.Inactive}
            /> */}
            {role === ROLE.Provider && <NavStepper label={"Submit"} 
                status={currentStep === "review" ? NavStepperStatus.Active : currentStep === "submit" ? NavStepperStatus.Completed : formData?.steps?.submit.status ?? NavStepperStatus.Inactive} isLastStep
            />}
            {role === ROLE.Delegate && <NavStepper label={"Notify"} 
                status={currentStep === "review" ? NavStepperStatus.Active : currentStep === "delegate-notify" ? NavStepperStatus.Completed : formData?.steps.submit.status ?? NavStepperStatus.Inactive} isLastStep
            />}
            <div style={{marginTop: "32%"}} className="flex flex-row justify-end w-full">
            
                <div className="flex flex-row mr-8">
                    <FaUserLarge color="#71767A" className="mt-1"/>
                    <Link variant="unstyled" href={roleRouteMap[role as keyof typeof roleRouteMap]}>
                        <p style={{lineHeight: "25.92px"}} className="text-normal text-base ml-2">{username}</p>
                    </Link>
                </div>
                <div className="flex flex-row">
                    <RxExit color="#71767A" className="mt-1"/>
                    <Link variant="unstyled" href="#">
                        <p style={{lineHeight: "25.92px"}} className="text-normal text-primary ml-2" onClick={() => logout()}>Log out</p>
                    </Link>
                </div>
            </div>
        </div> 
</> 
}

export default FormNavigationOptions;
