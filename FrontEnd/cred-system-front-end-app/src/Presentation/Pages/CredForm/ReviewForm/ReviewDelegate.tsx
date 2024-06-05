import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { notifyProvider } from "../../../../Infraestructure/Services/delegate.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { postForm } from "../../../../Infraestructure/Services/form.service";
import { GoAlert } from "react-icons/go"
import { useState } from "react";
import NavStepperStatus from "../Components/NavStepperStatus";
import { useNavigate } from "react-router-dom";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

interface ReviewDelegateProps {
  goBack: () => void;
  goHome: () => void;
}

const ReviewDelegate = ({ goBack, goHome }: ReviewDelegateProps) => {
  const api = useAxiosInterceptors();
  const {data: formData} = useGetForm(api);
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  const handleNotify = async () => {
      if (!formData) {
          return;
      }
    const hasMedicalAddressCountryId = formData.steps.educationTraining.data?.medicalSchool?.every(school => school.addressInfo?.addressCountryId);
    const hasInternshipAddressCountryId = formData.steps.educationTraining.data?.internship?.every(internship => {
      if (internship.institutionName && internship.programType) {
          return internship.addressInfo?.addressCountryId;
      }
      return true;
    });
    const hasResidencyAddressCountryId = formData.steps.educationTraining.data?.residency?.every(residency => {
      if (residency.institutionName && residency.programType) {
          return residency.addressInfo?.addressCountryId;
      }
      return true;
    });
    const hasFellowshipAddressCountryId = formData.steps.educationTraining.data?.fellowship?.every(fellowship => {
      if (fellowship.institutionName && fellowship.programType) {
          return fellowship.addressInfo?.addressCountryId;
      }
      return true;
    });

    if (!hasMedicalAddressCountryId || !hasInternshipAddressCountryId || !hasResidencyAddressCountryId || !hasFellowshipAddressCountryId) {
      formData.steps.educationTraining.status = NavStepperStatus.Error;
      await postForm(api, parseInt(JSON.parse(sessionStorage.getItem('provider') ?? "{}").providerId), formData, []);
      setAlert(true);
      return;
    }

    const delegateId = sessionStorage.getItem("delegateId") ?? "0";
    const providerId = JSON.parse(sessionStorage.getItem('provider') ?? "{}").providerId;
    await notifyProvider(api, formData.setup.providerEmail, delegateId, providerId).then(async () => {
      formData.setup.currentStep = "Notify"
      await postForm(api, parseInt(providerId), formData, []);
      navigate('/cred/delegate-notify');
    });
  }

  return (
    <>
      <section>
        <BackButton label="Back" onClick={goBack} />
        <div className="max-w-md">
          <PageTitle
            title="Ready to send notification?"
            subtitle="You are now prepared to inform the provider that the credentialization 
                        information and documents are ready for review. Please ensure that all the information is correct."
            displayLogo={false}
          />
        </div>
      </section>
      {alert &&
        <div className="flex items-center mt-5 gap-2">
          <GoAlert size={30} color="#B50909"/>
          <p className="font-bold text-red-error" role="alert">
            Please, go back to Education and Training to fill out <br/>
            the Country field where it's missing.
          </p>
        </div>
      }
      <div style={{ height: "30px" }}></div>
      <div className="flex flex-row my-16 ml-3">
        <button
          type="button"
          className="usa-button usa-button--outline"
          onClick={goHome}
        >
          Go Home
        </button>
        <button
          type="submit"
          className="usa-button"
          style={{ backgroundColor: "#00A91C" }}
          onClick={handleNotify}
        >
          Notify
        </button>
      </div>
    </>
  );
};

export default ReviewDelegate;
