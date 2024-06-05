import { useEffect } from "react";
import { registerInsurerEmployee, getInsurerEmployeeValidation } from "../../../Infraestructure/Services/insurerEmployee.service";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { postWelcomeEmail } from "../../../Infraestructure/Services/general.service";

const InsurerRegistration = () => {
    const api = useAxiosInterceptors();
    const { instance } = useMsal();
    const navigate = useNavigate();
    const email = instance.getActiveAccount()?.username as string ?? "";

    const handleInsurer = async () => {
        try {
            const insurerValidation = await getInsurerEmployeeValidation(api, email);
            if (insurerValidation?.data.exists) {
                const email = instance.getActiveAccount()?.username as string
                // insurer found
                const insurerInfo = {
                    name: instance.getActiveAccount()?.idTokenClaims?.given_name as string ?? "",
                    middleName: instance.getActiveAccount()?.idTokenClaims?.extension_MiddleName as string ?? "",
                    surName: instance.getActiveAccount()?.idTokenClaims?.family_name as string ?? "",
                    lastName: instance.getActiveAccount()?.idTokenClaims?.extension_LastName as string ?? ""
                }
                await registerInsurerEmployee(api, insurerInfo, email);

                if (instance.getActiveAccount()?.idTokenClaims?.newUser) {
                    const email = instance.getActiveAccount()?.username as string;
                    try {
                      await postWelcomeEmail(api, email);
                    } catch (error) {
                      console.error("Error sending welcome email:", error);
                    }
                    setTimeout(() => {
                        console.log("waiting 2 seconds");
                    }, 2000);
                }
                navigate('/insurance');
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleInsurer();
    }, []);

    return (
        <div style={{ height: "600px"}}>Loading registration... please wait</div>
    );
};

export default InsurerRegistration;