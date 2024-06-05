import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { useForm } from "react-hook-form";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import KDDatePicker from "../../../../Application/sharedComponents/KDDatePicker";
import { useNavigate } from "react-router-dom";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import NavStepperStatus from "../Components/NavStepperStatus";
import { useEffect, useState } from "react";
import { postForm } from "../../../../Infraestructure/Services/form.service";
import { CheckNavigateToPass, CheckNavigateToPost, handleKeyDown } from "../../../../Application/utils/helperMethods";
import { criminalRecordDefaultValues } from "../Components/defaultFormValues";
import { CriminalRecordInterface } from "../../../Layouts/formLayout/credInterfaces";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import { Files } from "../../../../Application/interfaces";
import { useAtom } from "jotai";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const CriminalRecord = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

    const [defaultFormValues, setDefaultFormValues] = useState<CriminalRecordInterface | undefined>(undefined);
    const { register, setValue, formState: { errors, isDirty }, reset, handleSubmit, getValues } = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues
    });
    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    const [newFileName, setNewFileName] = useState('');

    const [deletedDocuments] = useAtom(documentToDeleteAtom);

    const handleDateInputChange  = (key: string) => (value: string | undefined) => {
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    }

    const handleFileSelected = (files: File[]) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName !== formData?.steps?.criminalRecord?.data?.negativePenalRecordFile?.name) {
                oldFilename = formData?.steps?.criminalRecord?.data?.negativePenalRecordFile?.name;
            }
            return {
                documentTypeId: "21",
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(newFileDetails);
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };

    const onSubmit = async () => {
        const verifyDetails = filesDetail.map(fileDetail => {
            return {
                ...fileDetail,
                issueDate: getValues().negativePenalRecordIssuedDate,
                expirationDate: getValues().negativePenalRecordExpDate
            };
        });

        if (isDirty) {
            try {
                if (!formData) return; 

                formData.steps.criminalRecord.status = NavStepperStatus.Completed;
                formData.steps.criminalRecord.data = getValues();
                
                CheckNavigateToPost(PAGES_NAME.CriminalRecord, formData, api, navigate, verifyDetails);
            } catch (error) {
                if (!formData) return;
                console.log("Criminal Record post error", error);
            }
        } else {
            if (formData && formData.steps.criminalRecord.status !== NavStepperStatus.Completed) {
                formData.steps.criminalRecord.status = NavStepperStatus.Completed;
                CheckNavigateToPost(PAGES_NAME.CriminalRecord, formData, api, navigate, verifyDetails);
            } else {
                if (formData) {
                    CheckNavigateToPass(PAGES_NAME.CriminalRecord, formData, navigate);          
                }
                window.scrollTo({
                    top: 0, 
                    behavior: 'smooth'
                });                
            }
        }
    };

    const saveForLater = async () => {
        if (formData) {
            formData.steps.criminalRecord.data = getValues();
            formData.setup.currentStep = PAGES_NAME.CriminalRecord;
            let verifyDetails: Files[] = [];

            if (getValues().negativePenalRecordExpDate === "NaN-NaN-NaN") {
                setValue("negativePenalRecordExpDate", "");
            }
            if (getValues().negativePenalRecordIssuedDate === "NaN-NaN-NaN") {
                setValue("negativePenalRecordIssuedDate", "");
            }

            if (filesDetail.length > 0 &&
                (!getValues().negativePenalRecordExpDate || !getValues().negativePenalRecordIssuedDate)) {
                formData.steps.criminalRecord.data.negativePenalRecordExpDate = "";
                formData.steps.criminalRecord.data.negativePenalRecordIssuedDate = "";
                formData.steps.criminalRecord.data.negativePenalRecordFile.name = "";
                formData.steps.criminalRecord.data.negativePenalRecordFile.documentTypeId = "";
                filesDetail.pop();
            } else {
                verifyDetails = filesDetail.map(fileDetail => {
                    return {
                        ...fileDetail,
                        issueDate: getValues().negativePenalRecordIssuedDate,
                        expirationDate: getValues().negativePenalRecordExpDate
                    };
                });
            }

            await postForm(api, formData.setup.providerId, formData, verifyDetails, deletedDocuments).then(res => {
                if (res?.status === 200) {
                    const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
                    role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    const goBack = async () => {
        if (!formData) return;
        navigate('/cred/8');
        return;
    };

    useEffect(() => {
        setDefaultFormValues(criminalRecordDefaultValues(formData));
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
                title="Criminal Record"
                subtitle="Add your details to finish your profile."
            />                    
            <label>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </label>
            <div style={{height: "18px"}}></div>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                <CredInputFiles title="Negative Certificate of Penal Record" 
                    description="Please attach your certificate as a .pdf document" 
                    fileId="negativePenalRecordFile.name"
                    required={true} documentTypeId={21}
                    register={register} errors={errors} setValue={setValue}
                    value={formData?.steps?.criminalRecord?.data?.negativePenalRecordFile?.name}
                    onHandleUpdatedFiles={handleFileSelected}
                    documentName="negativePenalRecordFile.documentTypeId"
                    onFileNameChange={handleFileNameChange}
                />
                <div style={{height: "6px"}}></div>
                <KDDatePicker 
                    pickerId="negativePenalRecordIssuedDate"
                    pickerLabel="Provide the Penal Record Date of Issue"
                    required={true}
                    onHandleChange={handleDateInputChange("negativePenalRecordIssuedDate")}
                    errorHandler={errors} register={register}    
                    value={formData?.steps?.criminalRecord?.data?.negativePenalRecordIssuedDate}   
                    validationType="notFutureDate"             
                />
                <div style={{height: "6px"}}></div>
                <KDDatePicker 
                    pickerId="negativePenalRecordExpDate"
                    pickerLabel="Provide the Penal Record Date of Expiration"
                    required={true}
                    onHandleChange={handleDateInputChange("negativePenalRecordExpDate")}
                    errorHandler={errors} register={register}     
                    value={formData?.steps?.criminalRecord?.data?.negativePenalRecordExpDate}
                    validationType="expiration"
                />
        
                <div className="flex flex-row my-16 ml-3">
                    <button type="button" className="usa-button usa-button--outline"
                        onClick={saveForLater}>Save for Later</button>
                    <button type="submit" className="usa-button">Next</button>
                </div>                
            </form>
        </div>
    </>
}

export default CriminalRecord;
