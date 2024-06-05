import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import BackButton from "../Components/BackButton";
import layoutImages from "../../../../Application/images/images";
import { useEffect } from "react";
import { ROLE } from "../../../../Application/utils/enums";
import { useMsal } from "@azure/msal-react";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const DelegateNofity = () => {
  const navigate = useNavigate();
  const api = useAxiosInterceptors();
  const {data: formData } = useGetForm(api);
  // const formData = useQueryClient().getQueryData<Form>(['formData']);

  const { instance } = useMsal();
  const role = instance?.getActiveAccount()?.idTokenClaims
  ?.extension_Role as string;

  useEffect(() => {
    if (role === ROLE.Provider) {
      navigate('/provider');
      return;
    }
  }, [formData]);

  return (
    <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
      <section>
        <BackButton
          label="Back to Home"
          onClick={() => navigate("/delegate")
          }
        />
        <div className="flex w-[560px] mt-20">
          <img
            style={{
              marginRight: "16px",
              marginTop: "30px",
              width: "24px",
              height: "24px",
            }}
            src={layoutImages.iconCongratulationCheckmark}
          />
          <PageTitle
            title="Great!"
            subtitle={"Notification sent. The provider will receive the notification to review the provided information."
            }
            displayLogo={false}
          />
        </div>
      </section>
      <div>
       <button
          type="submit"
          className="usa-button"
          onClick={() => navigate("/delegate")}
        >
          Finish Session
        </button>
      </div>
    </div>
  );
};

export default DelegateNofity;
