import { useState } from "react";
import { Checkbox } from "@trussworks/react-uswds";
import NextsaveButtons from "../Components/nextSaveButtons";
import { useMsal } from "@azure/msal-react";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import NavStepperStatus from "../Components/NavStepperStatus";
import SignupStepsBar from "../../../../Application/sharedComponents/stepsBar";
import { postForm, submitForm } from "../../../../Infraestructure/Services/form.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { jsonFormatter } from "../../../../Application/utils/jsonFormatter";
import { GoAlert } from "react-icons/go";
import { Attestation } from "../../../../Application/utils/Attestation";
import { useNavigate } from "react-router-dom";
import { AddressLocations, IncorporatedPracticeProfile } from "../../../Layouts/formLayout/credInterfaces";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

interface ReviewProviderProps {
  goBack: () => void;
  goHome: () => void;
}

const ReviewProvider = ({ goBack, goHome }: ReviewProviderProps) => {
  const navigate = useNavigate();
  const [confirmed, setConfirm] = useState<boolean>(false);
  const { instance } = useMsal();
  const api = useAxiosInterceptors();
  const {data: formData} = useGetForm(api);
  const name = instance.getActiveAccount()?.idTokenClaims?.given_name +
    " " + instance.getActiveAccount()?.idTokenClaims?.extension_LastName;
  const date = new Date();
  const formatDate = date.toDateString().split(":").slice(0, 2).join(":");
  const stepLabels = ["Verify Information", "Verify Documents", "Completed"];
  const [alert, setAlert] = useState(false);
  const [formAlert, setFormAlert] = useState(false);

  const openTermsAndConditions = () => {
    const content = Attestation(name, formatDate);
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const addPublicId = (category: 'medicalSchool' | 'internship' | 'residency' | 'fellowship' | 'boardCertificates', 
  countKey: 'countMedSchool' | 'countInternship' | 'countResidency' | 'countFellowship' | 'countBoard') => {
      if (!formData) {
          return;
      }
    const values = formData?.steps?.educationTraining?.data?.[category];
    let count = formData?.steps?.educationTraining?.[countKey] ?? 0;
    
    if (values) {
      for (let i = 0; i < values.length; i++) {
        if (!values[i].publicId) {
          count += 1;
          const prefix = category.charAt(0);
          values[i].publicId = `${prefix}-${count}`;
        }
      }
    }
    if (!formData?.steps?.educationTraining?.[countKey]) {
      formData.steps.educationTraining[countKey] = count;
    }
  }
  
  const submitHandler = async () => {
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
      if (formData?.setup?.hasStarted && formData?.setup?.providerId !== 0) {
        await postForm(api, parseInt(JSON.parse(sessionStorage.getItem('provider') ?? "{}").providerId), formData, []);
        setAlert(true);
        return;
      } else {
        setFormAlert(true);
      }
    }

    if (!formData.steps.addressesLocations.count || !formData?.steps?.incorporatedPracticeProfile?.count || !formData.steps.educationTraining.countMedSchool) {
      if (!formData?.steps?.addressesLocations?.count) {
        const { values } = formData.steps.addressesLocations.data as AddressLocations;
        if (values) {
            const officeCount = values.length;     
            values.forEach((office, index) => {
                // Add publicId to each object if it doesn't exist
                  office.publicId = (index + 1).toString();
              }); 
            formData.steps.addressesLocations.count = officeCount;
        } else {
            formData.steps.addressesLocations.count = 0;
        }
      }
      if (formData.steps.incorporatedPracticeProfile?.data && !formData.steps?.incorporatedPracticeProfile?.count) {
        const { values } = formData?.steps?.incorporatedPracticeProfile?.data as IncorporatedPracticeProfile;
        if (values) {
            const count = values.length;     
            values.forEach((incorp, index) => {
                // Add publicId to each object if it doesn't exist
                incorp.publicId = (index + 1).toString();
              }); 
            formData.steps.incorporatedPracticeProfile.count = count;
        } else {
            formData.steps.incorporatedPracticeProfile.count = 0;
        }
      }
      if (!formData?.steps?.educationTraining?.countMedSchool) {
        addPublicId('medicalSchool', 'countMedSchool');
        addPublicId('internship', 'countInternship');
        addPublicId('residency', 'countResidency');
        addPublicId('fellowship', 'countFellowship');
        addPublicId('boardCertificates', 'countBoard');
      }
    }

    try {
      if (!formData) return;

      formData.steps.submit.status = NavStepperStatus.Completed;
      formData.setup.currentStep = "Done";

      const formatter = jsonFormatter(formData);
      
      if (formData?.setup?.hasStarted && formData?.setup?.providerId !== 0) {
        await submitForm(api, formatter, formData).then(res => {
          if (res?.status === 200) {
            sessionStorage.setItem('formFilename', res?.data.filename);
            navigate('/cred/submit');
          }
        });  
      } else {
        setFormAlert(true);
      }


    } catch (error) {
      if (!formData) return;
      formData.steps.submit.status = NavStepperStatus.Error;
      formData.setup.currentStep = "Submit";
    }
  };

  return (
    <>
      <section>
        <BackButton label="Back" onClick={goBack} />
        <div className="max-w-md">
          <PageTitle
            title="Ready to Send?"
            subtitle="You are ready to send your credentialization information & documents. Please review that all your information is correct."
            displayLogo={false}
          />
        </div>
      </section>
      <div style={{ height: "12px" }}></div>

      <SignupStepsBar stepNumber={2} stepLabels={stepLabels} />
      <div className="flex w-[571px] mt-[20%]">
        <Checkbox
          id={`cb-attested`}
          label=""
          name="cb-attested"
          checked={confirmed}
          onChange={(data) => {
            setConfirm(data.target.checked);
          }}
        />
        <label className="my-1">
          {"By clicking here I state that I have read and understood all "}
          <a
            className="text-primary-blue underline cursor-pointer"
            onClick={openTermsAndConditions}
          >
            {"Terms and Conditions"}
          </a>
          {
            ".  I review all information and documents. This represent a digital signature."
          }
        </label>
      </div>
      {alert &&
        <div className="flex items-center mt-5 gap-2">
          <GoAlert size={30} color="#B50909"/>
          <p className="font-bold text-red-error" role="alert">
            Please, go back to Education and Training to fill out <br/>
            the Country field where it's missing.
          </p>
        </div>
      }
      {formAlert &&
        <div className="flex items-center mt-5 gap-2">
        <GoAlert size={30} color="#B50909"/>
        <p className="font-bold text-red-error" role="alert">
          Error saving the form, please Go Home and enter again.
        </p>
      </div>
      }
      <div style={{ height: "30px" }}></div>
      <NextsaveButtons
        outlinedButtonLabel="Go Home"
        nextButtonLabel={"Submit"}
        hasConditionToSubmit={true}
        canSubmit={confirmed}
        handleNext={submitHandler}
        handleLeftButton={goHome}
      />
      <div style={{ height: "30px" }}></div>
    </>
  );
};

export default ReviewProvider;
