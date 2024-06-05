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

    const credFormByEmail = await getCredFormByEmail(api, providerIdByEmail.providerId, email);
    if (credFormByEmail?.id) {
      const providerIdByEmail = await getProviderByEmail(api, email);
      if (providerIdByEmail.providerId) {
        const provider = { providerId: providerIdByEmail.providerId}
        sessionStorage.setItem('provider', JSON.stringify(provider));    
      }
    }

    const credFormStatus = await getCredFormByCredFormId(api, providerIdByEmail.providerId, credFormByEmail?.credFormId);

    setFormCompleted(credFormStatus.providerStatus !== "DRAFT");
    setFormNotCompleted(credFormStatus.providerStatus === "DRAFT");
    sessionStorage.setItem('provider', JSON.stringify({providerId: providerIdByEmail.providerId}));
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


