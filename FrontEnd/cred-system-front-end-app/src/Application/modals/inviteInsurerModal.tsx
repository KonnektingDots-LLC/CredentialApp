import {useState} from 'react';
import layoutImages from "../images/images";
import {Button} from '@trussworks/react-uswds';
import Modal from '../sharedComponents/modal';
import InviteForm from '../../Presentation/Pages/InviteInsurers/inviteForm';
import { logout } from '../utils/auth';

interface Props {
    closeModal: () => void
}

const InviteInsurerModal = ({closeModal}:Props)=>{

    const [step, setStep] = useState(1); //of 2
    const handleNext = (num: number)=>{setStep(num)}

    return(
        <Modal closeModal={closeModal}>
            {step === 1 ? 
            
                <InviteForm handleNext = {() =>handleNext(2)}/>
                :
                <div className="flex flex-col gap-3 p-6 w-96">
                    <div className="flex gap-4">
                        <img className="block self-center w-6 h-6" src={layoutImages.iconCongratulationCheckmark}/>
                        <h2 className="font-bold text-[1.5em]">Perfect!</h2>
                    </div>
                    <p className="text-ink ml-8">Your invitation is sent.</p>
                    <div className="flex justify-center items-center">
                        <img className="mt-1 w-52" src={layoutImages.inviteSuccess} />
                    </div>
                    <p className="ml-8 font-bold">What you want to do now?</p>
                    <div className="flex gap-6 items-center ml-8">
                        <Button type="button" onClick={() => logout()}>Save & Logout</Button>
                        <a onClick={() => handleNext(1)} className='text-blue-700 cursor-pointer'>Go back</a>
                    </div>
                </div>
            }           
        </Modal>
    );
}

export default InviteInsurerModal;
