import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues,
  UseFormTrigger,
  UseFormSetError,
} from "react-hook-form";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import { ErrorMessage } from "@hookform/error-message";
import InputTextField from "../../../Application/sharedComponents/InputText/InputTextField";
import { Checkbox, Radio } from "@trussworks/react-uswds";
import { ChangeEvent, useEffect, useState } from "react";
import { ExtendedFieldValues } from "../../../Application/utils/constants";
import {
  CreateUser,
  getProviderType,
} from "../../../Infraestructure/Services/provider.service";
import KDDatePicker from "../../../Application/sharedComponents/KDDatePicker";
import { ProviderType } from "../../../Application/interfaces";
import {
  getValidationNPI,
  postForm,
} from "../../../Infraestructure/Services/form.service";
import { defaultForm } from "../../Layouts/formLayout/defaultForm";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { useMsal } from "@azure/msal-react";
import PhoneNumber from "../../../Application/sharedComponents/InputText/PhoneNumber";
import { NpiInput } from "../../../Application/sharedComponents/InputText/NpiInput";

interface Props {
  handleSubmit: UseFormHandleSubmit<any, undefined>;
  register: UseFormRegister<ExtendedFieldValues>;
  setValue: UseFormSetValue<ExtendedFieldValues>;
  errors: FieldErrors<ExtendedFieldValues>;
  watch: UseFormWatch<ExtendedFieldValues>;
  control: Control<any, any>;
  setDataSent: React.Dispatch<React.SetStateAction<boolean>>;
  getValues: UseFormGetValues<ExtendedFieldValues>;
  trigger: UseFormTrigger<ExtendedFieldValues>;
  setError: UseFormSetError<ExtendedFieldValues>;
}

