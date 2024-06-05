import layoutImages from "../../../../Application/images/images";
import { STEPS } from "../../../../Application/utils/enums";
import NavStepperStatus from "./NavStepperStatus";
import VerticalLine from "./VerticalLine";

export type NavStepperProps = {
    step?: STEPS,
    label: string,
    status: NavStepperStatus,
    isLastStep?: boolean,
}

const NavStepper = ({label, status, isLastStep = false}:NavStepperProps) => {

    const getStatusBarColor = (): string => {
        if (status === NavStepperStatus.Completed) {
            return "#70E17B";
        } else if (status === NavStepperStatus.Active) {
            return "#73B3E7";
        } else if (status === NavStepperStatus.Error) {
            return "#FEE685";
        }
        
        return "#A9AEB1";
    }

    const getStatusColor = (): string => {
        if (status === NavStepperStatus.Completed) {
            return "#00A91C";
        } else if (status == NavStepperStatus.Active) {
            return "#005ea2";
        } else if (status === NavStepperStatus.Error) {
            return "#E5A000";
        }
        
        return "#565C65";
    }

    const getStatusIcon = (): string => {
        if (status === NavStepperStatus.Completed) {
            return layoutImages.iconFormCheckmark;
        } else if (status == NavStepperStatus.Active) {
            return layoutImages.iconFormActive;
        }  else if (status === NavStepperStatus.Error) {
            return layoutImages.iconFormWarning;
        }
        
        return layoutImages.iconFormInactive;
    }

    return <>
        <div id="stepper-container" className="w-full flex flex-row-reverse -mt-2">
        <div id="stepper-icon-container" className="flex flex-col m-0">
            <img id="stepper-icon-status"
                 style={{marginRight: "16px", marginTop: "6px", width: "16px", height: "16px", color: `${getStatusColor()}`}} 
                 src={getStatusIcon()} />
            {isLastStep ? null : <VerticalLine height={36} color={getStatusBarColor()}/>}
        </div>
        <label id="stepper-label" style={{color: `${getStatusColor()}`, textAlign: "right"}} className="mt-0.5 mr-4 text-bold w-full">{label}</label>
        </div>
    </>

}


export default NavStepper;