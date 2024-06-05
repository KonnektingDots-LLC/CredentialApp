import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import BackButton from "../Components/BackButton";
import { useForm } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import SelectHospitalPriviliges from "./Components/SelectHospitalPriviliges";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavStepperStatus from "../Components/NavStepperStatus";
import { postForm } from "../../../../Infraestructure/Services/form.service";
import { CheckNavigateToBack, handleKeyDown } from "../../../../Application/utils/helperMethods";
import { hospitalDefaultValues } from "../Components/defaultFormValues";
import { getHospitalList, getHospitalPrivilegesType } from "../../../../Infraestructure/Services/dropdowns.service";
import SelectHospitalName from "./Components/SelectHospitalName";
import { Files, HospitalList, HospitalPrivilegesType } from "../../../../Application/interfaces";
import { HospitalAffiliationsInterface } from "../../../Layouts/formLayout/credInterfaces";
import KDDateInput from "../../../../Application/sharedComponents/KDDateInput";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useQuery } from "@tanstack/react-query";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const HospitalAffiliations = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

    const { data: hospitalList } = useQuery<HospitalList[]>({
        queryKey: ["hospitalList"],
        queryFn: () => getHospitalList(api)
    })
        
    const { data: hospitalPrivilegesType } = useQuery<HospitalPrivilegesType[]>({
        queryKey: ["hospitalPrivilegesType"],
        queryFn: () => getHospitalPrivilegesType(api) 
    })

    const [defaultFormValues, setDefaultFormValues] = useState<HospitalAffiliationsInterface | undefined>(undefined);
    const filesDetail: Files[] = [];
    const [alert, setAlert] = useState(false);

    const { register, setValue, formState: { errors, isDirty }, trigger, reset, handleSubmit, getValues, watch } = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues
    });

    const handleDateInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    };

    const isPartiallyFilled = (hosp: any): boolean => {
        if (hosp.hospitalListId === "0") {
            hosp.hospitalListId = ""
        }
        if (hosp.hospitalPrivilegesType === "0") {
            hosp.hospitalPrivilegesType = ""
        }
        const values = [
            hosp.hospitalListId,
            hosp.hospitalPrivilegesType,
            hosp.providerStartingMonth,
            hosp.providerStartingYear,
            hosp.providerEndingMonth,
            hosp.providerEndingYear
        ];
      
        const filledValues = values.filter(value => Boolean(value));
        return filledValues.length > 0 && filledValues.length < values.length;
    };

    const onSubmit = async () => {
        setAlert(false);
        const isValidFrontEnd = await trigger();
        let allValid = isValidFrontEnd;

        const formValues = getValues();

        if (isPartiallyFilled(formValues.secondary)) {
            allValid = false;
            setAlert(true);
            return;
        }

        if (allValid && isDirty) {
            try {
                if (!formData) {
                    return;
                }            
                formData.steps.hospitalAffiliations.status = NavStepperStatus.Completed;
                formData.steps.hospitalAffiliations.data = getValues();
                formData.setup.currentStep = PAGES_NAME.Education;

                await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                    if (res?.status === 200) {
                        navigate("/cred/8");
                        window.scrollTo({
                            top: 0, 
                            behavior: 'smooth'
                        });
                    }
                });
            } catch (error) {
                if (!formData) return;
                formData.steps.hospitalAffiliations.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.Hospitals;
            }
        } else if (allValid) {
            if (formData && formData.steps.hospitalAffiliations.status !== NavStepperStatus.Completed) {
                formData.steps.hospitalAffiliations.status = NavStepperStatus.Completed;
                formData.setup.currentStep = PAGES_NAME.Education;
                await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                    if (res?.status === 200) {
                        navigate("/cred/8");
                        window.scrollTo({
                            top: 0, 
                            behavior: 'smooth'
                        });
                    }
                });
            } else {
                navigate("/cred/8");
                window.scrollTo({
                    top: 0, 
                    behavior: 'smooth'
                });             
            }
        }
    }

    const saveForLater = async () => {
        if (formData) {
            formData.steps.hospitalAffiliations.data = getValues();
            formData.setup.currentStep = PAGES_NAME.Hospitals;
            const response = await postForm(api, formData.setup.providerId, formData, filesDetail);
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

    const goBack = () => {
        if (!formData) return;
        CheckNavigateToBack(PAGES_NAME.Hospitals, formData, navigate);
    };

    useEffect(() => {
        if (formData && !formData.setup.hospitalAffiliationsApplies) {
            navigate('/form-setup');
            return;
        }
        setDefaultFormValues(hospitalDefaultValues(formData));

    }, [formData]);  
    
    useEffect(() => {
        if (formData) {
            reset(defaultFormValues);
        }
    }, [defaultFormValues, formData, reset]);

    if (isLoadingForm && !formData) {
        return <LoadingComponent />
    }

    return <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack}/>
            <PageTitle
                title="Hospital Affiliations"
                subtitle="Add your details to fill out your information about your Affiliated Hospitals."
            />
            <label>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </label>
            <div style={{height: "18px"}}></div>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                <div className=" w-5/12">
                    <h3 className="font-black mt-4 mb-2">Primary Hospital</h3>

                    <SelectHospitalName name="primary.hospitalListId"
                        label="Hospital Name"
                        register={register}
                        errors={errors} setValue={setValue}
                        value={formData?.steps?.hospitalAffiliations?.data?.primary?.hospitalListId} 
                        list={hospitalList} required                
                    />

                    <SelectHospitalPriviliges name="primary.hospitalPrivilegesType"
                        label="Select Hospital Privileges Type"
                        register={register} list={hospitalPrivilegesType}
                        errors={errors} setValue={setValue}
                        value={formData?.steps?.hospitalAffiliations?.data?.primary?.hospitalPrivilegesType}
                        required
                    />

                    <fieldset className="flex flex-col mt-3">
                        <label>
                            Hospital Privileges Effective Date{" "}
                            <span className="text-red-error">*</span>
                        </label>
                        <div>
                            <div className="flex -mt-4 gap-3">
                                <label className="mt-[18%] mr-9">
                                From{" "}
                                </label>
                                <KDDateInput pickerId={`primary.providerStartingMonth`}
                                    pickerLabel={"Month "} unit={"month"} required
                                    onHandleChange={handleDateInputChange(`primary.providerStartingMonth`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.primary?.providerStartingMonth}
                                    watch={watch} valueToWatch={`primary.providerStartingYear`}
                                />
                                
                                <KDDateInput pickerId={`primary.providerStartingYear`}
                                    pickerLabel={"Year "} unit={"year"} required
                                    onHandleChange={handleDateInputChange(`primary.providerStartingYear`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.primary?.providerStartingYear}
                                    watch={watch} valueToWatch={`primary.providerStartingMonth`}
                                />
                            </div>
                            <div className="flex gap-3">
                                <label className="mt-[18%] mr-14">
                                To{" "}
                                </label>
                                <KDDateInput pickerId={`primary.providerEndingMonth`}
                                    pickerLabel={"Month "} unit={"month"} required
                                    onHandleChange={handleDateInputChange(`primary.providerEndingMonth`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.primary?.providerEndingMonth}
                                    watch={watch} valueToWatch={`primary.providerEndingYear`}
                                    acceptFuture
                                />
                                
                                <KDDateInput pickerId={`primary.providerEndingYear`}
                                    pickerLabel={"Year "} unit={"year"} required
                                    onHandleChange={handleDateInputChange(`primary.providerEndingYear`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.primary?.providerEndingYear}
                                    watch={watch} valueToWatch={`primary.providerEndingMonth`} 
                                    acceptFuture
                                />
                            </div>
                        </div>
                    </fieldset>

                    <h3 className="font-black mt-4 mb-2">Secondary Hospital</h3>
                    {alert &&
                        <p className="font-bold text-red-error my-2 w-[450px]" role="alert">
                        Section must be either fully filled out or completely empty.
                        </p>
                    }
                    <SelectHospitalName name="secondary.hospitalListId"
                        label="Hospital Name"
                        register={register}
                        errors={errors} setValue={setValue}
                        value={formData?.steps?.hospitalAffiliations?.data?.secondary?.hospitalListId} 
                        list={hospitalList} required={false}                
                    />

                    <SelectHospitalPriviliges name="secondary.hospitalPrivilegesType"
                        label="Select Hospital Privileges Type"
                        register={register} list={hospitalPrivilegesType}
                        errors={errors} setValue={setValue}
                        value={formData?.steps?.hospitalAffiliations?.data?.secondary?.hospitalPrivilegesType}  
                        required={false}
                    />

                   <fieldset className="flex flex-col mt-3">
                        <label>
                            Hospital Privileges Effective Date{" "}
                            {/* <span className="text-red-error">*</span> */}
                        </label>
                        <div className={errors[`secondary.providerStartingMonth` &&
                            `secondary.providerStartingYear` && 
                            `secondary.providerEndingMonth` && 
                            `secondary.providerEndingYear`] && 
                            "usa-form-group usa-form-group--error"}>
                            <div className="flex -mt-4 gap-3">
                                <label className="mt-[18%] mr-9">
                                From{" "}
                                </label>
                                <KDDateInput pickerId={`secondary.providerStartingMonth`}
                                    pickerLabel={"Month "} unit={"month"} required={false}
                                    onHandleChange={handleDateInputChange(`secondary.providerStartingMonth`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.secondary?.providerStartingMonth}
                                    watch={watch} valueToWatch={`secondary.providerStartingYear`}
                                />
                                
                                <KDDateInput pickerId={`secondary.providerStartingYear`}
                                    pickerLabel={"Year "} unit={"year"} required={false}
                                    onHandleChange={handleDateInputChange(`secondary.providerStartingYear`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.secondary?.providerStartingYear}
                                    watch={watch} valueToWatch={`secondary.providerStartingMonth`}
                                />
                            </div>
                            <div className="flex gap-3">
                                <label className="mt-[18%] mr-14">
                                To{" "}
                                </label>
                                <KDDateInput pickerId={`secondary.providerEndingMonth`}
                                    pickerLabel={"Month "} unit={"month"} required={false}
                                    onHandleChange={handleDateInputChange(`secondary.providerEndingMonth`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.secondary?.providerEndingMonth}
                                    watch={watch} valueToWatch={`secondary.providerEndingYear`}
                                    acceptFuture
                                />
                                
                                <KDDateInput pickerId={`secondary.providerEndingYear`}
                                    pickerLabel={"Year "} unit={"year"} required={false}
                                    onHandleChange={handleDateInputChange(`secondary.providerEndingYear`)}
                                    errorHandler={errors} register={register} 
                                    value={formData?.steps?.hospitalAffiliations?.data?.secondary?.providerEndingYear}
                                    watch={watch} valueToWatch={`secondary.providerEndingMonth`}
                                    acceptFuture
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="flex flex-row mb-16 mt-10 ml-3">
                    <button type="button" className="usa-button usa-button--outline"
                        onClick={saveForLater}>Save for Later</button>
                    <button type="submit" className="usa-button">Next</button>
                </div>  
            </form>
        </div>
    </>
}

export default HospitalAffiliations;
