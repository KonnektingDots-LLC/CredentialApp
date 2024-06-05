import { useNavigate } from "react-router-dom";
import IMAGES from "../../../Application/images/images";
import {Button} from '@trussworks/react-uswds';
import { ROLE } from "../../../Application/utils/enums";

interface Props {
  role: string
}

const InformationComplete = ({ role }: Props) => {
  const navigate = useNavigate();
  const goHome = () => {
    role === ROLE.Provider ? navigate('/provider') : navigate('/delegate')
  }

  return (
    <>
      <div className=" flex my-[15%]">
        <div className=" w-1/2">
            <div className="flex gap-4">
              <img className=" block self-center w-5 h-5" src={IMAGES.iconCongratulationCheckmark}/>
              <h1 className="font-bold">Great!</h1>
            </div>
            <p className=" text-ink ml-8 text-xl -mt-2 font-light">Your information has been sent successfully.</p>
            <div className="flex gap-3">
              <Button className="ml-8 mt-10 usa-button usa-button--outline" type="button" onClick={goHome}>Go Home</Button>
              <Button className="mt-10" type="button" onClick={() => navigate('/form-setup')}>Fill My Credentialing Application</Button>
            </div>
          </div>
          <div>
            <img src={IMAGES.userInfoSent}/>
          </div>
      </div>
    </>
  );
};

export default InformationComplete;
