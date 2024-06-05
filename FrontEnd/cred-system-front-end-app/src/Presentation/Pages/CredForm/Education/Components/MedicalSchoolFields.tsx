import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { useFormContext } from "react-hook-form";
import KDDateInput from "../../../../../Application/sharedComponents/KDDateInput";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { Form } from "../../../../Layouts/formLayout/credInterfaces";
import AddressFields from "./AddressFields";
import { AxiosInstance } from "axios";
import { Files } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { useState } from "react";
import { handleKeyDown } from "../../../../../Application/utils/helperMethods";
import EducationDatePicker from "./EducationDatePicker";

interface Props {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>
}

const MedicalSchoolFields = ({idNum, formData, api, setFilesDetail}:Props) => {
    const { register, formState: { errors }, setValue, watch, getValues } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const [newFileName, setNewFileName] = useState<string[]>([]);

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName[idNum] !== formData?.steps?.educationTraining?.data?.medicalSchool[idNum]?.diplomaFile?.name) {
                oldFilename = formData?.steps.educationTraining.data?.medicalSchool?.[idNum]?.diplomaFile.name
            }
    
            return {
                documentTypeId: documentTypeId,
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail((prevFiles) => {
            const updatedFileArray = [...prevFiles];
            updatedFileArray[idNum] = newFileDetails[0];
            return updatedFileArray;
          });
    };

    const handleFileNameChange = (newName: string) => {
        setNewFileName((prevNewFileName) => {
            const updatedFileNameArray = [...prevNewFileName];
            updatedFileNameArray[idNum] = newName;
            return updatedFileNameArray;
          });
    };

    const handleDateInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    };

    const handleDatePickerChange  = (key: string) => (value: string | undefined) => {
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    }

    return <>
        <form autoComplete="off" onKeyDown={handleKeyDown}>
            <label>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </label>

            <TextLimitLength label={"Medical School, School of Dentistry or Equivalent "} register={register}
                name={`medicalSchool[${idNum}].schoolName`} minLength={1}
                errors={errors} isRequired={true} maxLength={80}
            />

            <AddressFields formData={formData} idNum={idNum}
                api={api} sectionName={"medicalSchool"} required    
            />

            <fieldset className="flex flex-col mt-3">
                <label className="-mb-4 flex items-center">
                    Graduation Date{"  "}
                    <span className="text-red-error"> *</span>
                    <p className={`text-gray-50 text-sm ml-2`}>
                        (mm/yyyy)
                    </p>
                </label>
                <div className={errors[`medicalSchool[${idNum}].graduationMonth` || 
                    `medicalSchool[${idNum}].graduationYear`] &&
                    "usa-form-group usa-form-group--error"}>
                <div className="flex gap-3">
                    <KDDateInput pickerId={`medicalSchool[${idNum}].graduationMonth`}
                        pickerLabel={"Month "} unit={"month"} required
                        onHandleChange={handleDateInputChange(`medicalSchool[${idNum}].graduationMonth`)}
                        errorHandler={errors} register={register} 
                        value={formData?.steps.educationTraining.data?.medicalSchool?.[idNum]?.graduationMonth}
                        watch={watch} valueToWatch={`medicalSchool[${idNum}].graduationYear`}
                    />
                    
                    <KDDateInput pickerId={`medicalSchool[${idNum}].graduationYear`}
                        pickerLabel={"Year "} unit={"year"} required
                        onHandleChange={handleDateInputChange(`medicalSchool[${idNum}].graduationYear`)}
                        errorHandler={errors} register={register} 
                        value={formData?.steps.educationTraining.data?.medicalSchool?.[idNum]?.graduationYear}
                        watch={watch} valueToWatch={`medicalSchool[${idNum}].graduationMonth`}
                    />
                </div>
                </div>
            </fieldset>

            <TextLimitLength label={"Medical School Specialty "} register={register}
                name={`medicalSchool[${idNum}].specialty`} 
                errors={errors} isRequired={true} minLength={1} maxLength={80}
            />

            <EducationDatePicker 
                pickerId={`medicalSchool[${idNum}].specialtyCompletionDate`}
                pickerLabel="Specialty Completion Date "
                required={true}
                onHandleChange={handleDatePickerChange(`medicalSchool[${idNum}].specialtyCompletionDate`)}
                errorHandler={errors} register={register}          
                value={formData?.steps.educationTraining.data?.medicalSchool?.[idNum]?.specialtyCompletionDate} 
                updatedValue={getValues()?.medicalSchool?.[idNum]?.specialtyCompletionDate}
                validationType="notFutureDate" 
            />

            <TextLimitLength label={"Specialty Degree Received "} register={register}
                name={`medicalSchool[${idNum}].specialtyDegree`} 
                errors={errors} isRequired={true} minLength={1} maxLength={80}
            />

            <CredInputFiles title="Diploma" 
                description="Please attach your Medical School Diploma as a .pdf document" 
                fileId={`medicalSchool[${idNum}].diplomaFile.name`}
                required={true}
                register={register} errors={errors} setValue={setValue}
                value={formData?.steps.educationTraining.data?.medicalSchool?.[idNum]?.diplomaFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "18")}
                documentTypeId={18} documentName={`medicalSchool[${idNum}].diplomaFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
        </form>
    </>
}

export default MedicalSchoolFields;
