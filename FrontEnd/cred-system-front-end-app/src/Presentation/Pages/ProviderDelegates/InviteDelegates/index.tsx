import {useState} from 'react';
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import InviteStepOne from './inviteStep1';
import InviteSuccess from './inviteSuccess';
import StepsBar from '../../../../Application/sharedComponents/stepsBar';
import BackButton from '../../CredForm/Components/BackButton';
import { useNavigate } from 'react-router-dom';

const InviteDelegate = ()=>{

    const [step, setStep] = useState(1); //of 2
    const stepLabels = ['Select your project and add delegate email','Wait for your email confirmation'];
    const handleNext = ()=>{setStep(2)}
    const navigate = useNavigate();
    
    return(
        <div className='flex flex-col gap-14'>
            {step === 1 ? 
            <>
            <section>
            <BackButton
                label="Back to Home"
                onClick={() => navigate("/provider")}
                paddingTop={0}
            />
                <PageTitle
                title="Invite any delegate to help you."
                subtitle="To Collaborate in you Credentialing process."
                />
                <StepsBar stepNumber={step} stepLabels={stepLabels}/>
            </section>
            <InviteStepOne handleNext={handleNext}/>
            </>
            :
            <InviteSuccess />
            }
        </div>
    );

}

export default InviteDelegate;