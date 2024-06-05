import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getInsurerProviderList } from "../../../Infraestructure/Services/insurerEmployee.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

const InsurerReview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const providerId = parseInt(searchParams.get("prov") ?? "") ?? 0;
    const api = useAxiosInterceptors();

    const handleInsurer = async () => {
        let currentPage = 1;
        const limitPerPage = 50; 
        let keepSearching = true;

        try {
            do { 
                const insurerProviderList = await getInsurerProviderList(api, currentPage, limitPerPage);
    
                // Check if the providerId is in the insurer's list
                const foundProvider = insurerProviderList.content.find((provider: any) => provider.providerId === providerId);
                if (foundProvider) {
                    sessionStorage.setItem('provider', JSON.stringify(foundProvider));
                    navigate('/documents');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                    return; // Exit because provider found
                }
                // didn't find the provider-> exit the loop
                if (currentPage >= insurerProviderList.totalNumberOfPages) {
                    keepSearching = false;
                } else {
                    currentPage++; // next page
                }
            } while (keepSearching);

            navigate('/');
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleInsurer();
    }, []);

    return (
        <div>
            Loading... Please wait.
        </div>
    );
};

export default InsurerReview;