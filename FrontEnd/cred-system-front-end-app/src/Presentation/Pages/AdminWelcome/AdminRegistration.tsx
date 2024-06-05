import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { getAdminValidation, registerAdmin } from "../../../Infraestructure/Services/admin.service";
import { postWelcomeEmail } from "../../../Infraestructure/Services/general.service";

const AdminrRegistration = () => {
    const api = useAxiosInterceptors();
    const { instance } = useMsal();
    const navigate = useNavigate();
    const email = instance.getActiveAccount()?.username as string ?? "";

    const handleAdmin = async () => {
        try {
            const adminValidation = await getAdminValidation(api, email);
            if (adminValidation?.data.exists) {
                // insurer found
                const adminInfo = {
                    name: instance.getActiveAccount()?.idTokenClaims?.given_name as string ?? "",
                    middleName: instance.getActiveAccount()?.idTokenClaims?.extension_MiddleName as string ?? "",
                    surname: instance.getActiveAccount()?.idTokenClaims?.family_name as string ?? "",
                    lastName: instance.getActiveAccount()?.idTokenClaims?.extension_LastName as string ?? "",
                    email: instance.getActiveAccount()?.username as string
                }
                await registerAdmin(api, adminInfo);

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
                navigate('/admin');
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleAdmin();
    }, []);

    return (
        <div style={{ height: "600px"}}>Loading registration... please wait</div>
    );
};

export default AdminrRegistration;