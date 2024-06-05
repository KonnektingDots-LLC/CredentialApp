import { useEffect, useState } from "react";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import { MdMessage } from "react-icons/md";
import { ExtendedFieldValues } from "../../../Application/utils/constants";
import { FormProvider, useForm } from "react-hook-form";
import InformationComplete from "./InformationComplete";
import PersonalInformation from "./PersonalInformation";
import { getProviderByEmail } from "../../../Infraestructure/Services/provider.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { msalInstance } from "../../..";
import { Button } from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";
 
const UserInformation = () => {
    // FIX: shouldn't this be inside the <PersonalInformation /> component?
    // is being used only there after all
    const methods = useForm<ExtendedFieldValues>({
        defaultValues: {
            "multipleNpi": [{ npi: "", "corporateName": "" }],
            "role": "",
            "billingSameAsRenderingNpi": false,
            attestation: false,
        },
    });
  const { handleSubmit, register, setValue, formState: { errors }, watch, 
    control, getValues, trigger, setError } = methods;

  const [dataSent, setDataSent] = useState<boolean>(false);
  const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string ?? "PROV";  
const api = useAxiosInterceptors();
const email = msalInstance.getActiveAccount()?.username as string ?? "";
const [infoExist, setInfoExist] = useState<boolean>(false);
const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getProviderByEmail(api, email).then(res => {
        if (res?.providerId) {
          setInfoExist(true);
        }
      });
    };
    fetchData();
  }, [api, email]);

  return (
    <div>
      {dataSent ? <InformationComplete role={role}/> : <>
        <section>
          <PageTitle
            title="Personal Information"
            subtitle={<>Get started on your streamlined information submission. <br/>Please complete this before starting the form or inviting a delegate.</>}
          />
        </section>
        <section>
          <div className=" flex">
            <div className="left_side w-4/5">
              {infoExist ? <>
            <p className=" text-ink ml-8 text-xl mt-10 font-light">Your personal information is already saved.</p>
            <Button className="ml-8 mt-10" type="button" onClick={() => navigate('/')}>Go Home</Button>
          </> :
            <FormProvider {...methods}>
              <PersonalInformation handleSubmit={handleSubmit} 
                register={register} setValue={setValue} errors={errors} 
                watch={watch} control={control} setError={setError}
                setDataSent={setDataSent} getValues={getValues} 
                trigger={trigger}
              />
            </FormProvider>
            }
            </div>
            <div className="right-side w-[60%]">
              <div
                id="image-caption-wrap"
                className="flex gap-3 mt-8 bg-accent-cool-lighter rounded w-[70%] p-3"
              >
                <div className=" self-center">
                  <MdMessage size={35} />
                </div>
                <div className="w-60">
                  <h5 className=" font-bold text-sm">
                    Colaboration and communication
                  </h5>
                  <p className=" text-sm text-left">
                    Communicate seamlessly with credentialing organizations and
                    institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>}
    </div>
  );
};

export default UserInformation;
