import { Checkbox, Radio } from "@trussworks/react-uswds";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { FormProvider, useForm } from "react-hook-form";
import layoutImages from "../../../../Application/images/images";
import { useState, ChangeEvent, useEffect } from "react";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import { ErrorMessage } from "@hookform/error-message";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { useNavigate } from "react-router-dom";
import NavStepperStatus from "../Components/NavStepperStatus";
import SSNInput from "../Components/SSNInput";
import SelectTypeId from "./Components/SelectTypeId";
import Tooltip from "../../../../Application/sharedComponents/Tooltip";
import IdentificationFields from "./Components/IdentificationFields";
import { individualDefaultValues } from "../Components/defaultFormValues";
import SkeletonLoader from "../../../../Application/sharedComponents/SkeletonLoader";
import { IndividualInterface } from "../../../Layouts/formLayout/credInterfaces";
import { getValidationNPI, postForm } from "../../../../Infraestructure/Services/form.service";
import { Files, PlanAcceptanceInterface } from "../../../../Application/interfaces";
import { getPlanAcceptanceList } from "../../../../Infraestructure/Services/dropdowns.service";
import PlanAcceptanceList from "../Components/PlanAcceptanceList";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import TextLimitLength from "../../../../Application/sharedComponents/InputText/TextLimitLength";
import TaxIdInput from "../../../../Application/sharedComponents/InputText/TaxIdInput";
import { useAtom } from "jotai";
import { useDocumentInputStore } from "../../../../Infraestructure/Store/documentStore";
import { useQuery } from "@tanstack/react-query";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";
import { NpiInput } from "../../../../Application/sharedComponents/InputText/NpiInput";
import { handleKeyDown } from "../../../../Application/utils/helperMethods";

