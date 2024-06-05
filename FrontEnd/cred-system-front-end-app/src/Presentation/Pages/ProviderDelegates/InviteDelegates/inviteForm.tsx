import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Checkbox } from "@trussworks/react-uswds";
import { useState } from "react";
import BackButton from "../../CredForm/Components/BackButton";
import { useMsal } from "@azure/msal-react";
import { inviteDelegate } from "../../../../Infraestructure/Services/delegate.service";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { getProviderByEmail } from "../../../../Infraestructure/Services/provider.service";
import { generatePdf } from "../../../../Application/utils/helperMethods";

interface InviteFormProps {
  handleNext: () => void;
}

const InviteForm = ({ handleNext }: InviteFormProps) => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    setValue,
  } = useForm();

  const { instance } = useMsal();
  const api = useAxiosInterceptors();
  const email = instance.getActiveAccount()?.username as string;
  const [isAttestationChecked, setIsAttestationChecked] = useState(false);
  const [isTermsOpen, setTermsPage] = useState(false);
  const openTerms = () => setTermsPage(true);

  const name = instance.getActiveAccount()?.idTokenClaims?.given_name as string ?? "";
  const middleName = instance.getActiveAccount()?.idTokenClaims?.extension_MiddleName as string ?? "";
  const lastName = instance.getActiveAccount()?.idTokenClaims?.extension_LastName as string ?? "";
  const surname = instance.getActiveAccount()?.idTokenClaims?.family_name as string ?? "";

  const namesArray = [name, middleName, lastName, surname];
  const validNames = namesArray.filter((name) => name !== undefined && name !== "");
  const fullname = validNames.join(" ");

  const onSubmit = async () => {
    try {
      await getProviderByEmail(api, email).then(async res => {
        if (res?.providerId) {
          await inviteDelegate(api, res.providerId, getValues("delegateEmail")).then(res => {
            if(res?.status === 200) {
              handleNext();
            }
          });  
        }
      });

    } catch(error) {
      console.log(error);
    }
  };

  const handleViewPDF = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
    
    const date = `${formattedDate} ${formattedTime}`;

    const content = `


    Date: ${date}

    Subject: Designation of Delegate Credentialing Professional 
        for Credentialing Process

        I, Dr. ${fullname} as a Provider,
        confirm that I have selected a Delegate Credentialing Professional 
        to act on my behalf to complete the credentialing process.

        The Delegate Credentialing Professional will finalize and upload 
        the documentation required for my credentialing process in 
        the OCS Credentials Platform.`;

    generatePdf(content);
  }

  const goBack = () => {
    setTermsPage(false);
  };

  return (
    <>
      {!isTermsOpen && (
        <>
          <div className={`bg-base-lightest px-10 pt-11 pb-8 w-96`}>
            <h2 className=" font-bold text-[1.5em]">Invite a Delegate</h2>
            <p>To collaborate in your credentialing process</p>

            <p className=" mt-3">
              <span className=" text-red-error">*</span> indicates a required
              field
            </p>
            <div className="mt-7">
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <fieldset>
                  <label htmlFor="delegateEmail">
                    Delegate email address{" "}
                    <span className="text-red-error">*</span>
                  </label>
                  <ErrorMessage
                    errors={errors}
                    name="delegateEmail"
                    render={({ message }) => (
                      <p
                        className=" font-bold text-red-error mb-2"
                        role="alert"
                      >
                        {message}
                      </p>
                    )}
                  />
                  <input
                    className={
                      errors.delegateEmail
                        ? " border-red-error border-4 w-full h-8"
                        : " border-black border w-full h-8"
                    }
                    type="email"
                    {...register("delegateEmail", {
                      required: "Your email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                    aria-invalid={errors.delegateEmail ? "true" : "false"}
                  />
                </fieldset>

                <fieldset>
                  <label htmlFor="emailConfirm">
                    Confirm delegate's email address{" "}
                    <span className="text-red-error">*</span>
                  </label>
                  <p className=" text-gray-50 text-sm">
                    Just to confirm, write the delegated email again.
                  </p>
                  <ErrorMessage
                    errors={errors}
                    name="emailConfirm"
                    render={({ message }) => (
                      <p
                        className=" font-bold text-red-error mb-2"
                        role="alert"
                      >
                        {message}
                      </p>
                    )}
                  />
                  <input
                    className={
                      errors.emailConfirm
                        ? " border-red-error border-4 w-full h-8"
                        : " border-black border w-full h-8"
                    }
                    type="email"
                    {...register("emailConfirm", {
                      required: "Please confirm the delegate's email",
                      validate: (value) =>
                        value === getValues("delegateEmail") ||
                        "Emails do not match",
                    })}
                  />
                </fieldset>
                <Checkbox
                  id="attestation"
                  label={
                    <label className="text-sm" htmlFor="attestation">
                      Agree to{" "}
                      <a
                        className="text-primary-blue underline cursor-pointer"
                        onClick={openTerms}
                      >
                        Terms & Conditions
                      </a>{" "}
                      to use this app.
                    </label>
                  }
                  className="mb-3 bg-base-lightest"
                  {...register("attestation", {
                    required: "Please confirm your information is true.",
                  })}
                  onChange={(e) => {
                    setIsAttestationChecked(e.target.checked);
                    setValue("attestation", e.target.checked, { shouldDirty: true });
                  }}
                />
                <div className="my-8"></div>
                <input
                  className="usa-button disabled:bg-button-disabled"
                  type="submit"
                  value={"Send Invitation"}
                  disabled={!isAttestationChecked}
                />
              </form>
            </div>
          </div>
        </>
      )}
      {isTermsOpen && (
        <div className={`bg-base-lightest px-10 pb-8 w-96 h-min -mt-10`}>
          <BackButton label="Back" onClick={goBack} paddingTop={40} />
          <div>
            <p className="text-lg leading-relaxed mt-8">
              I, Dr. {" "}
              {instance.getActiveAccount()?.idTokenClaims?.given_name +
                " " +
                instance?.getActiveAccount()?.idTokenClaims?.extension_LastName ??
                "as a Provider"}
              , confirm that I have selected a Delegate Credentialing
              Professional to act on my behalf to complete the credentialing
              process.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              The Delegate Credentialing Professional will finalize and upload
              the documentation required for my credentialing process in the OCS
              Credentials Platform.
            </p>
          </div>
          <div className="flex justify-end">
          <button type="button" 
              className="usa-button usa-button--outline mt-3"
              onClick={handleViewPDF}
              >
              View as PDF
          </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteForm;
