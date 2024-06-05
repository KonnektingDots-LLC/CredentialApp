import { useForm, useFieldArray } from "react-hook-form";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import BackButton from "../Components/BackButton";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import CredInputFiles, { documentToDeleteAtom } from "../../../../Application/sharedComponents/CredInputFile";
import { useEffect, useState } from "react";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { useNavigate } from "react-router-dom";
import NavStepperStatus from "../Components/NavStepperStatus";
import { Specialties, SpecialtiesForm } from "../../../Layouts/formLayout/credInterfaces";
import { FileToDelete, postForm } from "../../../../Infraestructure/Services/form.service";
import { handleKeyDown, mergeDeleteLists } from "../../../../Application/utils/helperMethods";
import { specialtiesDefaultValues } from "../Components/defaultFormValues";
import { getSpecialtyList } from "../../../../Infraestructure/Services/dropdowns.service";
import { Files, Specialty } from "../../../../Application/interfaces";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import { useDocumentInputStore } from "../../../../Infraestructure/Store/documentStore";
import { useAtom } from "jotai";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useQuery } from "@tanstack/react-query";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const SpecialtiesPage = () => {
  const navigate = useNavigate();
  const api = useAxiosInterceptors();
    const { data: formData, isLoading: isFormLoading } = useGetForm(api);

    const { data: specialtyList } = useQuery<Specialty[]>({
        queryKey: ["specialtyList"],
        queryFn: () => getSpecialtyList(api, 1)
    })

  const [defaultFormValues, setDefaultFormValues] = useState<SpecialtiesForm | undefined>(undefined);

  const [selectedSpecialities, setSelectedSpecialities] = useState<Specialties[]>(formData?.steps?.specialtiesAndSubspecialties?.data?.specialties ?? []);
  const [selectedSubSpecialities, setSelectedSubSpecialities] = useState<Specialties[]>(formData?.steps?.specialtiesAndSubspecialties?.data?.subspecialties ?? []);
  const [specialtyFiles, setSpecialtyFiles] = useState<Files[]>([]);
  const [subSpecialtyFiles, setSubSpecialtyFiles] = useState<Files[]>([]);
  const [specialtiesNewFileName, setSpecialtiesNewFileName] = useState<string[]>([]);
  const [subSpecialtiesNewFileName, setSubSpecialtiesNewFileName] = useState<string[]>([]);

  const [filesToDelete, setFilesToDelete] = useState<FileToDelete[] | undefined>()
  const [deletedDocuments] = useAtom(documentToDeleteAtom);

  const findByName = useDocumentInputStore(state => state.findByPathName)

  const {
    handleSubmit, register, control, formState: { errors, isDirty }, setValue, getValues, reset, unregister} = useForm<ExtendedFieldValues>({
    defaultValues: defaultFormValues
  });

  const {
    fields: specialtyFields,
    append: specialtyAppend,
    remove: specialtyRemove,
  } = useFieldArray({
    control,
    name: "specialties",
    rules: {
      minLength: { value: 1, message: "Please include at least one specialty" },
    },
  });

  const {
    fields: subspecialtyFields,
    append: subspecialtyAppend,
    remove: subspecialtyRemove,
  } = useFieldArray({
    control,
    name: "subspecialties",
  });

  const handleFileSelected = (files: File[], documentTypeId: string, idNum: number) => {
      const newFileDetails = files.map(file => {
          let oldFilename;
          if (documentTypeId === "13" && specialtiesNewFileName[idNum] !== formData?.steps?.specialtiesAndSubspecialties?.data?.specialties[idNum]?.evidenceFile?.name) {
              oldFilename = formData?.steps?.specialtiesAndSubspecialties?.data?.specialties[idNum]?.evidenceFile?.name;
          }
          if (documentTypeId === "14" && subSpecialtiesNewFileName[idNum] !== formData?.steps?.specialtiesAndSubspecialties?.data?.subspecialties[idNum]?.evidenceFile?.name) {
              oldFilename = formData?.steps?.specialtiesAndSubspecialties?.data?.subspecialties[idNum]?.evidenceFile?.name;
          }

          return {
              documentTypeId: documentTypeId,
              file: file,
              ...(oldFilename ? { oldFilename } : {})
          };
      });
      if (documentTypeId === "13") {
        setSpecialtyFiles((prevFiles) => {
          const updatedFileArray = [...prevFiles];
          updatedFileArray[idNum] = newFileDetails[0];
          return updatedFileArray;
        });
      } else if (documentTypeId === "14") {
        setSubSpecialtyFiles((prevFiles) => {
          const updatedFileArray = [...prevFiles];
          updatedFileArray[idNum] = newFileDetails[0];
          return updatedFileArray;
        });
      }
  };

  const handleSpecialtiesFileNameChange = (newName: string, idNum: number) => {
    setSpecialtiesNewFileName((prevNewFileName) => {
      const updatedFileNameArray = [...prevNewFileName];
      updatedFileNameArray[idNum] = newName;
      return updatedFileNameArray;
    });
  };

  const handleSubSpecialtiesFileNameChange = (newName: string, idNum: number) => {
    setSubSpecialtiesNewFileName((prevNewFileName) => {
      const updatedFileNameArray = [...prevNewFileName];
      updatedFileNameArray[idNum] = newName;
      return updatedFileNameArray;
    });
  };

  const handleSpecialtiesChanges = (type: number, index: number, value: string) => {
    const specialtyName = specialtyList?.find((val) => val.id === parseInt(value))?.name ?? "Allergist";
    if (type === 0) {
      if (value === "0") {
        return;
      }
      // Update specialties
      const temp: Specialties[] = [...selectedSpecialities];
      temp[index] = {...temp[index], id: value, "evidenceFile": {name: "", documentTypeId: ""}}

      const newSpecialtySelected: Specialties[] = temp.map((item, i) => {
        if (i === index) {
          return {...item, id: value, name: specialtyName, "evidenceFile": {name: "", documentTypeId: ""}};
        } else {
          return item;
        }
      });
      setSelectedSpecialities(newSpecialtySelected);
    } else {
      // Update subSpecialties
      if (value === "0") {
        unregister(`subspecialties[${index}].evidenceFile.name`);
        unregister(`subspecialties[${index}].evidenceFile.documentTypeId`);
      }
      const temp: Specialties[] = [...selectedSubSpecialities];
      temp[index] = {...temp[index], id: value, "evidenceFile": {name: "", documentTypeId: ""}};

      const newSubSpecialtySelected: Specialties[] = temp.map((item, i) => {
        if (i === index) {
          return {...item, id: value, name: specialtyName, "evidenceFile": {name: "", documentTypeId: ""}};
        } else {
          return item;
        }
      });
      setSelectedSubSpecialities(newSubSpecialtySelected);
    }
  };


    const handleRemoveSpecialty = async (index: number) => {
        const selectedSpecialty = {
            name: `specialties[${index}].evidenceFile.name`,
            documentIdType: `specialties[${index}].evidenceFile.documentTypeId`
        }

        const uploadFilename = getValues(selectedSpecialty.name)
        const documentTypeId = Number(getValues(selectedSpecialty.documentIdType))
        specialtyRemove(index);

        const newSelectedSpecialties = selectedSpecialities.filter((_, i) => i !== index);
        setSelectedSpecialities([...newSelectedSpecialties]);

        if (findByName(selectedSpecialty.documentIdType)?.documentExist) {
          const formDataFilename = formData?.steps?.specialtiesAndSubspecialties?.data?.specialties[index]?.evidenceFile?.name;
          if (uploadFilename !== formDataFilename) {
            const newFile: FileToDelete = { documentTypeId, uploadFilename: formDataFilename || '' };
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, newFile] : [newFile]);            
          } else {
            const newFile: FileToDelete = { documentTypeId, uploadFilename };
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, newFile] : [newFile]);
          }
        }
        
        unregister(`specialties[${index}].id`);
        unregister(`specialties[${index}].evidenceFile.name`);
    };
    
    const handleRemoveSubspecialty = async (index: number) => {
        const selectedSubSpecialty = {
            name: `subspecialties[${index}].evidenceFile.name`,
            documentIdType: `subspecialties[${index}].evidenceFile.documentTypeId`
        }

        const uploadFilename = getValues(selectedSubSpecialty.name)
        const documentTypeId = Number(getValues(selectedSubSpecialty.documentIdType))
        if (index === 0) {
          subspecialtyRemove(index);
          subspecialtyAppend({ id: "", "evidenceFile": {name: "", documentTypeId: ""} });
        } else {
          subspecialtyRemove(index);
        }

        if(findByName(selectedSubSpecialty.documentIdType)?.documentExist){
          const formDataFilename = formData?.steps?.specialtiesAndSubspecialties?.data?.subspecialties[index]?.evidenceFile?.name;
          if (uploadFilename !== formDataFilename) {
            const newFile: FileToDelete = { documentTypeId, uploadFilename: formDataFilename || '' };
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, newFile] : [newFile]);            
          } else {
            const newFile: FileToDelete = { documentTypeId, uploadFilename };
            setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, newFile] : [newFile]);
          }
        } 

        const newSelectedSubSpecialties = selectedSubSpecialities.filter((_, i) => i !== index);
        setSelectedSubSpecialities([...newSelectedSubSpecialties]);

        if (index !== 0) {
          unregister(`subspecialties[${index}].evidenceFile.name`);
          unregister(`subspecialties[${index}].id`);          
        }
    }

  const onSubmit = async () => {
    if (isDirty) {
      try {
        if (!formData) return;

        formData.steps.specialtiesAndSubspecialties.status = NavStepperStatus.Completed;
        formData.steps.specialtiesAndSubspecialties.data = getValues();
        formData.setup.currentStep = PAGES_NAME.Incorporated;

        const allSelectedFiles = [
            ...specialtyFiles,
            ...subSpecialtyFiles,
        ].filter(
            // only keeps files that were selected in current session
            (file) => file !== undefined
        );

        const pickedFilesSpec = allSelectedFiles.filter((file) =>
            formData.steps.specialtiesAndSubspecialties.data?.specialties.some(
                (specFile) => specFile.evidenceFile.name === file.file.name
            )
        );
        const pickedFilesSubSpec = allSelectedFiles.filter((file) =>
            formData.steps.specialtiesAndSubspecialties.data?.subspecialties.some(
                (specFile) => specFile.evidenceFile.name === file.file.name
            )
        );

        const response = await postForm(
            api,
            formData.setup.providerId,
            formData,
            [...pickedFilesSpec, ...pickedFilesSubSpec],
            mergeDeleteLists(filesToDelete, deletedDocuments)
        );
        if (response && response.status === 200) {
            navigate("/cred/4");
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
      } catch (error) {
        if (!formData) return;
        formData.steps.specialtiesAndSubspecialties.status = NavStepperStatus.Error;
        formData.setup.currentStep = PAGES_NAME.Specialties;
      }
    } else {
      if (formData?.steps && formData.steps.specialtiesAndSubspecialties.status !== NavStepperStatus.Completed) {
        formData.steps.specialtiesAndSubspecialties.status = NavStepperStatus.Completed;
        formData.setup.currentStep = PAGES_NAME.Incorporated;

        const allSelectedFiles = [
            ...specialtyFiles,
            ...subSpecialtyFiles,
        ].filter(
            // only keeps files that were selected in current session
            (file) => file !== undefined
        );

        const pickedFilesSpec = allSelectedFiles.filter(
          (file) => formData.steps.specialtiesAndSubspecialties.data?.specialties.some( specFile =>
            specFile.evidenceFile.name === file.file.name)
        );
        const pickedFilesSubSpec = allSelectedFiles.filter(
          (file) => formData.steps.specialtiesAndSubspecialties.data?.subspecialties.some( specFile =>
            specFile.evidenceFile.name === file.file.name)
        );
        const response = await postForm(api, formData.setup.providerId, formData, [...pickedFilesSpec, ...pickedFilesSubSpec]);
        if (response && response.status === 200) {
          navigate('/cred/4');
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      } else {
        navigate('/cred/4')
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });        
      }
    }
  };

    const saveForLater = async () => {
        if (formData?.steps) {
            formData.steps.specialtiesAndSubspecialties.data = getValues();
            formData.setup.currentStep = PAGES_NAME.Specialties;
            const allSelectedFiles = [...specialtyFiles, ...subSpecialtyFiles].filter(
                // only keeps files that were selected in current session
                (file) => file !== undefined
            );

            const pickedFilesSpec = allSelectedFiles.filter((file) =>
                formData.steps.specialtiesAndSubspecialties.data?.specialties.some(
                    (specFile) => specFile.evidenceFile.name === file.file.name
                )
            );
            const pickedFilesSubSpec = allSelectedFiles.filter((file) =>
                formData.steps.specialtiesAndSubspecialties.data?.subspecialties.some(
                    (specFile) => specFile.evidenceFile.name === file.file.name
                )
            );

            const response = await postForm(
                api,
                formData.setup.providerId,
                formData,
                [...pickedFilesSpec, ...pickedFilesSubSpec],
                mergeDeleteLists(filesToDelete, deletedDocuments)
            );
            if (response && response.status === 200) {
                const role = msalInstance.getActiveAccount()?.idTokenClaims
                    ?.extension_Role as string;
                role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }
    };

  const goBack = async () => {
    if (!formData) return;
    navigate("/cred/2");
    return;
  };

    useEffect(() => {
        setDefaultFormValues(specialtiesDefaultValues(formData));

    }, [formData]);

useEffect(() => {
if (formData) {
    reset(defaultFormValues);
}
}, [defaultFormValues, formData, reset]);

useEffect(() => {
  setSelectedSpecialities(formData?.steps?.specialtiesAndSubspecialties?.data?.specialties ?? []);
  setSelectedSubSpecialities(formData?.steps?.specialtiesAndSubspecialties?.data?.subspecialties ?? []);
}, [formData]);

    if (isFormLoading && !formData) {
        return <LoadingComponent />
    }

  return (
    <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
      <BackButton label="Back" onClick={goBack}/>
      <section>
        <PageTitle
          title="Specialties & Subspecialties"
          subtitle={<p className="flex gap-1">Add your details to finish your <p className="font-semibold">Individual Practice Profile</p>.</p>}
        />
        <div>
          {errors.specialties ? (
            <p className=" font-bold text-red-error mb-6" role="alert">
              Please include all your relevant Specialties
              <>{console.log('errors', errors.specialties)}</>
            </p>
          ) : (
            ""
          )}
        </div>
        {/* {import.meta.env.DEV && <DevTool control={control} />} */}
        <div className=" w-5/12">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" onKeyDown={handleKeyDown}>
          <h6 className="font-semibold pb-2">Specialties</h6>
            {specialtyFields.map((specialty, index) => {
              return (
                <fieldset key={specialty.id} className="w-[375px]">
                  <div>
                    <label>Select your Specialty
                      <span className="text-red-error"> *</span>
                    </label>
                    <div className="flex items-start">
                      <div>
                          <select
                            className={
                              errors[`specialties[${index}].id`]
                                ? " border-red-error border-4 w-[390px] h-8"
                                : " border-black border w-[390px] h-8"
                                }
                                {...register(`specialties[${index}].id`, {
                                  required: "please include a specialty",
                                })}
                                onChange={(event) => handleSpecialtiesChanges(0, index, event.target.value)}
                                value={selectedSpecialities[index]?.id}
                            >
                              <option value={""} disabled={index > 0}></option>
                              {specialtyList?.map((specialty) => {
                                return <>
                                    <option value={specialty.id}>{specialty.name}</option>
                                    </>
                                })}
                          </select>
                          {selectedSpecialities[index]?.id &&
                            <div className="mt-4 -ml-3">
                              <CredInputFiles fileId={`specialties[${index}].evidenceFile.name`}
                                  title={"Upload Certification"}
                                  description={`Attach the certification of this Specialty`}
                                  required={true} documentTypeId={13}
                                  register={register} errors={errors} setValue={setValue}
                                  value={selectedSpecialities[index]?.evidenceFile?.name}
                                  onHandleUpdatedFiles={(f) => handleFileSelected(f, "13", index)}
                                  documentName={`specialties[${index}].evidenceFile.documentTypeId`}
                                  onFileNameChange={(e) => handleSpecialtiesFileNameChange(e, index)}
                                  removeDelete
                                />
                            </div>}
                      </div>

                      {index === selectedSpecialities.length-1 && index > 0 && (
                        <span
                          className="cursor-pointer ml-2 mt-[7px]"
                          // onClick={() => setSpecialtyDeleteModalOpen(true)}
                          onClick={() => handleRemoveSpecialty(index)}
                        >
                          <AiFillMinusCircle
                            className=" text-red-error"
                            size={19}
                          />
                        </span>
                      )}

                    </div>
                  </div>
                </fieldset>
              );
            })}
            <div className="flex gap-2 mb-5 cursor-pointer">
              <IoMdAddCircle className=" text-primary-blue" />
              <span
                className="text-primary"
                onClick={() => {
                  specialtyAppend({ id: "", "evidenceFile": {name: "", documentTypeId: ""} });
                }}
              >
                Add another Specialty
              </span>
            </div>

            <hr className=" w-[60%] text-gray-300 mx-auto my-5"/>
            <h6 className="font-semibold pb-2">Subspecialties</h6>
            {subspecialtyFields.map((subspecialty, index) => {
              return (
                <fieldset key={subspecialty.id}>
                  <div>
                    <label>Select your Sub-Specialty</label>
                    <div className="flex items-start">
                      <div>
                        <select
                          className={
                            errors[`subspecialties[${index}].id`]
                              ? " border-red-error border-4 w-[390px] h-8"
                              : " border-black border w-[390px] h-8"
                            }
                            {...register(`subspecialties[${index}].id`)}
                            onChange={(event) => handleSpecialtiesChanges(1, index, event.target.value)}
                            value={selectedSubSpecialities[index]?.id}
                          >
                            <option value={""} disabled={index > 0}></option>
                            {specialtyList?.map((specialty) => {
                              return <>
                                  <option value={specialty.id}>{specialty.name}</option>
                                  </>
                            })}
                          </select>
                        {selectedSubSpecialities[index]?.id &&
                              <div className="mt-4 -ml-3">
                                <CredInputFiles fileId={`subspecialties[${index}].evidenceFile.name`}
                                  title={"Upload Certification"}
                                  description={`Attach the certification of this Sub-Specialty`}
                                    required={selectedSubSpecialities[index]?.id !== "0"} documentTypeId={14}
                                    register={register} errors={errors} setValue={setValue}
                                    value={selectedSubSpecialities[index]?.evidenceFile?.name}
                                    onHandleUpdatedFiles={(f) => handleFileSelected(f, "14", index)}
                                    documentName={`subspecialties[${index}].evidenceFile.documentTypeId`}
                                    onFileNameChange={(e) => handleSubSpecialtiesFileNameChange(e, index)}
                                    removeDelete
                                  />
                        </div>}
                      </div>
                      {(index === selectedSubSpecialities.length-1 && selectedSubSpecialities[index]?.id !== "")  && (
                        <span
                          className=" cursor-pointer self-start ml-1 mt-[7px]"
                          onClick={() => handleRemoveSubspecialty(index)}
                          // onClick={() => setSubspecialtyDeleteModalOpen(true)}
                        >
                          <AiFillMinusCircle
                            className=" text-red-error"
                            size={19}
                          />
                        </span>
                      )}

                   </div>
                  </div>
                </fieldset>
              );
            })}
            <div className="flex gap-2 mb-5 cursor-pointer">
            <IoMdAddCircle className=" text-green-600" />
            <span
              className="text-primary"
              onClick={() => {
                subspecialtyAppend({ id: "", "evidenceFile": {name: "", documentTypeId: ""} });
              }}
            >
              Add another Sub-Specialty
            </span>
          </div>

            <div className="flex flex-row my-16 ml-3">
              <button type="button" className="usa-button usa-button--outline"
                onClick={saveForLater}>Save for Later</button>
              <button type="submit" className="usa-button">Next</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SpecialtiesPage;
