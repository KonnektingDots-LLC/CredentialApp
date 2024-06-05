import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { inviteInsurer } from "../../../Infraestructure/Services/insurer.service";
import { useState } from "react";

interface InviteFormProps {
  handleNext: () => void;
}

const InviteForm = ({ handleNext }: InviteFormProps) => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const api = useAxiosInterceptors();
  const [error, setError] = useState(false);

  const onSubmit = async () => {
    try {
      await inviteInsurer(api, getValues("insurerEmail")).then(res => {
        setError(false);
        if(res?.status === 200) {
          handleNext();
        } else {
            setError(true);
        }
      });
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <>
        <>
          <div className={`bg-base-lightest px-10 pt-11 pb-8 w-96`}>
            <h2 className=" font-bold text-[1.5em]">Invite an Insurer's Employee</h2>
            <p>To collaborate in your credentialing process</p>

            <p className=" mt-3">
              <span className=" text-red-error">*</span> indicates a required
              field
            </p>
            <div className="mt-7">
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <fieldset>
                  <label htmlFor="insurerEmail">
                    Insurer's employee email address{" "}
                    <span className="text-red-error">*</span>
                  </label>
                  <ErrorMessage
                    errors={errors}
                    name="insurerEmail"
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
                      errors.insurerEmail
                        ? " border-red-error border-4 w-full h-8"
                        : " border-black border w-full h-8"
                    }
                    type="email"
                    {...register("insurerEmail", {
                      required: "Your email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                    aria-invalid={errors.insurerEmail ? "true" : "false"}
                  />
                </fieldset>

                <fieldset>
                  <label htmlFor="emailConfirm">
                    Confirm email address{" "}
                    <span className="text-red-error">*</span>
                  </label>
                  <p className=" text-gray-50 text-sm">
                    Just to confirm, write the email again.
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
                      required: "Please confirm the insurer's email",
                      validate: (value) =>
                        value === getValues("insurerEmail") ||
                        "Emails do not match",
                    })}
                  />
                </fieldset>
                <div className="my-8"></div>
                <input
                  className="usa-button disabled:bg-button-disabled"
                  type="submit"
                  value={"Send Invitation"}
                />
              </form>
              {error && <p className=" font-bold text-red-error mt-2 ml-2" role="alert">
                        Error sending notification.
                      </p>}
            </div>
          </div>
        </>
    </>
  );
};

export default InviteForm;