const PersonalInformation = (
    // prettier-ignore
    {
      setDataSent, handleSubmit, register, setValue, errors, control, getValues,
      trigger, setError,
    }: Props
) => {
  const width = 340;
  const { fields, append, remove } = useFieldArray({
    name: "multipleNpi",
    control,
    rules: {
      minLength: { value: 1, message: "Please include at least one NPI" },
    },
  });

  const api = useAxiosInterceptors();
  const { instance } = useMsal();

  const email = instance.getActiveAccount()?.username ?? "";
  const [sameNPIs, setSameNPIs] = useState(false);
  const [isAttestationChecked, setIsAttestationChecked] = useState(false);
  const [providerType, setProviderType] = useState<ProviderType[] | undefined>(undefined);
  const [userPickedRole, setUserRole] = useState(0);

  const handleGenderChange = (data: ChangeEvent<HTMLInputElement>) => {
    setValue("gender", data.target.value, { shouldValidate: true, shouldDirty: true });
  };

  const handleSameNPIs = (data: ChangeEvent<HTMLInputElement>) => {
    setSameNPIs(data.target.checked);
    setValue("billingSameAsRenderingNpi", data.target.checked, {
      shouldValidate: true, shouldDirty: true
    });
  };

  const handleDateInputChange =
    (key: string) => (value: string | undefined) => {
      setValue(key, value, { shouldValidate: true, shouldDirty: true });
    };

  const onSubmit = async () => {
    try {

      const isValidFrontEnd = await trigger();
      let allValid = isValidFrontEnd;

      const renderingNpi = getValues().renderingNpi;
      const isValidRenderingNpi = await getValidationNPI(api, renderingNpi);

      if (!isValidRenderingNpi) {
        setError("renderingNpi", {
          type: "manual",
          message: "Invalid NPI",
        });
        allValid = false;
      }
      if (!getValues().billingSameAsRenderingNpi) {
        const billingNpi = getValues().billingNpi;
        const isValidBillingNpi = await getValidationNPI(api, billingNpi);

        if (!isValidBillingNpi) {
          setError("billingNpi", {
            type: "manual",
            message: "Invalid NPI",
          });
          allValid = false;
        }
      }

      if (getValues().multipleNpi?.[0].npi !== "") {
        getValues().multipleNpi?.forEach(async (obj, i) => {
          const npi = obj?.npi;
          const isValidNpi = await getValidationNPI(api, npi);

          if (isValidNpi) {
            setError(`multipleNpi.${i}.npi`, {
              type: "manual",
              message: "Invalid NPI",
            });
            allValid = false;
          }
        });
      }

      if (allValid) {
        const createUser = await CreateUser(api, getValues());
        if (createUser?.status === 200) {
          const provider = { providerId: createUser.data.createdProviderResponse.providerId }
          sessionStorage.setItem("provider", JSON.stringify(provider));
          const formData = defaultForm;
          formData.setup.providerId = provider.providerId;
          formData.setup.providerEmail = instance.getActiveAccount()?.username ?? "";
          const defaultJsonSend = await postForm(api, provider.providerId, formData, []);
          if (defaultJsonSend?.status === 200) {
            setDataSent(true);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            }); 
          }
        }
      }
    } catch (error) {
      console.log("personal info error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchProviderType = await getProviderType(api);
      setProviderType(fetchProviderType);
    };
    fetchData();
  }, [api]);

  return (
    <>
      <div className=" pl-10 pb-8">
        <h2 className="text-sm">
          Required fields are marked with an asterisk (
          <span className=" text-red-error">*</span>).
        </h2>
        <div className="mt-7">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <fieldset>
              <div className={`flex flex-col w-80`}>
                <label htmlFor="providerTypeId">
                  My position is <span className="text-red-error">*</span>
                </label>
                  <select
                    className={
                      errors.providerTypeId
                        ? " border-red-error border-4 w-full h-8"
                        : " border-black border w-full h-8"
                    }
                    {...register("providerTypeId", {
                      required: "You must select a role",
                    })}
                    onChange={(e) => {
                      setValue("providerTypeId", e.target.value, { shouldDirty: true });
                      setUserRole(parseInt(e.target.value));
                    }}
                  >
                    <option value={""}></option>
                    {providerType?.map((type) => {
                      return (
                        <>
                          <option value={type?.id}>{type.name}</option>
                        </>
                      );
                    })}
                  </select>
              </div>
            </fieldset>
            <fieldset
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "10px",
              }}
            >
              <span>
                <label className="flex gap-2 items-center" htmlFor="email">
                  Email
                </label>
                <input
                  {...register("email")}
                  className={`border-black border w-80 h-8`}
                  value={email}
                  disabled
                />
              </span>
              <span>
                <label className="flex gap-2 items-center" htmlFor="firstName">
                  First or given name
                </label>
                <input
                  {...register("firstName")}
                  className={`border-black border w-80 h-8`}
                  value={
                    (instance.getActiveAccount()?.idTokenClaims
                      ?.given_name as string) ?? ""
                  }
                  disabled
                />
              </span>
              <span>
                <label className="flex gap-2 items-center" htmlFor="middleName">
                  Middle name
                </label>
                <input
                  {...register("middleName")}
                  className={`border-black border w-80 h-8`}
                  value={
                    (instance.getActiveAccount()?.idTokenClaims
                      ?.extension_MiddleName as string) ?? ""
                  }
                  disabled
                />
              </span>
              <span>
                <label className="flex gap-2 items-center" htmlFor="lastName">
                  Last or family name
                </label>
                <input
                  {...register("lastName")}
                  className={`border-black border w-80 h-8`}
                  value={
                    (instance.getActiveAccount()?.idTokenClaims
                      ?.extension_LastName as string) ?? ""
                  }
                  disabled
                />
              </span>
              <span>
                <label className="flex gap-2 items-center" htmlFor="surName">
                  Second last name
                </label>
                <input
                  {...register("surName")}
                  className={`border-black border w-80 h-8`}
                  value={
                    (instance.getActiveAccount()?.idTokenClaims
                      ?.family_name as string) ?? ""
                  }
                  disabled
                />
              </span>
            </fieldset>

            <PhoneNumber
              register={register}
              errors={errors}
              name={"phoneNumber"}
              label={"Phone Number"} 
              setValue={setValue} 
              value={""}          
              />
                <KDDatePicker
                  pickerId={"birthDate"}
                  pickerLabel={"Date of Birth"}
                  required={true}
                  register={register}
                  errorHandler={errors}
                  onHandleChange={handleDateInputChange("birthDate")}
                  validationType="age"
                />
                <fieldset>
                  <div
                    className={
                      errors["gender"] && "usa-form-group usa-form-group--error"
                    }
                  >
                    <label>
                      Gender: <span className="text-red-error">*</span>
                    </label>
                    <ErrorMessage
                      errors={errors}
                      name={"gender"}
                      render={({ message }) => (
                        <p
                          className="font-bold text-red-error -mb-1"
                          role="alert"
                        >
                          {message}
                        </p>
                      )}
                    />
                    <Radio
                      id="rb-male"
                      {...register("gender", {
                        required: "Please pick a gender",
                      })}
                      name={"gender"}
                      label="Male"
                      value="Male"
                      onChange={handleGenderChange}
                    />
                    <Radio
                      id="rb-female"
                      name={"gender"}
                      label="Female"
                      value="Female"
                      onChange={handleGenderChange}
                    />
                    <Radio
                      id="rb-other"
                      name={"gender"}
                      label="Other"
                      value="Other"
                      onChange={handleGenderChange}
                    />
                  </div>
                </fieldset>

                {(userPickedRole === 1 ||
                  userPickedRole === 2 ||
                  userPickedRole === 3 ||
                  userPickedRole === 4) && (
                  <>

                    <div style={{width: `${width}px`}}>
                        <NpiInput 
                            isRequired
                            name="renderingNpi"
                            label="Rendering NPI"
                        />
                    </div>

                    <Checkbox
                      id="billingSameAsRenderingNpi"
                      label="Billing NPI same as Rendering NPI"
                      className={sameNPIs ? "ml-4 mb-6" : "my-3 ml-4"}
                      {...register("billingSameAsRenderingNpi")}
                      onChange={handleSameNPIs}
                    />

                    {!sameNPIs && (
                        <div style={{width: `${width}px`}}>
                            <NpiInput 
                                isRequired
                                name="billingNpi"
                                label="Billing NPI"
                                caption="For example: 4281986537"
                                captionBelow="10 characters allowed"
                            />
                        </div>
                    )}
                  </>
                )}

                {(userPickedRole === 2 || userPickedRole === 4) && (
                  <p className=" font-bold mt-2">
                    Add all the NPIs that apply to you
                  </p>
                )}

                {(userPickedRole === 2 || userPickedRole === 4) &&
                  fields.map((_, index) => {
                    return (
                      <>
                        <div className="flex">
                          <div className="flex flex-col">
                            <InputTextField
                              label={`NPI Corporate Name ${index + 1}`}
                              register={register}
                              errors={errors}
                              type={"text"}
                              name={`multipleNpi.${index}.corporateName`}
                              isRequired={
                                userPickedRole === 2 || userPickedRole === 4
                              }
                              width={340}
                            />

                            <NpiInput 
                                isRequired={
                                  userPickedRole === 2 || userPickedRole === 4
                                }
                                name={`multipleNpi.${index}.npi`}
                                label={`NPI Number ${index + 1}`}
                            />
                          </div>
                          {index > 0 && (
                            <span
                              className=" cursor-pointer self-center ml-1"
                              onClick={() => remove(index)}
                            >
                              <AiFillMinusCircle
                                className=" text-red-error"
                                size={19}
                              />
                            </span>
                          )}
                        </div>
                        <hr className=" text-gray-200 mx-auto my-3" />
                      </>
                    );
                  })}

                {(userPickedRole === 2 || userPickedRole === 4) && (
                  <>
                    <div className="flex gap-2 mb-5 cursor-pointer">
                      <IoMdAddCircle className=" text-green-600" />
                      <span
                        className="text-primary"
                        onClick={() => {
                          append({ npi: "", corporateName: "" });
                        }}
                      >
                        Add another NPI
                      </span>
                    </div>
                    {errors["multipleNpi"] ? (
                      <p
                        className=" font-bold text-red-error mb-6"
                        role="alert"
                      >
                        Please include all your relevant NPIs
                      </p>
                    ) : (
                      ""
                    )}
                  </>
                )}

            <Checkbox
              id="attestation"
              label={
                <label className="text-sm" htmlFor="attestation">
                  I confirm that all the information I entered is true.
                </label>
              }
              className="mb-3"
              {...register("attestation", {
                required: "Please confirm your information is true.",
              })}
              onChange={(e) => {
                setIsAttestationChecked(e.target.checked);
                setValue("attestation", e.target.checked, { shouldDirty: true });
              }}
            />

            <input
              className="usa-button disabled:bg-button-disabled"
              type="submit"
              value={"Save"}
              disabled={!isAttestationChecked}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
