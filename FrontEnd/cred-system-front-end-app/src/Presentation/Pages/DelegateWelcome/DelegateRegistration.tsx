import { useEffect } from "react";
import { registerDelegate } from "../../../Infraestructure/Services/delegate.service";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { DelegateInfo } from "../../../Application/interfaces";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

const DelegateRegistration = () => {
    const api = useAxiosInterceptors();
    const { instance } = useMsal();
    const navigate = useNavigate();
    const email = instance.getActiveAccount()?.username ?? "";
    
    const name = instance.getActiveAccount()?.idTokenClaims?.given_name as string ?? "";
    const middleName = instance.getActiveAccount()?.idTokenClaims?.extension_MiddleName as string ?? "";
    const lastName = instance.getActiveAccount()?.idTokenClaims?.extension_LastName as string ?? "";
    const surname = instance.getActiveAccount()?.idTokenClaims?.family_name as string ?? "";

    const namesArray = [name, middleName, lastName, surname];
    const validNames = namesArray.filter((name) => name !== undefined && name !== "");
    const fullname = validNames.join(" ");    
    
    const handleDelegate = async () => {
        try {
            if (instance.getActiveAccount()?.idTokenClaims?.newUser) {
                // delegate no existe asi que envio esta info by default
                const delegateInfo: DelegateInfo = {
                    email: email,       //valores sacados de b2c                    
                    fullName: fullname, //valores sacados de b2c
                    delegateTypeId: 2,
                    delegateCompanyId: 2
                }
                // create delegate
                await registerDelegate(api, delegateInfo);

                setTimeout(() => {
                    console.log("waiting 2 seconds");
                }, 2000);

                navigate('/delegate');
                return;
            } else {
                // delegate exist
                navigate('/delegate');
                return;
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleDelegate();
    }, []);

    return (
        <div>
            Loading... Please wait.
        </div>
    );
};

export default DelegateRegistration;