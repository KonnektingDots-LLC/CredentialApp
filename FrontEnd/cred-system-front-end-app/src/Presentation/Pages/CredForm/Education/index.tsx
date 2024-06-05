import Collaspsible from "../../../../Application/sharedComponents/Collaspsible";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { AccordionItemProps } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MedicalSchoolFields from "./Components/MedicalSchoolFields";
import InternshipFields from "./Components/InternshipFields";
import ResidencyFields from "./Components/ResidencyFields";
import FellowshipFields from "./Components/FellowshipFields";
import NavStepperStatus from "../Components/NavStepperStatus";
import LicensesAndCertificates from "./Components/LicensesAndCertificates";
import { FileToDelete, postForm } from "../../../../Infraestructure/Services/form.service";
import BoardCertificatesInput from "./Components/BoardCertificatesInput";
import { CheckNavigateToBack, formatError, mergeDeleteLists, prepareDeleteFiles } from "../../../../Application/utils/helperMethods";
import { educationDefaultValues } from "../Components/defaultFormValues";
import { EducationAndTraining, Fellowship, Form, Internship, Residency, boardCertificates } from "../../../Layouts/formLayout/credInterfaces";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import { Country, Files, State } from "../../../../Application/interfaces";
import { useDocumentInputStore } from "../../../../Infraestructure/Store/documentStore";
import { useAtom } from "jotai";
import { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";
import { getCountries, getStates } from "../../../../Infraestructure/Services/dropdowns.service";
import { useQuery } from "@tanstack/react-query";

const Education = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);

    const [defaultFormValues, setDefaultFormValues] = useState<EducationAndTraining | undefined>(undefined);

    const methods = useForm({ mode: "onChange", defaultValues: defaultFormValues});

    const [medicalSchool, setMedicalSchool] = useState<AccordionItemProps[]>([]);
    const [internship, setInternship] = useState<AccordionItemProps[]>([]);
    const [residency, setResidency] = useState<AccordionItemProps[]>([]);
    const [fellowship, setFellowship] = useState<AccordionItemProps[]>([]);
    const [boardCertificates, setBoardCertificates] = useState<AccordionItemProps[]>([]);
    const [errorTags, setErrorTags] = useState<(string | undefined)[]>([]);
    const [internshipAlert, setInternshipAlert] = useState(false);
    const [residencyAlert, setResidencyAlert] = useState(false);
    const [fellowshipAlert, setFellowshipAlert] = useState(false);
    const [boardAlert, setBoardAlert] = useState(false);
    const [medSchoolFiles, setMedSchoolFiles] = useState<Files[]>([]);
    const [internshipFiles, setInternshipFiles] = useState<Files[]>([]);
    const [residencyFiles, setResidencyFiles] = useState<Files[]>([]);
    const [fellowshipFiles, setFellowshipFiles] = useState<Files[]>([]);
    const [boardFiles, setBoardFiles] = useState<Files[]>([]);
    const [licensesFiles, setLicensesFiles] = useState<Files[]>([]);

    const [filesToDelete, setFilesToDelete] = useState<FileToDelete[] | undefined>()
    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    const [deletedDocuments] = useAtom(documentToDeleteAtom);

    // NOTE: following useQueries make initial calls for country and states dropdowns data
    useQuery<Country[]>({
        queryKey: ["countries"],
        queryFn: () => getCountries(api),
    });

    useQuery<State[]>({
        queryKey: ["states"],
        queryFn: () => getStates(api),
    });

    // render medical school form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addMedicalSchoolForm = (() => {
        const form: AccordionItemProps = {
            id: `form-id-medicalShool-${medicalSchool.length+1}`,
            title: (<>Medical School <>{medicalSchool.length+1}</> {medicalSchool.length < 1 && <span className="text-red-error">*</span>}</>),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <MedicalSchoolFields idNum={medicalSchool.length}
                        formData={formData} api={api}
                        setFilesDetail={setMedSchoolFiles}
                    />
                </div>
            ),
        };

        return form;
    });
    // render internship form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addInternshipForm = (() => {
        const form: AccordionItemProps = {
            id: `form-id-internship-${internship.length}`,
            title: (<>Internship {internship.length+1}</>),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <InternshipFields idNum={internship.length}
                        formData={formData} api={api}
                        setFilesDetail={setInternshipFiles}
                        setFilesToDelete={setFilesToDelete}
                    />
                </div>
            ),
        };

        return form;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addResidencyForm = (() => {
        const form: AccordionItemProps = {
            id: `form-id-residency-${residency.length}`,
            title: (<>Residency {residency.length+1}</>),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <ResidencyFields idNum={residency.length}
                        formData={formData} api={api}
                        setFilesDetail={setResidencyFiles}
                        setFilesToDelete={setFilesToDelete}
                    />
                </div>
            ),
        };

        return form;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addFellowshipForm = (() => {
        const form: AccordionItemProps = {
            id: `form-id-fellowship-${fellowship.length}`,
            title: "Fellowship " + (fellowship.length+1),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <FellowshipFields idNum={fellowship.length}
                        formData={formData} api={api}
                        setFilesDetail={setFellowshipFiles}
                        setFilesToDelete={setFilesToDelete}
                    />
                </div>
            ),
        };

        return form;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addCertificateField = () => {
        const fields: AccordionItemProps = {
            id: `form-id-${boardCertificates.length}`,
            title: "Board Certificate " + (boardCertificates.length+1),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <BoardCertificatesInput idNum={boardCertificates.length}
                        formData={formData} api={api} setFilesDetail={setBoardFiles}
                        setFilesToDelete={setFilesToDelete}
                    />

                    <div style={{height: "16px"}}></div>
                </div>
            ),
        };

        return fields;
    }

    const handleAddMedicalSchoolFields = useCallback(() => {
        const tempMedicalSchools = [...medicalSchool];
        tempMedicalSchools.push(addMedicalSchoolForm());

        setMedicalSchool(tempMedicalSchools);
    }, [medicalSchool, addMedicalSchoolForm]);

    const handleAddInternshipFields = useCallback(() => {
        const tempInternship = [...internship];
        tempInternship.push(addInternshipForm());

        setInternship(tempInternship);
    }, [internship, addInternshipForm]);

    const handleAddResidencyFields = useCallback(() => {
        const tempResidency = [...residency];
        tempResidency.push(addResidencyForm());

        setResidency(tempResidency);
    }, [residency, addResidencyForm]);

    const handleAddFellowshipFields = useCallback(() => {
        const tempFellowship = [...fellowship];
        tempFellowship.push(addFellowshipForm());

        setFellowship(tempFellowship);
    }, [fellowship, addFellowshipForm]);

    const handleAddAnotherBoardFields = useCallback(() => {
        const tempBoardCertificates = [...boardCertificates];
        tempBoardCertificates.push(addCertificateField());

        setBoardCertificates(tempBoardCertificates);
    }, [addCertificateField, boardCertificates]);

    const handleRemoveMedicalSchoolFields = () => {
        const lastIndex = medicalSchool.length - 1;
        const filePaths = [ `medicalSchool[${lastIndex}].diplomaFile.documentTypeId` ]
        const files = prepareDeleteFiles(filePaths, findByPathName)

        setMedicalSchool(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.medicalSchool) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.medicalSchool.pop();
        }
        methods.reset(currentValues);
    };

    const handleRemoveInternshipFields = () => {
        const lastIndex = internship.length - 1;
        const filePaths = [ `internship[${lastIndex}].evidenceFile.documentTypeId` ]
        const files = prepareDeleteFiles(filePaths, findByPathName)

        setInternship(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.internship) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.internship.pop();
        }
        methods.reset(currentValues);
    };

    const handleRemoveResidencyFields = () => {
        const lastIndex = residency.length - 1;
        const filePaths = [ `residency[${lastIndex}].evidenceFile.documentTypeId` ]
        const files = prepareDeleteFiles(filePaths, findByPathName)

        setResidency(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.residency) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.residency.pop();
        }
        methods.reset(currentValues);
    };

    const handleRemoveFellowshipFields = () => {
        const lastIndex = fellowship.length - 1;
        const filePaths = [ `fellowship[${lastIndex}].evidenceFile.documentTypeId` ]
        const files = prepareDeleteFiles(filePaths, findByPathName)

        setFellowship(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.fellowship) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.fellowship.pop();
        }
        methods.reset(currentValues);
    };

    const handleRemoveBoadCertificatesFields = () => {
        const lastIndex = boardCertificates.length - 1;
        const filePaths = [ `boardCertificates[${lastIndex}].certificateFile.documentTypeId` ]
        const files = prepareDeleteFiles(filePaths, findByPathName)

        setBoardCertificates(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.boardCertificates) {
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...files] : [...files]);
            currentValues.boardCertificates.pop();
        }
        methods.reset(currentValues);
    };

    const isInternshipPartiallyFilled = (internship: Internship): boolean => {
        const values = [
          internship.institutionName,
          internship.addressInfo.address1,
          internship.addressInfo.city,
          internship.addressInfo.stateId === "0" ? "" : internship.addressInfo.stateId,
          internship.addressInfo.addressCountryId,
          internship.attendance.fromMonth,
          internship.attendance.fromYear,
          internship.attendance.toMonth,
          internship.attendance.toYear,
          internship.programType,
          internship.evidenceFile.name,
          internship.evidenceFile.documentTypeId
        ];

        if (internship.addressInfo.stateId === "56") {
            values.push(internship.addressInfo.stateOther as string);
            values.push(internship.addressInfo.internationalCode);
        } else {
            values.push(internship.addressInfo.zipcode);
            if (internship.addressInfo.zipcodeExtension !== "") {
                values.push(internship.addressInfo.zipcodeExtension);
            }
        }

        const filledValues = values.filter(value => Boolean(value));
        return filledValues.length > 0 && filledValues.length < values.length;
    };
    const isResidencyPartiallyFilled = (residency: Residency): boolean => {
        const values = [
          residency.institutionName,
          residency.addressInfo.address1,
          residency.addressInfo.city,
          residency.addressInfo.stateId === "0" ? "" : residency.addressInfo.stateId,
          residency.addressInfo.addressCountryId,
          residency.attendance.fromMonth,
          residency.attendance.fromYear,
          residency.attendance.toMonth,
          residency.attendance.toYear,
          residency.programType,
          residency.evidenceFile.name,
          residency.evidenceFile.documentTypeId,
          residency.completionDate,
          residency.postGraduateCompletionDate
        ];

        if (residency.addressInfo.stateId === "56") {
            values.push(residency.addressInfo.stateOther as string);
            values.push(residency.addressInfo.internationalCode);
        } else {
            values.push(residency.addressInfo.zipcode);
            if (residency.addressInfo.zipcodeExtension !== "") {
               values.push(residency.addressInfo.zipcodeExtension);
            }
        }

        const filledValues = values.filter(value => Boolean(value));
        return filledValues.length > 0 && filledValues.length < values.length;
      };
      const isFellowshipPartiallyFilled = (fellowship: Fellowship): boolean => {
        const values = [
          fellowship.institutionName,
          fellowship.addressInfo.address1,
          fellowship.addressInfo.city,
          fellowship.addressInfo.stateId === "0" ? "" : fellowship.addressInfo.stateId,
          fellowship.addressInfo.addressCountryId,
          fellowship.attendance.fromMonth,
          fellowship.attendance.fromYear,
          fellowship.attendance.toMonth,
          fellowship.attendance.toYear,
          fellowship.programType,
          fellowship.completionDate,
          fellowship.evidenceFile.name,
          fellowship.evidenceFile.documentTypeId,
        ];

        if (fellowship.addressInfo.stateId === "56") {
            values.push(fellowship.addressInfo.stateOther as string);
            values.push(fellowship.addressInfo.internationalCode);
        } else {
            values.push(fellowship.addressInfo.zipcode);
            if (fellowship.addressInfo.zipcodeExtension !== "") {
                values.push(fellowship.addressInfo.zipcodeExtension);
            }
        }

        const filledValues = values.filter(value => Boolean(value));
        return filledValues.length > 0 && filledValues.length < values.length;
      };
      const isBoardPartiallyFilled = (board: boardCertificates): boolean => {
        const values = [
          board.certificateFile.name,
          board.certificateFile.documentTypeId,
          board.expirationDate,
          board.issuedDate
        ];

        const filledValues = values.filter(value => Boolean(value));
        return filledValues.length > 0 && filledValues.length < values.length;
      };

    const addPublicId = (isSubmit: boolean, category: 'medicalSchool' | 'internship' | 'residency' | 'fellowship' | 'boardCertificates', 
        countKey: 'countMedSchool' | 'countInternship' | 'countResidency' | 'countFellowship' | 'countBoard', form: Form) => {
        let values;
        let count = form?.steps?.educationTraining?.[countKey] ?? 0;

        if (!isSubmit && form.steps.educationTraining.data) {
            values = form?.steps?.educationTraining?.data[category];
        } else {
            values = methods.getValues()[category];
        }
        if (values) {
            for (let i = 0; i < values.length; i++) {
                // if publicId is missing, add it
                if (!values[i].publicId) {
                    count += 1;
                    const prefix = category.charAt(0);
                    values[i].publicId = `${prefix}-${count}`;
                }
            }
            form.steps.educationTraining[countKey] = count;
        }
        if (!form?.steps?.educationTraining?.[countKey]) {
            form.steps.educationTraining[countKey] = count;
        }
    };

    const onNext = async () => {
        setInternshipAlert(false);
        setResidencyAlert(false);
        setFellowshipAlert(false);
        const isValidFrontEnd = await methods.trigger();
        let allValid = isValidFrontEnd;

        const formValues = methods.getValues();

        // Check if any Internship object is partially filled
        if (formValues.internship && formValues.internship.some(isInternshipPartiallyFilled)) {
            allValid = false;
            setInternshipAlert(true);
        }
        if (formValues.residency && formValues.residency.some(isResidencyPartiallyFilled)) {
            allValid = false;
            setResidencyAlert(true);
        }
        if (formValues.fellowship && formValues.fellowship.some(isFellowshipPartiallyFilled)) {
            allValid = false;
            setFellowshipAlert(true);
        }
        if (formValues.boardCertificates && formValues.boardCertificates.some(isBoardPartiallyFilled)) {
            allValid = false;
            setBoardAlert(true);
        }

        if (allValid) {
            try {
                if (!formData) return;

                formData.steps.educationTraining.status = NavStepperStatus.Completed;

                addPublicId(true, 'medicalSchool', 'countMedSchool', formData);
                addPublicId(true, 'internship', 'countInternship', formData);
                addPublicId(true, 'residency', 'countResidency', formData);
                addPublicId(true, 'fellowship', 'countFellowship', formData);
                addPublicId(true, 'boardCertificates', 'countBoard', formData);

                const educationData = {
                    "medicalSchool": formValues.medicalSchool,
                    "internship": formValues.internship,
                    "residency": formValues.residency,
                    "fellowship": formValues.fellowship,
                    "boardCertificates": formValues.boardCertificates,
                    "licensesCertificates": formValues.licensesCertificates
                };

                formData.steps.educationTraining.data = educationData as any;
                formData.setup.currentStep = PAGES_NAME.CriminalRecord

                const allFiles = [
                    ...medSchoolFiles,
                    ...internshipFiles,
                    ...residencyFiles,
                    ...fellowshipFiles,
                    ...boardFiles,
                    ...licensesFiles,
                ].filter((file) => file !== undefined);

                const res = await postForm(api, formData.setup.providerId, formData, allFiles, mergeDeleteLists(filesToDelete, deletedDocuments));
                if (res?.status === 200) {
                    navigate('/cred/9');
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                if (!formData) return;
                formData.steps.educationTraining.status = NavStepperStatus.Error;
                formData.setup.currentStep = PAGES_NAME.Education;
            }
        } else {
            console.log('errors', methods.formState.errors)
            const errorKeys = Object.keys(methods.formState.errors);
            setErrorTags(errorKeys);
        }
    };

    const saveForLater = async () => {
        if (formData) {
            formData.steps.educationTraining.data = methods.getValues();
            formData.setup.currentStep = PAGES_NAME.Education;

            const allFiles = [
                ...medSchoolFiles,
                ...internshipFiles,
                ...residencyFiles,
                ...fellowshipFiles,
                ...boardFiles,
                ...licensesFiles,
            ].filter((file) => file !== undefined);
            const response = await postForm(
                api,
                formData.setup.providerId,
                formData,
                allFiles,
                mergeDeleteLists(filesToDelete, deletedDocuments)
            );

            const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
            if (response?.status === 200) {
                role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }
    }

    const goBack = () => {
        if (!formData) return;
        CheckNavigateToBack(PAGES_NAME.Education, formData, navigate);
    };

    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) {
            return;
        }
        // adds default Accordions if there's no initial data
        if (formData) {
            if (!formData?.steps?.educationTraining?.data) {
                medicalSchool.push(addMedicalSchoolForm());
                internship.push(addInternshipForm());
                residency.push(addResidencyForm());
                fellowship.push(addFellowshipForm());
                boardCertificates.push(addCertificateField());

                initialized.current = true;
                return;
            }

            if (!formData.steps.educationTraining.countMedSchool) {
                addPublicId(false, 'medicalSchool', 'countMedSchool', formData);
                addPublicId(false, 'internship', 'countInternship', formData);
                addPublicId(false, 'fellowship', 'countFellowship', formData);
                addPublicId(false, 'residency', 'countResidency', formData);
                addPublicId(false, 'boardCertificates', 'countBoard', formData);
            }
        }
    }, [formData]);

    useEffect(() => {
        if(formData && formData?.steps?.educationTraining?.data){
            setDefaultFormValues(educationDefaultValues(formData));

            if (Array.isArray(formData?.steps?.educationTraining?.data?.medicalSchool)) {
                formData?.steps?.educationTraining?.data?.medicalSchool?.forEach((_: any, index: number) => {
                    if (!medicalSchool[index]?.id) {
                        medicalSchool.push(addMedicalSchoolForm())
                    }
                });
            }
            if (Array.isArray(formData?.steps?.educationTraining?.data?.internship)) {
                formData?.steps?.educationTraining?.data?.internship?.forEach((_: any, index: number) => {
                    if (!internship[index]?.id) {
                        internship.push(addInternshipForm());
                    }})
            }
            if (Array.isArray(formData?.steps?.educationTraining?.data?.residency)) {
                formData?.steps?.educationTraining?.data?.residency?.forEach((_: any, index: number) => {
                    if (!residency[index]?.id) {
                        residency.push(addResidencyForm());
                    }})
            }
            if (Array.isArray(formData?.steps?.educationTraining?.data?.fellowship)) {
                formData?.steps?.educationTraining?.data?.fellowship?.forEach((_: any, index: number) => {
                    if (!fellowship[index]?.id) {
                        fellowship.push(addFellowshipForm());
                    }})
            }
            if (Array.isArray(formData?.steps?.educationTraining?.data?.boardCertificates)) {
                formData?.steps?.educationTraining?.data?.boardCertificates?.forEach((_: any, index: number) => {
                    if (!boardCertificates[index]?.id) {
                        boardCertificates.push(addCertificateField());
                    }})
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
            <BackButton label="Back" onClick={goBack}/>
            <PageTitle
                title="Education and Training"
                subtitle="Add your details to finish your practice profile."
            />
            <FormProvider {...methods}>
                <h2 className="font-black mb-2 text-2xl">Medical School</h2>
                <div style={{height: "16px"}}></div>
                <Collaspsible accordionItems={medicalSchool}/>
                <div className="flex gap-52 items-center">
                    <button type="button"
                        className="usa-button usa-button--outline mt-5 h-min"
                        onClick={handleAddMedicalSchoolFields}
                        >
                        Add Medical School
                    </button>
                    {medicalSchool.length > 1 &&
                        <button type="button"
                            className="usa-button usa-button--outline mt-5"
                            onClick={handleRemoveMedicalSchoolFields}
                            >
                            Remove Additional
                        </button>
                    }
                </div>

                <div style={{height: "42px"}}></div>
                <h2 className="font-black mb-2 text-2xl">Internship</h2>
                {internshipAlert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Section must be either fully filled out or completely empty.
                    </p>
                }
                <div style={{height: "16px"}}></div>
                <Collaspsible accordionItems={internship}/>
                <div className="flex gap-60 items-center">
                    <button type="button"
                        className="usa-button usa-button--outline mt-5 h-min"
                        onClick={handleAddInternshipFields}
                        >
                        Add Internship
                    </button>
                    {internship.length > 1 &&
                        <button type="button"
                            className="usa-button usa-button--outline mt-5"
                            onClick={handleRemoveInternshipFields}
                            >
                            Remove Additional
                        </button>
                    }
                </div>

                <div style={{height: "42px"}}></div>
                <h2 className="font-black mb-2 text-2xl">Residency</h2>
                {residencyAlert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Section must be either fully filled out or completely empty.
                    </p>
                }
                <div style={{height: "16px"}}></div>
                <Collaspsible accordionItems={residency}/>
                <div className="flex gap-60 items-center">
                    <button type="button"
                        className="usa-button usa-button--outline mt-5 h-min"
                        onClick={handleAddResidencyFields}
                        >
                        Add Residency
                    </button>
                    {residency.length > 1 &&
                        <button type="button"
                            className="usa-button usa-button--outline mt-5"
                            onClick={handleRemoveResidencyFields}
                            >
                            Remove Additional
                        </button>
                    }
                </div>

                <div style={{height: "42px"}}></div>
                <h2 className="font-black mb-2 text-2xl">Fellowship</h2>
                {fellowshipAlert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Section must be either fully filled out or completely empty.
                    </p>
                }
                <div style={{height: "16px"}}></div>
                <Collaspsible accordionItems={fellowship}/>
                <div className="flex gap-60 items-center">
                    <button type="button"
                        className="usa-button usa-button--outline mt-5 h-min"
                        onClick={handleAddFellowshipFields}
                        >
                        Add Fellowship
                    </button>
                    {fellowship.length > 1 &&
                        <button type="button"
                            className="usa-button usa-button--outline mt-5"
                            onClick={handleRemoveFellowshipFields}
                            >
                            Remove Additional
                        </button>
                    }
                </div>

                <div style={{height: "42px"}}></div>
                <h2 className="font-black mb-2 text-2xl">Board Certificates</h2>
                {boardAlert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Section must be either fully filled out or completely empty.
                    </p>
                }
                <div style={{height: "16px"}}></div>
                <Collaspsible accordionItems={boardCertificates}/>
                <div className="flex gap-64 items-center">
                    <button type="button"
                        className="usa-button usa-button--outline mt-5 h-min"
                        onClick={handleAddAnotherBoardFields}
                        >
                        Add Board Certificate
                    </button>
                    {boardCertificates.length > 1 &&
                        <button type="button"
                            className="usa-button usa-button--outline mt-5"
                            onClick={handleRemoveBoadCertificatesFields}
                            >
                            Remove Additional
                        </button>
                    }
                </div>

                <div style={{height: "42px"}}></div>
                <PageTitle
                    title="Licenses and Certificates"
                    subtitle="Add your details to fill out your information."
                />
                <label>
                    Required fields are marked with an asterisk{"("}
                    <span className="text-red-error">*</span>
                    {") "}
                </label>
                <div style={{height: "18px"}}></div>
                <LicensesAndCertificates formData={formData} setFilesDetail={setLicensesFiles}/>
            </FormProvider>
            {errorTags?.length > 0 && <ul>
                <p className="font-bold text-red-error mt-5" role="alert">
                    Errors in section(s):
                </p>
                {errorTags?.map((error, index) => (
                <li key={index} className="font-medium text-red-error list-disc ml-6">{formatError(error ?? '')}</li>
            ))}</ul>}

            <div className="flex flex-row my-16">
                <button type="button" className="usa-button usa-button--outline"
                    onClick={saveForLater}>Save for Later</button>
                <button type="submit" className="usa-button" onClick={onNext}>Next</button>
            </div>
        </div>
    </>
}

export default Education;
