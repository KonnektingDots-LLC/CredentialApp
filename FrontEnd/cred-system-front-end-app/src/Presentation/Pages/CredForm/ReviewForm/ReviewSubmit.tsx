import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { ROLE } from "../../../../Application/utils/enums";
import BackButton from "../Components/BackButton";
import layoutImages from "../../../../Application/images/images";
import { getDownloadDocument } from "../../../../Infraestructure/Services/documents.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { useLayoutEffect, useState } from "react";

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const api = useAxiosInterceptors();
  const role = instance?.getActiveAccount()?.idTokenClaims
  ?.extension_Role as string;
  const [filename, setFileName] = useState('');

  const handleDownload = async () => {
    setFileName(sessionStorage.getItem('formFilename') ?? '');
    await getDownloadDocument(api, "0", filename, 'Individual and Incorporated Provider Credentialing Application');
  }

    useLayoutEffect(() => {
        if (role === ROLE.Delegate) {
            navigate('/delegate');
            return;
        }
        setFileName(sessionStorage.getItem("formFilename") ?? "");
    }, []);

  return (
    <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
      <section>
        <BackButton
          label="Back to Home"
          onClick={() => navigate("/provider")
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
            subtitle={<h5 className=' text-base-ink font-light'>Your information & documents are sent and being reviewed. You can download your completed form for your records. You can always come back and find all your documents in{" "} 
            <a
              className="usa-link cursor-pointer"
              onClick={() => navigate("/documents")}
            >
              My Documents</a>.</h5>
            }
            displayLogo={false}
          />
        </div>
      </section>
      <div className="flex flex-row my-16 ml-3">
        {filename !== '' &&
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={handleDownload}
            >
                Download Your Completed Form
            </button>
        }
       <button
          type="submit"
          className="usa-button"
          onClick={() => navigate("/provider")}
        >
          Finish Session
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;
