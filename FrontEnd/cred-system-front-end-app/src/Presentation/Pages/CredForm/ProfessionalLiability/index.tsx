import { useForm } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { useNavigate } from "react-router-dom";
import KDDatePicker from "../../../../Application/sharedComponents/KDDatePicker";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import { ChangeEvent, useEffect, useState } from "react";
import SelectInsuranceName from "../Components/SelectInsuranceName";
import NavStepperStatus from "../Components/NavStepperStatus";
import { postForm } from "../../../../Infraestructure/Services/form.service";
import { insuranceDefaultValues } from "../Components/defaultFormValues";
import { getInsuranceCarrierList, getMalpracticeCarrierList } from "../../../../Infraestructure/Services/dropdowns.service";
import { Files, InsuranceCarrierName } from "../../../../Application/interfaces";
import { PLInterface } from "../../../Layouts/formLayout/credInterfaces";
import { Checkbox } from "@trussworks/react-uswds";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import TextLimitLength from "../../../../Application/sharedComponents/InputText/TextLimitLength";
import DollarInput from "../../../../Application/sharedComponents/InputText/DollarInput";
import { useAtom } from "jotai";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useQuery } from "@tanstack/react-query";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";
import { handleKeyDown } from "../../../../Application/utils/helperMethods";

const ProfessionalLiability = () => {
    const width = 390;
    const navigate = useNavigate();
    const api = useAxiosInterceptors();

    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

    const { data: insuranceName } = useQuery<InsuranceCarrierName[]>({
        queryKey: ["insuranceCarrierList"],
        queryFn: () => getInsuranceCarrierList(api)

    })

    const { data: malpracticeList } = useQuery<InsuranceCarrierName[]>({
        queryKey: ["malpracticeCarrierList"],
        queryFn: () => getMalpracticeCarrierList(api)

    })

    const [defaultFormValues, setDefaultFormValues] = useState<PLInterface | undefined>(undefined);
    const [caseNumbers, setCaseNumbers] = useState<number[]>([0]);
    const [plCheckbox, setPLCheckbox] = useState(formData?.steps?.professionalLiability?.data?.professionalLiability?.isSelected);
    const [newFileName, setNewFileName] = useState('');

    const { register, setValue, formState: { errors, isDirty }, reset, handleSubmit, getValues, unregister } = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues
    });
    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    const [deletedDocuments] = useAtom(documentToDeleteAtom);

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (documentTypeId === "22" && newFileName !== formData?.steps?.professionalLiability?.data?.malpractice?.certificateCoverageFile?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.malpractice?.certificateCoverageFile?.name;
            }
            if (documentTypeId === "23" && newFileName !== formData?.steps?.professionalLiability?.data?.professionalLiability?.certificateCoverageFile?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.professionalLiability?.certificateCoverageFile?.name;
            }
            if (documentTypeId === "24" && newFileName !== formData?.steps?.professionalLiability?.data?.actionExplanationFormFile?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.actionExplanationFormFile?.name;
            }
            if (documentTypeId === "25" && newFileName !== formData?.steps?.professionalLiability?.data?.link1File?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.link1File?.name;
            }
            if (documentTypeId === "26" && newFileName !== formData?.steps?.professionalLiability?.data?.link2File?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.link2File?.name;
            }
            if (documentTypeId === "27" && newFileName !== formData?.steps?.professionalLiability?.data?.link3File?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.link3File?.name;
            }
            if (documentTypeId === "28" && newFileName !== formData?.steps?.professionalLiability?.data?.link4File?.name) {
                oldFilename = formData?.steps?.professionalLiability?.data?.link4File?.name;
            }
    
            return {
                documentTypeId: documentTypeId,
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(prevDetails => {
            const updatedDetails = prevDetails.filter(detail => detail.documentTypeId !== documentTypeId);
            return [...updatedDetails, ...newFileDetails];
        });  
        if (files.length === 0 && documentTypeId === "23") {
            unregister("professionalLiability.certificateCoverageFile.documentTypeId");
        }
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };
        
    const handleDateInputChange  = (key: string) => (value: string | undefined) => {
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    }

    const handleAddCaseNumberFields = () => {
        setCaseNumbers([...caseNumbers, caseNumbers.length]);
    };    
    
    const handleRemoveCaseNumberFields = () => {
        setCaseNumbers(prevState => prevState.slice(0, -1));
    };

    const handlePLChange = (data: ChangeEvent<HTMLInputElement>) => {
        setValue("professionalLiability.isSelected", data.target.checked,  {shouldValidate: true, shouldDirty: true });
        setPLCheckbox(data.target.checked);

        if (!data.target.checked) {
            const documentTypeIdToRemove = "23";
    
            const updatedFilesDetail = filesDetail.filter(detail => detail.documentTypeId !== documentTypeIdToRemove);
            setFilesDetail(updatedFilesDetail);
        }
    }

    const onSubmit = async () => {
        if (isDirty) {
            try {
                if (!formData) return;

                formData.steps.professionalLiability.status = NavStepperStatus.Completed;
                formData.steps.professionalLiability.data = getValues();
                formData.setup.currentStep = PAGES_NAME.Submit

                const res = await postForm(api, formData.setup.providerId, formData, filesDetail, deletedDocuments);

                if (res?.status === 200) {
                    navigate("/cred/review");
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                if (!formData) return;
                formData.steps.professionalLiability.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.Insurance;
            }
        } else {
            if (formData && formData.steps.professionalLiability.status !== NavStepperStatus.Completed) {
                formData.steps.professionalLiability.status = NavStepperStatus.Completed;
                formData.setup.currentStep = PAGES_NAME.Submit

                postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                    if (res?.status === 200) {
                        navigate("/cred/review");
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });                         
                    }
                    return;
                });
            } else {
                navigate("/cred/review");
                window.scrollTo({
                    top: 0, 
                    behavior: 'smooth'
                });                
            }
        }
    };

    const saveForLater = async () => {
        if (formData) {
            formData.steps.professionalLiability.data = getValues();
            formData.setup.currentStep = PAGES_NAME.Insurance;
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
        navigate("/cred/9");
        return;
    };  
    
    useEffect(() => {
        if (formData && !formData.setup.insuranceApplies) {
            navigate('/form-setup');
            return;
        }
        setDefaultFormValues(insuranceDefaultValues(formData));
    }, [formData]);

    useEffect(() => {
        if (formData) {
            reset(defaultFormValues);
            setPLCheckbox(formData?.steps?.professionalLiability?.data?.professionalLiability?.isSelected);

        }
        setPLCheckbox(
            formData?.steps?.professionalLiability?.data?.professionalLiability?.isSelected
        );
    }, [defaultFormValues, formData, reset]);

    useEffect(() => {
        if (plCheckbox === false) {
            unregister(`professionalLiability.certificateCoverageFile`);
        }
    }, [plCheckbox, unregister]);
    

    if (isLoadingForm && !formData) {
        return <LoadingComponent />
    }

    return (
        <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
                <BackButton label="Back" onClick={goBack} />
                <PageTitle
                    title="Malpractice and Professional Liability Insurance"
                    subtitle="Add your details to finish your profile."
                />
                <label>
                    Required fields are marked with an asterisk{"("}
                    <span className="text-red-error">*</span>
                    {") "}
                </label>
                <div style={{height: "18px"}}></div>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                    <div className=" w-1/2">
                        <p className="font-semibold text-2xl mt-8">Malpractice Insurance Policy</p>

                        <SelectInsuranceName width={width} register={register} errors={errors}
                            name={"malpractice.malpracticeCarrierId"} list={malpracticeList}
                            label="Current Insurance Carrier Name" required
                            value={formData?.steps?.professionalLiability?.data?.malpractice?.malpracticeCarrierId} 
                            setValue={setValue} sectionName="malpractice"
                        />

                        <KDDatePicker 
                            pickerId="malpractice.insurancePolicyEffectiveDate"
                            pickerLabel="Provide the Insurance Policy Effective Date"
                            required={true} errorHandler={errors} register={register} 
                            onHandleChange={handleDateInputChange("malpractice.insurancePolicyEffectiveDate")}
                            value={formData?.steps?.professionalLiability?.data?.malpractice?.insurancePolicyEffectiveDate}                     
                        />

                        <KDDatePicker 
                            pickerId="malpractice.insurancePolicyExpDate"
                            pickerLabel="Provide the Insurance Policy Expiration Date"
                            required={true} errorHandler={errors} register={register}  
                            onHandleChange={handleDateInputChange("malpractice.insurancePolicyExpDate")} 
                            value={formData?.steps?.professionalLiability?.data?.malpractice?.insurancePolicyExpDate}
                            validationType="expiration"               
                        />

                        <TextLimitLength label={"Insurance Policy Number "} register={register} errors={errors} 
                            name={"malpractice.policyNumber"} isRequired={true} width={width} maxLength={25}
                            minLength={1} caption="1-25 characters allowed" 
                        />
                        
                        <DollarInput label={"Coverage Amount per Ocurrence "} width={width}
                            register={register} errors={errors} isRequired={true}
                            name={"malpractice.coverageAmountPerOcurrence"} maxLength={25} 
                            minLength={1} captionBelow="1-25 characters allowed" 
                            caption="Only numbers and 2 decimals (eg. 4765.92)" 
                        />
                        <DollarInput label={"Coverage Aggregate Limit "} width={width}
                            register={register} errors={errors} isRequired={true}
                            name={"malpractice.coverageAggregateLimit"} maxLength={25} 
                            minLength={1} captionBelow="1-25 characters allowed" 
                            caption="Only numbers and 2 decimals (eg. 4765.92)" 
                        />

                        <div style={{height: "18px"}}></div>
                        <CredInputFiles title="Malpractice Insurance Certificate of Coverage and Endorsements" 
                            description="Please attach your Evidence of Coverage as a .pdf document" 
                            fileId="malpractice.certificateCoverageFile.name"
                            required={true} 
                            register={register} errors={errors} setValue={setValue}
                            value={formData?.steps?.professionalLiability?.data?.malpractice?.certificateCoverageFile?.name}
                            onHandleUpdatedFiles={(f) => handleFileSelected(f, "22")}
                            documentTypeId={22}
                            documentName="malpractice.certificateCoverageFile.documentTypeId"
                            onFileNameChange={handleFileNameChange}
                        />

                        <p className="font-semibold text-xl mt-8">Malpractice Case Information</p>
                        <p className="text-gray-50 text-sm ml-2">Case numbers cannot be repeated.</p>
                        {caseNumbers.map((_, index) => (
                            <TextLimitLength key={index}
                                label={`OIG Case Number ${index + 1}`}
                                register={register} errors={errors} 
                                name={`malpractice.oigCaseNumber[${index}]`} 
                                isRequired={false} width={width}
                                minLength={1} maxLength={25}
                                caption="1-25 characters allowed" 
                            />
                        ))}
                        <div className="flex gap-3 items-center mt-3 ml-4">
                            <button type="button" 
                                className="usa-button usa-button--outline h-min"
                                onClick={handleAddCaseNumberFields}
                                >
                                Add Case Number
                            </button>
                            {caseNumbers.length > 1 &&
                            <button type="button" 
                                className="usa-button usa-button--outline h-min"
                                onClick={handleRemoveCaseNumberFields}
                                >
                                Remove Additional
                            </button>
                            }
                        </div>

                        <fieldset>
                            <div className="mt-6">
                                <label>Select if apply to you:</label>
                                <Checkbox 
                                    {...register("professionalLiability.isSelected")}
                                    id={`rb-professional-liability`}
                                    label={<p className="font-semibold text-2xl">Professional Liability Insurance Policy</p>}
                                    name={`professionalLiability.isSelected`}
                                    checked={plCheckbox}
                                    onChange={handlePLChange}
                                    className="mb-2"
                                />
                            </div>
                        </fieldset>

                        {plCheckbox && (<>
                            <SelectInsuranceName width={width} register={register} errors={errors} 
                                name={"professionalLiability.professionalLiabilityCarrierId"} setValue={setValue}
                                label="Current Insurance Carrier Name" required={plCheckbox} list={insuranceName}
                                value={formData?.steps?.professionalLiability?.data?.professionalLiability?.professionalLiabilityCarrierId}
                                sectionName="professionalLiability"
                            />

                            <TextLimitLength label={"Insurance Policy Number "} register={register}
                                errors={errors} isRequired={plCheckbox} width={width}
                                name={"professionalLiability.policyNumber"} maxLength={25}
                                minLength={1} caption="1-25 characters allowed" 
                            />

                            <DollarInput label={"Coverage Amount per Ocurrence "} width={width}
                                register={register} errors={errors} isRequired={plCheckbox}
                                name={"professionalLiability.coverageAmountPerOcurrence"} maxLength={25}
                                minLength={1} captionBelow="1-25 characters allowed" 
                                caption="Only numbers and 2 decimals (eg. 4765.92)" 
                            />
                            <DollarInput label={"Coverage Aggregate Limit "} width={width}
                                register={register} errors={errors} isRequired={plCheckbox}
                                name={"professionalLiability.coverageAggregateLimit"} maxLength={25}
                                minLength={1} captionBelow="1-25 characters allowed" 
                                caption="Only numbers and 2 decimals (eg. 4765.92)" 
                            />

                            <KDDatePicker 
                                pickerId="professionalLiability.insurancePolicyEffectiveDate"
                                pickerLabel="Provide the Insurance Policy Effective Date"
                                required={plCheckbox} errorHandler={errors} register={register} 
                                onHandleChange={handleDateInputChange("professionalLiability.insurancePolicyEffectiveDate")}     
                                value={formData?.steps?.professionalLiability?.data?.professionalLiability?.insurancePolicyEffectiveDate}           
                            />

                            <KDDatePicker 
                                pickerId="professionalLiability.insurancePolicyExpDate"
                                pickerLabel="Provide the Insurance Policy Expiration Date"
                                required={plCheckbox} errorHandler={errors} register={register}  
                                onHandleChange={handleDateInputChange("professionalLiability.insurancePolicyExpDate")} 
                                value={formData?.steps?.professionalLiability?.data?.professionalLiability?.insurancePolicyExpDate} 
                                validationType="expiration"              
                            />

                            <div style={{height: "18px"}}></div>
                            <CredInputFiles title={<b>Professional Liability Insurance Certificate of Coverage</b>} 
                                description="Please attach your Evidence of Coverage as a .pdf document" 
                                fileId="professionalLiability.certificateCoverageFile.name"
                                required={plCheckbox} 
                                register={register} errors={errors} setValue={setValue}
                                value={formData?.steps?.professionalLiability?.data?.professionalLiability?.certificateCoverageFile?.name}
                                onHandleUpdatedFiles={(f) => handleFileSelected(f, "23")}
                                documentTypeId={23}
                                documentName="professionalLiability.certificateCoverageFile.documentTypeId"
                                onFileNameChange={handleFileNameChange}
                            />
                        </>)} 
                    </div>
                    <div className="mt-10"></div>
                    <CredInputFiles title={
                        <div className="flex">
                            <b>Professional Liability Action Explanation Form</b>
                            <p className="text-gray-50 text-sm ml-2">(optional)</p>
                        </div>
                        } 
                        description="Please attach your Explanation form as a .pdf document" 
                        fileId="actionExplanationFormFile.name"
                        required={false} register={register} errors={errors} setValue={setValue}
                        value={formData?.steps?.professionalLiability?.data?.actionExplanationFormFile?.name}
                        onHandleUpdatedFiles={(f) => handleFileSelected(f, "24")}
                        documentTypeId={24} documentName="actionExplanationFormFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}
                    />

                    <div className="flex flex-col w-[50%] mt-12 gap-5">
                        <div>
                            <p className="text-gray-600 text-base mb-2">
                                <b className="text-black">Self-Reported Information:</b> Disclosure of actions, license changes, or any action against 
                                the license under ASSMCA or DEA license during a governmental contract or program. 
                                Investigations or actions under the Professional Liability Policy. Please, refer to the {" "}
                                <a className="cursor-pointer underline text-primary-blue"
                                    href="https://www.asespr.org" target="_blank">
                                    Required Credentials and Documents List Section.
                                </a>
                            </p>
                            <CredInputFiles title="Upload any related document." 
                                description="Please attach your document as a .pdf file" 
                                fileId="link1File.name"
                                required={false} register={register} errors={errors} setValue={setValue}
                                value={formData?.steps?.professionalLiability?.data?.link1File?.name}
                                onHandleUpdatedFiles={(f) => handleFileSelected(f, "25")}
                                documentTypeId={25} documentName="link1File.documentTypeId"
                                onFileNameChange={handleFileNameChange}
                            />
                        </div>
                        <div>
                            <p className="text-gray-600 text-base mb-2">
                                <span className="text-red-error">***</span>
                                <b className="text-black">Professional Service Contract Disclosure:</b> For services over $25,000 for the past 12 months. 
                                Please, attach documentation and project description in the field provided for that purpose, 
                                including Effective and Expiration dates of the contract. Please, refer to the {" "}
                                <a className="cursor-pointer underline text-primary-blue"
                                    href="https://www.asespr.org" target="_blank">
                                    Required Credentials and Documents List Section.
                                </a>
                            </p>
                            <CredInputFiles title="Upload any related document." 
                                description="Please attach your document as a .pdf file" 
                                fileId="link2File.name"
                                required={false} register={register} errors={errors} setValue={setValue}
                                value={formData?.steps?.professionalLiability?.data?.link2File?.name}
                                onHandleUpdatedFiles={(f) => handleFileSelected(f, "26")}
                                documentTypeId={26} documentName="link2File.documentTypeId"
                                onFileNameChange={handleFileNameChange}
                            />
                        </div>
                        <div>
                            <p className="text-gray-600 text-base mb-2">
                                <span className="text-red-error">***</span>
                                <b className="text-black">Management Employees Information:</b> For Medicaid purposes, formularies are 
                                individually provided by the office. Please, refer to the {" "}
                                <a className="cursor-pointer underline text-primary-blue"
                                    href="https://www.asespr.org" target="_blank">
                                    Required Credentials and Documents List Section.
                                </a>
                            </p>
                            <CredInputFiles title="Upload any related document." 
                                description="Please attach your document as a .pdf file" 
                                fileId="link3File.name"
                                required={false} register={register} errors={errors} setValue={setValue}
                                value={formData?.steps?.professionalLiability?.data?.link3File?.name}
                                onHandleUpdatedFiles={(f) => handleFileSelected(f, "27")}
                                documentTypeId={27} documentName="link3File.documentTypeId"
                                onFileNameChange={handleFileNameChange}
                            />
                        </div>
                        <div>
                            <p className="text-gray-600 text-base mb-2">
                                <span className="text-red-error">***</span>
                                <b className="text-black">Business Ownership Participation:</b> Every member with no less than 5% of equity. 
                                Executive Officer, Director, and/or Managing Member of the entity defined by its category. 
                                Please, refer to the {" "}
                                <a className="cursor-pointer underline text-primary-blue"
                                    href="https://www.asespr.org" target="_blank">
                                    Required Credentials and Documents List Section.
                                </a>
                            </p>
                            <CredInputFiles title="Upload any related document." 
                                description="Please attach your document as a .pdf file" 
                                fileId="link4File.name"
                                required={false} register={register} errors={errors} setValue={setValue}
                                value={formData?.steps?.professionalLiability?.data?.link4File?.name}
                                onHandleUpdatedFiles={(f) => handleFileSelected(f, "28")}
                                documentTypeId={28} documentName="link4File.documentTypeId"
                                onFileNameChange={handleFileNameChange}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row my-16 ml-3">
                    <button type="button" className="usa-button usa-button--outline" onClick={saveForLater}>Save for Later</button>
                    <button type="submit" className="usa-button">Next</button>
                </div>  
                </form>  
            </div>
        </>
    )
}

export default ProfessionalLiability;
