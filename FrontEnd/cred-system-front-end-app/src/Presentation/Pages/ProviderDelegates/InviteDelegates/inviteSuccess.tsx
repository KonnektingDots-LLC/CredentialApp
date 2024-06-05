import { useNavigate } from "react-router-dom";
import IMAGES from "../../../../Application/images/images";
import {Button} from '@trussworks/react-uswds';
const InviteSuccess = ()=>{
  const navigate = useNavigate();
    return (
        <>
          <div className=" flex mt-6">
            <div className=" w-1/2">
                <div className="flex gap-4">
                  <img className=" block self-center w-4 h-4" src={IMAGES.iconCongratulationCheckmark}/>
                  <h2 className=" font-bold text-[1.5em]">Perfect!</h2>
                </div>
                <p className=" text-ink ml-8">Your invite is sent and being reviewed by your delegate.</p>
                <p className=" text-ink ml-8">Please wait for your email confirmation.</p>
                <Button className="ml-8 mt-8" type="button" onClick={() => navigate('/provider')}>Go Home</Button>
              </div>
            <div className=" w-1/2">
              <img className=" block mt-1 w-70" src={IMAGES.inviteSuccess} />
            </div>
          </div>
        </>
      );
}

export default InviteSuccess;