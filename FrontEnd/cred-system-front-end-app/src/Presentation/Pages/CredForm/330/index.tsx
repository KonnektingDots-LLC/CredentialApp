import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import KDDatePicker from "../../../../Application/sharedComponents/KDDatePicker";
import { useNavigate } from "react-router-dom";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import NavStepperStatus from "../Components/NavStepperStatus";
import { F330DefaultValues } from "../Components/defaultFormValues";
import SelectPCP from "../Components/SelectPCP";
import ServiceHoursInput from "../Components/ServiceHoursInput";
import { F330Interface, ServiceHours } from "../../../Layouts/formLayout/credInterfaces";
import { getSpecialtyList, getStates } from "../../../../Infraestructure/Services/dropdowns.service";
import { Files, Specialty, State } from "../../../../Application/interfaces";
import EINInput from "../Components/EINInput";
import AddressFields from "../Components/AddressFields";
import { Checkbox } from "@trussworks/react-uswds";
import InputEmail from "../../../../Application/sharedComponents/InputText/InputEmail";
import { CheckNavigateToBack, CheckNavigateToPost, handleKeyDown } from "../../../../Application/utils/helperMethods";
import { getValidationNPI, postForm } from "../../../../Infraestructure/Services/form.service";
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

const F330 = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();

    const { data: formData, isLoading: isFormLoading } = useGetForm(api);

    const { data: specialtyList } = useQuery<Specialty[]>({
        queryKey: ["specialtyList"],
        queryFn: () => getSpecialtyList(api, 1)
    })

    const { data: pcpList } = useQuery<Specialty[]>({
        queryKey: ["specialtyListOrg4"],
        queryFn: () => getSpecialtyList(api, 4)
    })

    const { data: states } = useQuery<State[]>({
        queryKey: ["states"],
        queryFn: () => getStates(api)
    })
 
    const [defaultFormValues, setDefaultFormValues] = useState<F330Interface | undefined>(undefined);
    const [sameAs, setSameAs] = useState(formData?.steps?.f330?.data?.addressInfo?.isPhysicalAddressSameAsMail);
    const [alert, setAlert] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const methods = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues,
    });
    const {
        register,
        setValue,
        formState: { errors },
        setError,
        reset,
        handleSubmit,
        trigger,
        watch,
        getValues,
        clearErrors,
        unregister,
    } = methods;

    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    const [deletedDocuments] = useAtom(documentToDeleteAtom);


    const handleFileSelected = (files: File[]) => {
        
        const newFileDetails = files.map(file => {
            let oldFilename;

            if (newFileName !== formData?.steps?.f330?.data?.endorsementLetterFile?.name) {
                oldFilename = formData?.steps?.f330?.data?.endorsementLetterFile?.name;
            }
    
            return {
                documentTypeId: "16",
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(newFileDetails);

        if (files.length === 0) {
            unregister("endorsementLetterFile.documentTypeId");
            const documentTypeIdToRemove = "16";
        
            const updatedFilesDetail = filesDetail.filter(detail => detail.documentTypeId !== documentTypeIdToRemove);
            setFilesDetail(updatedFilesDetail);
        }
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
        const formValues = getValues() as F330Interface;
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
                formData.steps.f330.status = NavStepperStatus.Completed;
                formData.steps.f330.data = getValues();
                
                CheckNavigateToPost(PAGES_NAME.F330, formData, api, navigate, filesDetail, deletedDocuments);
            } catch (error) {
                if (!formData) return;
                formData.steps.f330.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.F330
            }
        }
    };

    const saveForLater = async () => {
        if (formData) {
            formData.steps.f330.data = getValues();
            formData.setup.currentStep = PAGES_NAME.F330;
            await postForm(api, formData.setup.providerId, formData, filesDetail, deletedDocuments);
        }
        
        const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
        role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
        window.scrollTo({
            top: 0, 
            behavior: 'smooth'
        });
    }

    const goBack = () => {
        if (!formData) return;
        CheckNavigateToBack(PAGES_NAME.F330, formData, navigate);
    };
    
    useEffect(() => {
        if (formData && !formData.setup.f330Applies) {
            navigate('/form-setup');
            return;
        }
        setDefaultFormValues(F330DefaultValues(formData));
        setSameAs(formData?.steps?.f330?.data?.addressInfo?.isPhysicalAddressSameAsMail)
    }, [formData]);

    useEffect(() => {
        if (formData) {
            reset(defaultFormValues);
        }
    }, [defaultFormValues, formData, reset]);

    if (isFormLoading && !formData) {
        return <LoadingComponent />
    }

    return (
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack}/>
            <PageTitle
                title="Federally Qualified Health Centers (330)"
                subtitle="Add your details to finish your practice profile."
            />                    
            <label>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </label>
            <div style={{height: "18px"}}></div>
            <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                <div className=" w-5/12">
                    <TextLimitLength label={"FQHC Name "} 
                        register={register} errors={errors} 
                        name={"pmgName"}  isRequired={true}
                        minLength={1} maxLength={50}
                    />

                    <NpiInput
                        isRequired
                        name="billingNpiNumber"
                        label="Billing NPI Number"
                    />

                    <TaxIdInput label={"FQHC Tax ID Number "}
                        register={register} errors={errors}
                        name={"taxIdGroup"} setValue={setValue}
                        value={formData?.steps?.f330?.data?.taxIdGroup}
                    />

                    <TextLimitLength label={"FQHC Medicaid ID for this Location "} 
                        register={register} errors={errors} maxLength={25}
                        name={"medicaidIdLocation"} isRequired={true} 
                        minLength={5} caption="5-25 characters allowed" 
                    />

                    <NpiInput
                        isRequired
                        name="npiGroupNumber"
                        label="NPI Group Number"
                    />

                    <h3 className="font-black mt-4 mb-2">Physical Address</h3>

                    <AddressFields formData={formData?.steps?.f330?.data}
                        states={states} api={api} clearErrors={clearErrors}
                        register={register } setValue={setValue} errors={errors} 
                        setError={setError}
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
                        <AddressFields formData={formData?.steps?.f330?.data} 
                            states={states} api={api} isMail clearErrors={clearErrors}
                            register={register } setValue={setValue} errors={errors} 
                            setError={setError}
                        />
                    }
                    <div className="my-4"></div>

                    <KDDatePicker 
                        pickerId="endorsementLetterDate"
                        pickerLabel="Provide the FQHC Endorsement Letter Date"
                        required={false}
                        onHandleChange={handleDateInputChange("endorsementLetterDate")}
                        errorHandler={errors} register={register }        
                        value={formData?.steps?.f330?.data?.endorsementLetterDate}                
                    />

                    <div style={{height: "6px"}}></div>
                    <CredInputFiles title="FQHC Endorsement Letter" 
                        description="Please attach your FQHC Endorsement Letter as a .pdf document" 
                        fileId="endorsementLetterFile.name"
                        required={false}
                        register={register} errors={errors} setValue={setValue}
                        value={formData?.steps?.f330?.data?.endorsementLetterFile?.name}
                        onHandleUpdatedFiles={handleFileSelected}
                        documentTypeId={16}
                        documentName="endorsementLetterFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}
                    />
                    <div style={{height: "12px"}}></div>

                    <EINInput register={register } errors={errors} 
                        label={"FQHC Employer ID Number "} name={"employerId"} 
                        setValue={setValue} value={formData?.steps?.f330?.data?.employerId ?? ""}
                    />

                    <PhoneNumber register={register} errors={errors} 
                        label={"FQHC Phone Number "} 
                        name={"contactNumber"} 
                        setValue={setValue} 
                        value={formData?.steps?.f330?.data?.contactNumber}
                    />

                    <InputEmail label={"FQHC Email Address "} 
                        register={register} errors={errors}
                        name={"email"} isRequired={true}
                        caption="Valid: email@example.com"
                    />

                    <SelectPCP register={register} errors={errors} trigger={trigger} watch={watch}
                        name={"pcpOrSpecialistId"} setValue={setValue} specialtyList={specialtyList}
                        radioValue={formData?.steps?.f330?.data?.pcpOrSpecialistId}
                        selectPCPValue={formData?.steps?.f330?.data?.specifyPrimaryCareId}
                        selectSpecialtyValue={formData?.steps?.f330?.data?.typeOfSpecialistId}
                        primaryCareList={pcpList}
                    />
                </div> 

                <div style={{height: "44px"}}></div>
                <label className="text-2xl font-black ">VITAL Service Hours</label>                    
                <div style={{height: "18px"}}></div>
                <ServiceHoursInput setValue={setValue} dayOfWeek={0}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={1}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={2}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={3}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={4}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={5}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                <ServiceHoursInput setValue={setValue} dayOfWeek={6}
                    formData={formData?.steps?.f330?.data?.serviceHours}
                />
                {alert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Services Hours must be either fully filled out or completely empty.
                    </p>
                }
                <div className="flex flex-row my-16 ml-3">
                    <button type="button" className="usa-button usa-button--outline"
                        onClick={saveForLater}>Save for Later</button>
                    <button type="submit" className="usa-button">Next</button>
                </div>                
            </form>
            </FormProvider>
        </div>
    )
}

export default F330;
