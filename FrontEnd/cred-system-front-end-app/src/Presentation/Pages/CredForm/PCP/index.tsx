import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import KDDatePicker from "../../../../Application/sharedComponents/KDDatePicker";
import { useNavigate } from "react-router-dom";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import NavStepperStatus from "../Components/NavStepperStatus";
import { pcpDefaultValues } from "../Components/defaultFormValues";
import ServiceHoursInput from "../Components/ServiceHoursInput";
import { PCPInterface, ServiceHours } from "../../../Layouts/formLayout/credInterfaces";
import EINInput from "../Components/EINInput";
import { getSpecialtyList, getStates } from "../../../../Infraestructure/Services/dropdowns.service";
import { Files, Specialty, State } from "../../../../Application/interfaces";
import AddressFields from "../Components/AddressFields";
import { Checkbox } from "@trussworks/react-uswds";
import InputEmail from "../../../../Application/sharedComponents/InputText/InputEmail";
import { CheckNavigateToPost, handleKeyDown } from "../../../../Application/utils/helperMethods";
import { getValidationNPI, postForm } from "../../../../Infraestructure/Services/form.service";
import PCPDropdown from "../Components/PCPdropdown";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import TextLimitLength from "../../../../Application/sharedComponents/InputText/TextLimitLength";
import PhoneNumber from "../../../../Application/sharedComponents/InputText/PhoneNumber";
import TaxIdInput from "../../../../Application/sharedComponents/InputText/TaxIdInput";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";
import { NpiInput } from "../../../../Application/sharedComponents/InputText/NpiInput";

