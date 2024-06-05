import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ReactNode, useEffect } from 'react'
import { useLocation, useNavigate} from "react-router-dom"
import { toast } from 'react-toastify';

interface ProtectedRoutesProps {
    children: ReactNode;
    rolesAllowed?: string[];
}

const ProtectedRoute = ({children, rolesAllowed}: ProtectedRoutesProps) => {
    const navigate = useNavigate();
    const { instance, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated(); 

    const location = useLocation();
    // Closes available toasts present on current page
    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, [location]);

    if (inProgress === InteractionStatus.None && isAuthenticated) {
        const role = instance?.getActiveAccount()?.idTokenClaims?.extension_Role as string ?? "PROV";
        
        if(rolesAllowed === undefined || !rolesAllowed?.includes(role)){
            navigate('/');
            return null;
        }
    }

    if (inProgress === InteractionStatus.None && !isAuthenticated) {
        navigate('/');
        return null;
    }
 return children;
  
};

export default ProtectedRoute;
