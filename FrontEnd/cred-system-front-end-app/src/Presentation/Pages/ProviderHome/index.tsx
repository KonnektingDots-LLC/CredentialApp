import { useNavigate } from "react-router-dom";
import { getProviderByEmail } from "../../../Infraestructure/Services/provider.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { useEffect, useState } from "react";
import { msalInstance } from "../../..";
import ProviderFormStatus from "./ProviderFormStatus";
import ProviderWelcome from "./ProviderWelcome";
import { getCredFormByCredFormId, getCredFormByEmail } from "../../../Infraestructure/Services/credform.service";

const ProviderHome = () => {
  const navigate = useNavigate();
  const api = useAxiosInterceptors();
  const [formCompleted, setFormCompleted] = useState(false);
  const [formNotCompleted, setFormNotCompleted] = useState(false);

  const providerId = async () => {
    const email = msalInstance.getActiveAccount()?.username as string;
    const providerIdByEmail = await getProviderByEmail(api, email);

    if (!providerIdByEmail) {
        navigate('/user-info');
        return;
    }

    const credFormByEmail = await getCredFormByEmail(api, email);
    if (credFormByEmail?.id) {
      const providerIdByEmail = await getProviderByEmail(api, email);
      if (providerIdByEmail.id) {
        const provider = { providerId: providerIdByEmail.id}
        sessionStorage.setItem('provider', JSON.stringify(provider));    
      }
    }

    const credFormStatus = await getCredFormByCredFormId(api, credFormByEmail?.credFormId);

    setFormCompleted(credFormStatus.providerStatus !== "DRAFT");
    setFormNotCompleted(credFormStatus.providerStatus === "DRAFT");
    sessionStorage.setItem('provider', JSON.stringify({providerId: providerIdByEmail.id}));  
  }

  useEffect(() => {
    providerId();
  }, [])

  return (
    <>
      {formCompleted && <ProviderFormStatus/>}
      {formNotCompleted && <ProviderWelcome hasFormCompleted={formNotCompleted}/>}
    </>
  );
};

export default ProviderHome;