const PCP = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const { data: formData, isLoading: isFormLoading } = useGetForm(api);

    const { data: specialtyList } = useQuery<Specialty[]>({
        queryKey: ["specialtyListOrg4"],
        queryFn: () => getSpecialtyList(api, 4)
    })

    const { data: states } = useQuery<State[]>({
        queryKey: ["states"],
        queryFn: () => getStates(api)
    })

    const [defaultFormValues, setDefaultFormValues] = useState<PCPInterface | undefined>(undefined);
    const [sameAs, setSameAs] = useState(formData?.steps?.pcpContract?.data?.addressInfo?.isPhysicalAddressSameAsMail);
    const [alert, setAlert] = useState(false);

    const methods = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues,
    });
    const {
        formState: { errors },
        register,
        setValue,
        setError,
        handleSubmit,
        trigger,
        watch,
        getValues,
        reset,
        clearErrors,
    } = methods;

    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    const [newFileName, setNewFileName] = useState('');

    const [deletedDocuments] = useAtom(documentToDeleteAtom);

    const handleFileSelected = (files: File[]) => {  
        const newFileDetails = files.map(file => {
            let oldFilename;

            if (newFileName !== formData?.steps?.pcpContract?.data?.endorsementLetterFile?.name) {
                oldFilename = formData?.steps?.pcpContract?.data?.endorsementLetterFile?.name;
            }
            return {
                documentTypeId: "15",
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(newFileDetails);
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };

    const handleDateInputChange  = (key: string) => (value: string | undefined) => {
        if (value === "NaN-NaN-NaN") {
            setValue(key, "", {shouldValidate: true, shouldDirty: true});
        }
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    }

    const handleOnCheckboxChange = (data: any) => {
        setSameAs(data.target.checked);
        setValue(`addressInfo.isPhysicalAddressSameAsMail`, data.target.checked, { shouldDirty: true });
    }

    const physicalAddressValues = watch([
        `addressInfo.physical.name`,
        `addressInfo.physical.address1`,
        `addressInfo.physical.address2`,
        `addressInfo.physical.city`,
        `addressInfo.physical.state`,
        `addressInfo.physical.zipcode`,
        `addressInfo.physical.zipcodeExtension`
    ]);

    useEffect(() => {
        if(sameAs) {
            setValue(`addressInfo.mail.name`, physicalAddressValues[0], { shouldDirty: true });
            setValue(`addressInfo.mail.address1`, physicalAddressValues[1], { shouldDirty: true });
            setValue(`addressInfo.mail.address2`, physicalAddressValues[2], { shouldDirty: true });
            setValue(`addressInfo.mail.city`, physicalAddressValues[3], { shouldDirty: true });
            setValue(`addressInfo.mail.stateId`, physicalAddressValues[4], { shouldDirty: true });
            setValue(`addressInfo.mail.zipcode`, physicalAddressValues[5], { shouldDirty: true });
            setValue(`addressInfo.mail.zipcodeExtension`, physicalAddressValues[6], { shouldDirty: true });
        }
    }, [physicalAddressValues, setValue, sameAs]);

    const isHoursPartiallyFilled = (hours: ServiceHours): boolean => {
        if ((hours?.hourFrom?.length > 0 && hours?.hourTo?.length > 0) ||
            (hours?.hourFrom === "" && hours?.hourTo === "")) {
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        const isValidFrontEnd = await trigger();
        let allValid = isValidFrontEnd;
        
        setAlert(false);
        const formValues = getValues() as PCPInterface;
        if (formValues.serviceHours?.some(isHoursPartiallyFilled)) {
            allValid = false;
            setAlert(true);
            return;
        }

        const billingNpiValue = getValues("billingNpiNumber");
        const groupNpiValue = getValues("npiGroupNumber");

        const isValidBillingNpi = await getValidationNPI(api, billingNpiValue);
        const isValidGroupNpi = await getValidationNPI(api, groupNpiValue);

        if (!isValidBillingNpi) {
            setError("billingNpiNumber", {
                type: "manual",
                message: "Invalid NPI"
            })
            allValid = false;
        }
        if (!isValidGroupNpi) {
            setError("npiGroupNumber", {
                type: "manual",
                message: "Invalid NPI"
            })
            allValid = false;
        }

        if (allValid) {
            try {
                if (!formData) return;
                formData.steps.pcpContract.status = NavStepperStatus.Completed;
                formData.steps.pcpContract.data = getValues();

                CheckNavigateToPost(PAGES_NAME.PCP, formData, api, navigate, filesDetail, deletedDocuments);

            } catch (error) {
                if (!formData) return;
                formData.steps.pcpContract.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.PCP;
            }
        }
    };

    const saveForLater = async () => {
        if (formData) {
            formData.steps.pcpContract.data = getValues();
            formData.setup.currentStep = PAGES_NAME.PCP;
            const response = await postForm(api, formData.setup.providerId, formData, filesDetail, deletedDocuments);
            if (response && response.status === 200) {
                const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
                role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
                window.scrollTo({
                    top: 0, 
                    behavior: 'smooth'
                });                
            }
        }
    }

    const goBack = async () => {
        if (!formData) return;
        navigate("/cred/4");
        return;
    };

    useEffect(() => {
        if (formData?.setup && !formData.setup.pcpApplies) {
            navigate('/form-setup');
            return;
        }
        setDefaultFormValues(pcpDefaultValues(formData));
        setSameAs(formData?.steps?.pcpContract?.data?.addressInfo?.isPhysicalAddressSameAsMail)
    }, [formData]);

    useEffect(() => {
    if (formData) {
        reset(defaultFormValues);
    }
}, [defaultFormValues, formData, reset]);

    if (isFormLoading && !formData) {
        return <LoadingComponent />
    }

    return <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack}/>
            <PageTitle
                title="Primary Care Physician (PCP) Contract"
                subtitle="Add your details to finish your profile."
            />     
            <h3 className="mb-3 -mt-5 font-bold text-2xl">Medicaid Program Only</h3>               
            <label>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </label>
            <div style={{height: "18px"}}></div>
            <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                <div className=" w-5/12">
                    <TextLimitLength label={"Group Name or PMG Name "} 
                        register={register} errors={errors} minLength={1}
                        name={"pmgName"}isRequired={true} maxLength={50}
                    />
                    
                    <NpiInput
                        isRequired
                        name="billingNpiNumber"
                        label="Billing NPI Number "
                    />


                    <TaxIdInput label={"Tax ID Group Number "} 
                        register={register} errors={errors}
                        name={"taxIdGroup"} setValue={setValue}
                        value={formData?.steps?.pcpContract?.data?.taxIdGroup}
                    />

                    <TextLimitLength label={"Group Medicaid ID "} 
                        register={register} errors={errors} maxLength={25} 
                        name={"medicaidIdLocation"}isRequired={true}
                        caption="5-25 characters allowed" minLength={5}
                    />

                    <NpiInput
                        isRequired
                        name="npiGroupNumber"
                        label="NPI Group Number"
                    />

                    <h3 className="font-black mt-4 mb-2">Physical Address</h3>

                    <AddressFields formData={formData?.steps?.pcpContract?.data} 
                        states={states} api={api}
                        register={register } setValue={setValue} errors={errors}
                        setError={setError} clearErrors={clearErrors}
                    />
                                        
                    <h3 className="font-black mt-4 mb-2">Mailing Address</h3>
                    <Checkbox 
                        {...register(`addressInfo.isPhysicalAddressSameAsMail`)}
                        id={`addressInfo.isPhysicalAddressSameAsMail`}
                        label="Same as Physical Address"
                        name={`addressInfo.isPhysicalAddressSameAsMail`}
                        checked={sameAs}
                        onChange={handleOnCheckboxChange}
                        className="ml-4 mb-2"
                    />
                    {!sameAs &&
                        <AddressFields formData={formData?.steps?.pcpContract?.data} 
                            states={states} api={api} isMail
                            register={register } setValue={setValue} errors={errors} 
                            setError={setError} clearErrors={clearErrors}
                        />
                    }
                    <div className="my-4"></div>

                    <KDDatePicker 
                        pickerId="endorsementLetterDate"
                        pickerLabel="Provide the PMG Endorsement Letter Date"
                        required={true}
                        onHandleChange={handleDateInputChange("endorsementLetterDate")}
                        errorHandler={errors} register={register}         
                        value={formData?.steps?.pcpContract?.data?.endorsementLetterDate}               
                    />

                    <div style={{height: "6px"}}></div>
                    <CredInputFiles title="PMG Endorsement Letter" 
                        description="Please attach your PMG Endorsement Letter as a .pdf document" 
                        fileId="endorsementLetterFile.name"
                        documentName="endorsementLetterFile.documentTypeId"
                        required={true}
                        register={register} errors={errors} setValue={setValue}
                        value={formData?.steps?.pcpContract?.data?.endorsementLetterFile?.name}
                        onHandleUpdatedFiles={handleFileSelected}
                        documentTypeId={15}
                        onFileNameChange={handleFileNameChange}
                    />
                    <div style={{height: "12px"}}></div>

                    <EINInput register={register } errors={errors} 
                        label={"Employer ID Number "} name={"employerId"} 
                        setValue={setValue} value={formData?.steps?.pcpContract?.data?.employerId ?? ""}
                    />

                    <PhoneNumber register={register} errors={errors} 
                        label={"Group Phone Number "} 
                        name={"contactNumber"} 
                        setValue={setValue} 
                        value={formData?.steps?.pcpContract?.data?.contactNumber}
                    />

                    <InputEmail label={"Group Email Address "} 
                        register={register} errors={errors}
                        name={"email"} isRequired={true}
                        caption="Valid: email@example.com"
                    />

                    <PCPDropdown register={register} errors={errors} name={"specifyPrimaryCareId"}
                        setValue={setValue}
                        selectValue={formData?.steps?.pcpContract?.data?.specifyPrimaryCareId} 
                        list={specialtyList? specialtyList : []}
                    />

                </div> 

                <div style={{height: "44px"}}></div>
                <label className="text-2xl font-black ">VITAL Service Hours</label>                    
                <div style={{height: "18px"}}></div>

                <ServiceHoursInput setValue={setValue} dayOfWeek={0}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={1}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={2}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={3}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={4}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={5}
                    formData={formData?.steps?.pcpContract.data?.serviceHours} 
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={6}
                    formData={formData?.steps?.pcpContract?.data?.serviceHours} 
                />
                {alert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Services Hours must be either fully filled out or completely empty.
                    </p>
                }
                <div className="flex flex-row my-16 ml-3">
                    <button type="button" className="usa-button usa-button--outline"
                        onClick={saveForLater}
                    >Save for Later</button>
                    <button type="submit" className="usa-button">Next</button>
                </div>                
            </form>
            </FormProvider>
        </div>
    </>
}

export default PCP;
