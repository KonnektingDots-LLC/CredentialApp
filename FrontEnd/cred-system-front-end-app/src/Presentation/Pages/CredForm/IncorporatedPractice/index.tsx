import Collaspsible from "../../../../Application/sharedComponents/Collaspsible";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { AccordionItemProps } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import IncorporatedFields from "./Components/IncorporatedFields";
import NavStepperStatus from "../Components/NavStepperStatus";
import { FileToDelete, getValidationNPI, postForm } from "../../../../Infraestructure/Services/form.service";
import { CheckNavigateToPost, mergeDeleteLists, prepareDeleteFiles } from "../../../../Application/utils/helperMethods";
import { incorporatedDefaultValues } from "../Components/defaultFormValues";
import { getSpecialtyList } from "../../../../Infraestructure/Services/dropdowns.service";
import { Files, Specialty } from "../../../../Application/interfaces";
import { IncorporatedPracticeProfile } from "../../../Layouts/formLayout/credInterfaces";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import IncorporateModal from "../../../../Application/modals/IncorporateModal";
import { useDocumentInputStore } from "../../../../Infraestructure/Store/documentStore";
import { useAtom } from "jotai";
import { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useQuery } from "@tanstack/react-query";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const IncorporatedPractice = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

    const { data: specialtyList } = useQuery<Specialty[]>({
        queryKey: ["specialtyList"],
        queryFn: () => getSpecialtyList(api, 1)
    })

    const [isIncorporateModalOpen, setIncorporateModalOpen] = useState(false);

    const [defaultFormValues, setDefaultFormValues] = useState<IncorporatedPracticeProfile | undefined>(undefined);

    const methods = useForm({ mode: "onChange", defaultValues: defaultFormValues});

    const [incorporatedPractice, setIncorporatedPractice] = useState<AccordionItemProps[]>([]);
    const [filesDetail, setFilesDetail] = useState<Files[]>([]);
    // const { value: filesDetail, push: setFilesDetail, remove: removeFileDetail } = useArray<Files>([]);

    const [filesToDelete, setFilesToDelete] = useState<FileToDelete[] | undefined>()
    const [deletedDocuments] = useAtom(documentToDeleteAtom);

    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    // render incorporated form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addIncorporatedForm = (() => {
        const currentIndex = incorporatedPractice.length;
        const form: AccordionItemProps = {
            id: `form-id-incorporated-${currentIndex}`,
            title: currentIndex === 0 ? "Incorporated Practice Profile " : "Additional Incorporated Practices Profile " + (currentIndex),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <IncorporatedFields formData={formData?.steps.incorporatedPracticeProfile.data}
                        idNum={currentIndex} key={currentIndex}
                        specialtyList={specialtyList} api={api}
                        setFilesDetail={setFilesDetail}
                    />
                </div>  
            ),
        };
        return form;
    });

    const handleAddAnotherIncorporatedFields = () => {
        const tempIncorporatedPractices = [...incorporatedPractice];
        tempIncorporatedPractices.push(addIncorporatedForm());

        setIncorporatedPractice(tempIncorporatedPractices);
    }

    const handleRemoveIncorporatedFields = () => {
        const lastIndex = incorporatedPractice.length - 1;

        const filePaths = [
            `values[${lastIndex}].corporationCertificateFile.documentTypeId`,
            `values[${lastIndex}].corporateNpiCertificateFile.documentTypeId`,
            `values[${lastIndex}].w9File.documentTypeId`,
        ]

        const files = prepareDeleteFiles(filePaths, findByPathName)
        setIncorporatedPractice(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.values) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.values.pop();
        }
        methods.reset(currentValues);
    };

    const unregisterAllFields = () => {
        const currentValues = methods.getValues();
        const fieldNames = Object.keys(currentValues);
        methods.unregister(fieldNames as any);
    }    

    const onNext = async () => {
        
        const isValidFrontEnd = await methods.trigger();
        let allValid = isValidFrontEnd;
        
        const values = methods.getValues().values;
        for (let index = 0; index < values.length; index++) {
            const value = values[index];

            // if publicId is missing and add it
            if (!value.publicId && formData?.steps) {
                const count = formData.steps.incorporatedPracticeProfile.count += 1
                value.publicId = count.toString();
            }
    
            const corporationNpi = value.corporationNpiNumber ?? "";
            const renderingnNpi = value.renderingNpiNumber ?? "";
    
            const isValidCorporationNpi = await getValidationNPI(api, corporationNpi);
            const isValidRenderingNpi = await getValidationNPI(api, renderingnNpi);
    
            if (!isValidCorporationNpi) {
                methods.setError(`values[${index}].corporationNpiNumber` as any, {
                    type: "manual",
                    message: "Invalid NPI"
                });
                allValid = false;
            }
    
            if (!isValidRenderingNpi) {
                methods.setError(`values[${index}].renderingNpiNumber` as any, {
                    type: "manual",
                    message: "Invalid NPI"
                });
                allValid = false; 
            }
        }

        if (allValid) {
            try {
                if (!formData) return;

                formData.steps.incorporatedPracticeProfile.status = NavStepperStatus.Completed;
                formData.steps.incorporatedPracticeProfile.data = methods.getValues() as any;

                const filteredFiles = [...filesDetail].filter(file => file !== undefined);
                CheckNavigateToPost(PAGES_NAME.Incorporated, formData, api, navigate, filteredFiles, mergeDeleteLists(filesToDelete, deletedDocuments));

            } catch (error) {
                if (!formData) return;
                formData.steps.incorporatedPracticeProfile.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.Incorporated;
            }
        }
    };

    const saveForLater = async () => {
        if (formData?.steps) {
            formData.steps.incorporatedPracticeProfile.data = methods.getValues();
            formData.setup.currentStep = PAGES_NAME.Incorporated;

            if (!Array.isArray(formData?.steps?.incorporatedPracticeProfile?.data?.values)) {
                incorporatedPractice.push(addIncorporatedForm());
            }
            const filteredFiles = [...filesDetail].filter(file => file !== undefined);
            const response = await postForm(api, formData.setup.providerId, formData, filteredFiles, mergeDeleteLists(filesToDelete, deletedDocuments));
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

    const onSkip = () => {
        setIncorporateModalOpen(true);
        // CheckNavigateToPass(PAGES_NAME.Incorporated, formData, navigate);
    }

    const goBack = async () => {
        if (!formData) return;
        navigate("/cred/3");
        return;
    };

    useEffect(() => {
        setDefaultFormValues(incorporatedDefaultValues(formData));

        if (formData) {
            if (Array.isArray(formData?.steps?.incorporatedPracticeProfile?.data?.values)) {
                formData?.steps?.incorporatedPracticeProfile?.data?.values?.forEach((_: any, index: number) => {
                    if (!incorporatedPractice[index]?.id) {
                        incorporatedPractice.push(addIncorporatedForm())
                    }
                })
            } else {
                incorporatedPractice.push(addIncorporatedForm())
            }
        }
    }, [formData]);

    useEffect(() => {
        if (formData) {
            methods.reset(defaultFormValues);
        }
    }, [defaultFormValues, formData, methods]);

    if (isLoadingForm && !formData) {
        return <LoadingComponent />
    }

    return <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack} />
            <PageTitle
                title="Incorporated Practice Profile"
                subtitle="Add your details to finish your practice profile."
            />
                <FormProvider {...methods}>
                    <Collaspsible accordionItems={incorporatedPractice}/>
                    <div className="flex gap-28">
                        <button type="button" 
                            className="usa-button usa-button--outline mt-10"
                            onClick={handleAddAnotherIncorporatedFields}
                            >
                            Add Incorporated Practice Profile
                        </button>
                        {incorporatedPractice.length > 1 &&
                            <button type="button" 
                                className="usa-button usa-button--outline mt-10"
                                onClick={handleRemoveIncorporatedFields}
                                >
                                Remove Additional
                            </button>
                        }
                    </div>
                </FormProvider>
                <div className="my-16">
                    <div className="flex flex-row md:flex-row flex-wrap justify-between">
                        <div className="flex flex-col md:flex-row">
                            <button type="button" 
                                className="usa-button usa-button--outline mb-2 md:mb-0 md:mr-2"
                                onClick={saveForLater}
                            >Save for Later</button>
                            <button type="submit" className="usa-button md:ml-2" onClick={onNext}>Next</button>
                        </div>
                        <button type="button" className="usa-button usa-button--outline" style={{marginRight: "50%"}} onClick={onSkip}>Skip</button>
                    </div>
                </div>
        </div>
        {isIncorporateModalOpen && (
        <IncorporateModal 
            closeModal={() => setIncorporateModalOpen(false)}
            onConfirm={() => {
                const filesToSkip = []

                for (let i = 0; i < incorporatedPractice.length; ++i) {
                    const filePaths = [
                        `values[${i}].corporationCertificateFile.documentTypeId`,
                        `values[${i}].corporateNpiCertificateFile.documentTypeId`,
                        `values[${i}].w9File.documentTypeId`,
                    ]
                    filesToSkip.push(prepareDeleteFiles(filePaths, findByPathName))
                }

                unregisterAllFields();
                if (formData?.steps) {
                    formData.steps.incorporatedPracticeProfile.status = NavStepperStatus.Inactive;
                    formData.steps.incorporatedPracticeProfile.data = undefined;
                    CheckNavigateToPost(PAGES_NAME.Incorporated, formData, api, navigate, [], mergeDeleteLists(filesToSkip.flat(), deletedDocuments));
                }
            }}
        />
    )}
    </>
}

export default IncorporatedPractice;
