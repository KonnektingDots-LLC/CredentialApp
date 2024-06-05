import { MdMessage } from "react-icons/md";
import IMAGES from "../../../../Application/images/images";
import InviteForm from "./inviteForm";
import { useEffect } from "react";
import { msalInstance } from "../../../..";
import { getProviderByEmail } from "../../../../Infraestructure/Services/provider.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { useNavigate } from "react-router-dom";

interface InviteS1Props {
    handleNext: ()=>void;
}

const InviteStepOne = ({handleNext}:InviteS1Props) => {
  const api = useAxiosInterceptors();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkInfo = async () => {
    const email = msalInstance.getActiveAccount()?.username as string;
    const providerIdByEmail = await getProviderByEmail(api, email);

    if (!providerIdByEmail) {
        navigate('/user-info');
        return;
    }
  }
  checkInfo();
  },[]);

  return (
    <>
      <div className=" flex">
        <div className=" w-1/2">
          <InviteForm handleNext = {handleNext}/>
        </div>
        <div className=" w-1/2">
          <img className=" block mt-1" src={IMAGES.inviteForm} />
          <div
            id="image-caption-wrap"
            className="flex gap-3 mt-8 ml-8 bg-accent-cool-lighter rounded w-[55%] p-3"
          >
            <div className=" self-center">
              <MdMessage size={35} />
            </div>
            <div className="w-60">
              <h5 className=" font-bold text-sm">
                Colaboration and communication
              </h5>
              <p className=" text-sm text-left">
                Communicate seamlessly with credentialing organizations and
                institutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteStepOne;