const IndividualPage = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();

    const { data: formData, isLoading: formLoading } = useGetForm(api);

    const { data: planList } = useQuery<PlanAcceptanceInterface[]>({
        queryKey: ["planList"],
        queryFn: () => getPlanAcceptanceList(api)
    })

    const [defaultFormValues, setDefaultFormValues] = useState<IndividualInterface | undefined>(undefined);

    const [legalPermissionToWork, setLegalPermissionToWork] = useState(formData?.steps?.individualPracticeProfile?.data?.citizenshipTypeId);
    const [isPassportForeign, setPassportForeign] = useState(formData?.steps?.individualPracticeProfile?.data?.isPassportForeign);

    const methods = useForm<ExtendedFieldValues>({
        defaultValues: defaultFormValues,
    });
    const {
        formState: { errors, isDirty },
        handleSubmit,
        register,
        setValue,
        getValues,
        setError,
        reset,
        unregister
    } = methods;

    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    const [newFileName, setNewFileName] = useState('');
    const [deletedDocuments] = useAtom(documentToDeleteAtom);
    const findByName = useDocumentInputStore(state => state.findByPathName);

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            const idType = ["4", "5", "6", "7", "8", "9"]
            if (idType.includes(documentTypeId) && newFileName !== formData?.steps?.individualPracticeProfile?.data?.idFile?.name) {
                oldFilename = formData?.steps?.individualPracticeProfile?.data?.idFile?.name;
            }
            if (documentTypeId === "1" && newFileName !== formData?.steps?.individualPracticeProfile?.data?.npiCertificateFile?.name) {
                oldFilename = formData?.steps?.individualPracticeProfile?.data?.npiCertificateFile?.name;
            }
            if (documentTypeId === "3" && newFileName !== formData?.steps?.individualPracticeProfile?.data?.curriculumVitaeFile?.name) {
                oldFilename = formData?.steps?.individualPracticeProfile?.data?.curriculumVitaeFile?.name;
            }
            if (documentTypeId === "37" && newFileName !== formData?.steps?.individualPracticeProfile?.data?.immigrantDocumentFile?.name) {
                oldFilename = formData?.steps?.individualPracticeProfile?.data?.immigrantDocumentFile?.name;
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
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };

    const handleOptionForLegalPermissionToWork = (key: string) => async (data: ChangeEvent<HTMLInputElement>) => {
        setLegalPermissionToWork(data.target.value);
        setValue(key, data.target.value, { shouldValidate: true, shouldDirty: true });

        const documentTypesToRemove = data.target.value === "2" ? ["4", "5", "6", "7", "8"] : ["9"];

        setFilesDetail((prevDetails) => {
            const updatedDetails = prevDetails.filter((detail) => !documentTypesToRemove.includes(detail.documentTypeId));
            return updatedDetails;
        });

        if (data.target.value === "2") {
            setValue("idType", "9", { shouldValidate: true, shouldDirty: true });

            const selectedIdType = {
                name: `idFile.name`,
                documentIdType: `idFile.documentTypeId`
            }
            let uploadFilename = getValues(selectedIdType.name) as string;
            let documentTypeId = getValues(selectedIdType.documentIdType) as number;
    
            if (uploadFilename && documentTypeId) {
                if (findByName(selectedIdType.name)?.documentExist) {
                    deletedDocuments.push({uploadFilename, documentTypeId});
                } else {
                    uploadFilename = formData?.steps?.individualPracticeProfile?.data?.idFile?.name as string;
                    documentTypeId = parseInt(formData?.steps?.individualPracticeProfile?.data?.idFile?.documentTypeId ?? '');
                    deletedDocuments.push({uploadFilename, documentTypeId}); 
                    filesDetail.pop();  
                }
            }

            unregister("idFile.documentTypeId");
            unregister("idFile.name");
            unregister("idExpDate");
            register("idFile.documentTypeId", { required: "This field is required." });
            register("idFile.name", { required: "This field is required." });
            register("idExpDate", { required: "This field is required." });

            if (findByName(selectedIdType.documentIdType)?.documentExist) {
                if (formData) {
                    formData.steps.individualPracticeProfile.data = getValues();
                    formData.setup.currentStep = PAGES_NAME.Individual;

                    await postForm(
                        api, formData?.setup.providerId,
                        formData, [], deletedDocuments
                    )
                }
            }
        } else {
            setValue("isPassportForeign", false, { shouldValidate: true, shouldDirty: true });
            setPassportForeign(false);

            const selectedForeignerNational = {
                name: `idFile.name`,
                documentIdType: `idFile.documentTypeId`
            }
            const selectedImmigrant = {
                name: `immigrantDocumentFile.name`,
                documentIdType: `immigrantDocumentFile.documentTypeId`
            }

            if (getValues(selectedForeignerNational.name) && getValues(selectedForeignerNational.documentIdType)) {
                let uploadFilename = getValues(selectedForeignerNational.name) as string;
                let documentTypeId = getValues(selectedForeignerNational.documentIdType) as number;
                if (findByName(selectedForeignerNational.name)?.documentExist) {
                    deletedDocuments.push({uploadFilename, documentTypeId});
                } else {
                    uploadFilename = formData?.steps?.individualPracticeProfile?.data?.idFile?.name as string;
                    documentTypeId = parseInt(formData?.steps?.individualPracticeProfile?.data?.idFile?.documentTypeId ?? '');
                    deletedDocuments.push({uploadFilename, documentTypeId}); 
                    filesDetail.pop();  
                }
            }

            if (getValues(selectedImmigrant.name) && getValues(selectedImmigrant.documentIdType)) {
                let uploadFilename = getValues(selectedImmigrant.name) as string;
                let documentTypeId = getValues(selectedImmigrant.documentIdType) as number;
                if (findByName(selectedImmigrant.name)?.documentExist) {
                    deletedDocuments.push({uploadFilename, documentTypeId});
                } else {
                    uploadFilename = formData?.steps?.individualPracticeProfile?.data?.immigrantDocumentFile?.name as string;
                    documentTypeId = parseInt(formData?.steps?.individualPracticeProfile?.data?.immigrantDocumentFile?.documentTypeId ?? '');
                    deletedDocuments.push({uploadFilename, documentTypeId}); 
                    filesDetail.pop();  
                }
            }

            unregister("idType");
            unregister("idFile.documentTypeId");
            unregister("idFile.name");
            unregister("idExpDate");
            register("idType", { required: "This field is required." });
            register("idFile.documentTypeId", { required: "This field is required." });
            register("idFile.name", { required: "This field is required." });
            register("idExpDate", { required: "This field is required." });
            unregister('immigrantDocumentFile.name');
            unregister('immigrantDocumentFile.documentTypeId');

            if (deletedDocuments.length > 0 && (
                findByName(selectedImmigrant.documentIdType)?.documentExist || 
                findByName(selectedForeignerNational.documentIdType)?.documentExist)) {
                if (formData) {
                    formData.steps.individualPracticeProfile.data = getValues();
                    formData.setup.currentStep = PAGES_NAME.Individual;

                    await postForm(
                        api, formData.setup.providerId,
                        formData, [], deletedDocuments
                    )                        
                }
            }
        }
    }

    const handleIsPassportForeign = (key: string) => async (data: any) => {
        if (!data.target.checked) {
            setPassportForeign(data.target.checked);

            const updatedFilesDetail = filesDetail.filter(file => file.documentTypeId !== "37");
            setFilesDetail(updatedFilesDetail);

            setValue(key, data.target.checked, { shouldValidate: true, shouldDirty: true });

            const selectedIdType = {
                name: `immigrantDocumentFile.name`,
                documentIdType: `immigrantDocumentFile.documentTypeId`
            }
            const uploadFilename = getValues(selectedIdType.name) as string
            const documentTypeId = getValues(selectedIdType.documentIdType) as number;

            unregister('immigrantDocumentFile.name');
            unregister('immigrantDocumentFile.documentTypeId');

            if (formData?.steps && findByName(selectedIdType.documentIdType)?.documentExist) {
                formData.steps.individualPracticeProfile.data = getValues();
                formData.setup.currentStep = PAGES_NAME.Individual;

                await postForm(
                    api, formData.setup.providerId,
                    formData, [], [{ uploadFilename, documentTypeId }]
                )
            }
        } else {
            setPassportForeign(data.target.checked);
            setValue(key, data.target.checked, { shouldValidate: true, shouldDirty: true });
        }
    }

    const handleDateInputChange = (key: string) => (value: string | undefined) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true });
    }

    const onSubmit = async () => {

        const npiValue = getValues("npiCertificateNumber");
        const isValidNpi = await getValidationNPI(api, npiValue);
        if (!isValidNpi) {
            setError("npiCertificateNumber", {
                type: "manual",
                message: "Invalid NPI"
            })
            return;
        }

        if (isDirty) {
            try {
                if (!formData) return;

                const updatedDetails = filesDetail.map(fileDetail => {
                    const idType = ["4", "5", "6", "7", "8", "9"];
                    if (idType.includes(fileDetail.documentTypeId)) {
                        return {
                            ...fileDetail,
                            expirationDate: getValues().idExpDate
                        };
                    }
                    if (fileDetail.documentTypeId === "1") {
                        return {
                            ...fileDetail,
                            npi: getValues().npiCertificateNumber,
                        };
                    }
                    return fileDetail;
                });

                formData.steps.individualPracticeProfile.status = NavStepperStatus.Completed;
                formData.steps.individualPracticeProfile.data = getValues();
                formData.setup.currentStep = PAGES_NAME.Addresses;

                await postForm(api, formData.setup.providerId, formData, updatedDetails, deletedDocuments).then(res => {
                    if (res?.status === 200) {
                        navigate('/cred/2');
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                });

            } catch (error) {
                if (!formData) return;
                formData.steps.individualPracticeProfile.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.Individual;
            }
        } else {
            if (formData?.steps && formData.steps.individualPracticeProfile.status !== NavStepperStatus.Completed) {
                formData.steps.individualPracticeProfile.status = NavStepperStatus.Completed;
                formData.setup.currentStep = PAGES_NAME.Addresses;
                await postForm(api, formData.setup.providerId, formData, []).then(res => {
                    if (res?.status === 200) {
                        navigate("/cred/2");
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                });
            } else {
                navigate("/cred/2");
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    };

    const saveForLater = async () => {
        if (formData?.steps) {
            formData.steps.individualPracticeProfile.data = getValues();
            formData.setup.currentStep = PAGES_NAME.Individual;

            const selectedNpi = {
                name: `npiCertificateFile.name`,
                documentIdType: `npiCertificateFile.documentTypeId`
            }

            const ids = ["4", "5", "6", "7", "8", "9"];
            const validFiles = filesDetail.filter((file) => {
                if (formData.steps.individualPracticeProfile.data) {
                    if (getValues().idExpDate === "NaN-NaN-NaN") {
                        setValue("idExpDate", "");
                    }
                    if (ids.includes(file.documentTypeId.toString()) && !getValues().idExpDate &&
                        formData.steps.individualPracticeProfile.data.idFile?.name) {
                        formData.steps.individualPracticeProfile.data.idExpDate = "";
                        formData.steps.individualPracticeProfile.data.idFile.name = "";
                        formData.steps.individualPracticeProfile.data.idFile.documentTypeId = "";
                        return false;
                    }
                    if (file.documentTypeId == "1" && !getValues().npiCertificateNumber && !findByName(selectedNpi.documentIdType)?.documentExist) {
                        formData.steps.individualPracticeProfile.data.npiCertificateNumber = "";
                        formData.steps.individualPracticeProfile.data.npiCertificateFile.name = "";
                        formData.steps.individualPracticeProfile.data.npiCertificateFile.documentTypeId = "";
                        return false;
                    } else {
                        return true;
                    }
                }
            })

            const updatedDetails = validFiles.map(fileDetail => {
                const idType = ["4", "5", "6", "7", "8", "9"];
                if (idType.includes(fileDetail.documentTypeId.toString())) {
                    return {
                        ...fileDetail,
                        expirationDate: getValues().idExpDate
                    };
                }

                if (fileDetail.documentTypeId === "1") {
                    return {
                        ...fileDetail,
                        npi: getValues().npiCertificateNumber,
                    };
                }
                return fileDetail;
            });
            
            await postForm(api, formData.setup.providerId, formData, updatedDetails, deletedDocuments).then(res => {
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

    const goBack = () => {
        if (!formData) return;
        navigate("/form-setup");
        return;
    };

    useEffect(() => {
        setDefaultFormValues(individualDefaultValues(formData));
        setLegalPermissionToWork(formData?.steps?.individualPracticeProfile?.data?.citizenshipTypeId);
        setPassportForeign(formData?.steps?.individualPracticeProfile?.data?.isPassportForeign);
    }, [formData])

    useEffect(() => {
        if (formData) {
            reset(defaultFormValues);
        }
    }, [defaultFormValues, formData, reset]);

    useEffect(() => {
        if (planList) {
            setValue("planAccept", planList?.map(option => option.id) || [], { shouldValidate: true, shouldDirty: true });
        }
    }, [planList, setValue])

    if (formLoading && !formData) {
        return <LoadingComponent />
    }

    return <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack} />
            <div>
                <PageTitle title="Your Practice Profile" subtitle="Add your details to finish your practice profile." displayLogo={false} />
                <div style={{ height: "24px" }}></div>
                <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
                    <div className=" w-5/12">
                        <h3 className="font-black mb-2">1. Add Additional Information</h3>

                        {/** Present Option to select the type of permission the user has to work in PR */}
                        <fieldset>
                            <div className={errors["citizenshipTypeId"] && "usa-form-group usa-form-group--error"}>
                                <legend>Are you Foreigner, or a Citizen born in PR or USA ?{" "}
                                    <span className="text-red-error">*</span>
                                </legend>
                                <ErrorMessage
                                    errors={errors} name={"citizenshipTypeId"}
                                    render={({ message }) => (
                                        <p className="font-bold text-red-error mt-1 -mb-1" role="alert">
                                            {message}
                                        </p>
                                    )}
                                />
                                <Radio id="rb-citizen"
                                    {...register("citizenshipTypeId", {
                                        required: "You must select one."
                                    })}
                                    name="citizenshipTypeId"
                                    label="Citizen born in the United States or in Puerto Rico"
                                    value={"1"}
                                    checked={legalPermissionToWork === "1"}
                                    onChange={handleOptionForLegalPermissionToWork("citizenshipTypeId")}
                                />
                                <Radio id="rb-foreigner"
                                    name="citizenshipTypeId"
                                    label="Foreigner National"
                                    value={"2"}
                                    checked={legalPermissionToWork === "2"}
                                    onChange={handleOptionForLegalPermissionToWork("citizenshipTypeId")}
                                />
                                <div style={{ height: "12px" }}></div>
                            </div>
                        </fieldset>

                        {legalPermissionToWork === "2" &&
                            <fieldset>
                                <SSNInput register={register} errors={errors} name={"ssn"}
                                    label={"Social Security Number "} setValue={setValue}
                                    value={formData?.steps?.individualPracticeProfile?.data?.ssn}
                                />

                                <IdentificationFields
                                    register={register} errors={errors}
                                    fileLabel={"Passport"}
                                    fileId={"idFile.name"}
                                    dateId={"idExpDate"}
                                    dateLabel={"Passport Expiration Date"} setValue={setValue}
                                    required={legalPermissionToWork === "2"}
                                    onDateChange={handleDateInputChange("idExpDate")}
                                    dateValue={formData?.steps?.individualPracticeProfile?.data?.idExpDate}
                                    fileValue={formData?.steps?.individualPracticeProfile?.data?.idFile?.name}
                                    onHandleUpdatedFiles={(f) => handleFileSelected(f, "9")}
                                    documentTypeId={9}
                                    documentName="idFile.documentTypeId"
                                    onFileNameChange={handleFileNameChange}
                                />

                                <Checkbox id="isPassportForeign"
                                    label="Foreign Passport"
                                    name="isPassportForeign"
                                    onChange={handleIsPassportForeign("isPassportForeign")}
                                    checked={isPassportForeign}
                                />

                                {isPassportForeign &&
                                    <div className="ml-10 mt-1">
                                        <CredInputFiles title="Immigrant Document"
                                            description="Please attach either one of: Citizenship Certificate (N560), Certificate of Naturalization (N550),
                                    Residence for Foreigner Card (INS I-688), Temporary Residence for Foreigner Card (INS I-6888),
                                    Authorization for Employment Card (I-766)"
                                            fileId="immigrantDocumentFile.name" documentTypeId={37}
                                            required={isPassportForeign}
                                            register={register} errors={errors} setValue={setValue}
                                            value={formData?.steps?.individualPracticeProfile?.data?.immigrantDocumentFile?.name}
                                            onHandleUpdatedFiles={(f) => handleFileSelected(f, "37")}
                                            documentName="immigrantDocumentFile.documentTypeId"
                                            onFileNameChange={handleFileNameChange}
                                        />
                                    </div>

                                }

                            </fieldset>}

                        {legalPermissionToWork === "1" &&
                            <div id="born-in-puerto-rico-container">
                                <SSNInput register={register} errors={errors} name={"ssn"}
                                    label={"Social Security Number "} setValue={setValue}
                                    value={formData?.steps?.individualPracticeProfile?.data?.ssn}
                                />

                                <SelectTypeId register={register} errors={errors} setValue={setValue}
                                    legalPermissionToWork={legalPermissionToWork}
                                    idTypeValue={formData?.steps?.individualPracticeProfile?.data?.idType}
                                    dateExp={formData?.steps?.individualPracticeProfile?.data?.idExpDate}
                                    fileValue={formData?.steps?.individualPracticeProfile?.data?.idFile?.name}
                                    onHandleUpdatedFiles={(f, docId) => handleFileSelected(f, docId)}
                                    setNewFileName={setNewFileName} unregister={unregister} getValues={getValues}
                                    deletedDocuments={deletedDocuments} filesDetail={filesDetail}
                                />
                            </div>
                        }
                        <TaxIdInput register={register}
                            label={"Individual Tax ID "} errors={errors}
                            name={"taxId"} setValue={setValue}
                            value={formData?.steps?.individualPracticeProfile?.data?.taxId}
                        />

                        <TextLimitLength register={register}
                            label={"Puerto Rico Medical License Number "} errors={errors} isRequired
                            name={"prMedicalLicenseNumber"} minLength={5} maxLength={15} caption="5-15 characters allowed"
                            defaultValue={formData?.steps?.individualPracticeProfile?.data?.prMedicalLicenseNumber}
                        />

                        <h3 className="font-black mt-8">2. Upload Files</h3>
                        <div style={{ paddingLeft: "30rem", marginTop: "-24px" }}>
                            <Tooltip
                                label="NPI Certificate is your evidence with the National Provider Identification Number."
                                img={layoutImages.iconHelp} alt="Hint"
                            />
                        </div>

                        <CredInputFiles title="NPI Certificate"
                            description="Please attach your certificate as a .pdf document"
                            fileId="npiCertificateFile.name" documentName="npiCertificateFile.documentTypeId"
                            required={true} documentTypeId={1}
                            register={register} errors={errors} setValue={setValue}
                            value={formData?.steps?.individualPracticeProfile?.data?.npiCertificateFile?.name}
                            onHandleUpdatedFiles={(f) => handleFileSelected(f, "1")}
                            onFileNameChange={handleFileNameChange}
                        />

                        <NpiInput 
                            isRequired
                            name="npiCertificateNumber"
                            label="Enter the NPI of the attached Certificate"
                            caption="10 characters allowed"
                            captionBelow=""
                        />

                        <div style={{ height: "16px" }}></div>
                        <CredInputFiles title="Curriculum Vitae"
                            description="Please attach your Curriculum Vitae as a .pdf document"
                            fileId="curriculumVitaeFile.name"
                            required={true} documentTypeId={3}
                            register={register} errors={errors} setValue={setValue}
                            value={formData?.steps?.individualPracticeProfile?.data?.curriculumVitaeFile?.name}
                            onHandleUpdatedFiles={(f) => handleFileSelected(f, "3")}
                            documentName="curriculumVitaeFile.documentTypeId"
                            onFileNameChange={handleFileNameChange}
                        />

                        <PlanAcceptanceList register={register} name={"planAccept"} 
                            errors={errors} list={planList} setValue={setValue}
                        />

                        <div className="flex flex-row mb-16 mt-10 ml-3">
                            <button type="button"
                                className="usa-button usa-button--outline"
                                onClick={saveForLater}
                            >
                                Save for Later
                            </button>
                            <button type="submit" className="usa-button">Next</button>
                        </div>
                    </div>
                    <div className="h-36"></div>
                </form>
                </FormProvider>
            </div>
        </div>
    </>
}

export const LoadingComponent = () => {
    return (
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <SkeletonLoader />
        </div>
    )
}

export default IndividualPage;
