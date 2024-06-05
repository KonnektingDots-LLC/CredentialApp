import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import ReviewProvider from "./ReviewProvider";
import ReviewDelegate from "./ReviewDelegate";
import { msalInstance } from "../../../..";
import { CheckNavigateToBack } from "../../../../Application/utils/helperMethods";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const ReviewForm = () => {
  const navigate = useNavigate();
  const api = useAxiosInterceptors();
  const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

  const { instance } = useMsal();
  const role = instance?.getActiveAccount()?.idTokenClaims
    ?.extension_Role as string;

  const goBack = () => {
    if (!formData) return;
    CheckNavigateToBack(PAGES_NAME.Submit, formData, navigate);
  };

  const goHome = () => {
    const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
    role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
    });
  }

  if (isLoadingForm && !formData) {
      return <LoadingComponent />
  }
  return (
    <>
      <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
        <section>
          { role === ROLE.Delegate && (
            <ReviewDelegate goBack={goBack} goHome={goHome}/>
          )}
          { role === ROLE.Provider && (
            <ReviewProvider goBack={goBack} goHome={goHome}/>
          )}
        </section>
      </div>
    </>
  );
};

export default ReviewForm;
