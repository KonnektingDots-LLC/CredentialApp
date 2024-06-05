import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues, defaultResidencyStruct } from "../../../../../Application/utils/constants";
import { Form, Residency } from "../../../../Layouts/formLayout/credInterfaces";
import AddressFields from "./AddressFields";
import { AxiosInstance } from "axios";
import { Files } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { useState } from "react";
import { handleKeyDown, prepareDeleteFiles } from "../../../../../Application/utils/helperMethods";
import { useDocumentInputStore } from "../../../../../Infraestructure/Store/documentStore";
import { FileToDelete } from "../../../../../Infraestructure/Services/form.service";
import EducationDatePicker from "./EducationDatePicker";
import KDDateInput from "../../../../../Application/sharedComponents/KDDateInput";

interface Props {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>;
    setFilesToDelete: (value: React.SetStateAction<FileToDelete[] | undefined>) => void
}

const ResidencyFields = ({idNum, formData, api, setFilesDetail, setFilesToDelete}:Props) => {
    const { register, formState: { errors }, setValue, watch, reset, getValues } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const [newFileName, setNewFileName] = useState<string[]>([]);
    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName[idNum] !== formData?.steps?.educationTraining?.data?.residency?.[idNum]?.evidenceFile?.name) {
                oldFilename = formData?.steps.educationTraining.data?.residency?.[idNum]?.evidenceFile.name
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
        if (value === "NaN-NaN-NaN") {
            setValue(key, "", {shouldValidate: true, shouldDirty: true});
        } else {
            setValue(key, value,  {shouldValidate: true, shouldDirty: true });
        }
    }

    const handleClearFields = () => {
        const filePath = [`residency[${idNum}].evidenceFile.documentTypeId`];
        const file = prepareDeleteFiles(filePath, findByPathName);
        setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...file] : [...file]);

        const currentValues = getValues(); 
        currentValues.residency = defaultResidencyStruct as Residency[];
        reset(currentValues);
    };

    return <>
        <form autoComplete="off" onKeyDown={handleKeyDown}>
            <div className="flex justify-between">
                <label>
                    Required fields are marked with an asterisk{"("}
                    <span className="text-red-error">*</span>
                    {") "}
                </label>
                {getValues()?.residency?.length === 1 && idNum === 0 && 
                <button type="button" className="usa-button usa-button--outline" 
                onClick={handleClearFields}>Clear</button>}
            </div>
            <TextLimitLength label={"Residency Institution Name "} register={register}
                name={`residency[${idNum}].institutionName`} maxLength={80}
                errors={errors} isRequired={false} minLength={1}
            />

            <AddressFields formData={formData} idNum={idNum}
                api={api} sectionName="residency" required={false}
            />

            <fieldset className="flex flex-col mt-3">
                <label className="-mb-4" htmlFor={"residency-attendance"}>
                    Attendance{" "}
                    {/* <span className="text-red-error">*</span> */}
                </label>
                <div className={errors[`residency[${idNum}].attendance.fromMonth` && 
                    `residency[${idNum}].attendance.fromYear` &&  
                    `residency[${idNum}].attendance.toMonth` && 
                    `residency[${idNum}].attendance.toYear`] && 
                    "usa-form-group usa-form-group--error"}>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-9" htmlFor={"residency-attendance"}>From{" "}</label>
                    <KDDateInput pickerId={`residency[${idNum}].attendance.fromMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`residency[${idNum}].attendance.fromMonth`)}
                        errorHandler={errors} register={register} 
                        watch={watch} valueToWatch={`residency[${idNum}].attendance.fromYear`}
                        value={getValues()?.residency?.[idNum]?.attendance?.fromMonth}
                    />
                    
                    <KDDateInput pickerId={`residency[${idNum}].attendance.fromYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`residency[${idNum}].attendance.fromYear`)}
                        errorHandler={errors} register={register} 
                        watch={watch} valueToWatch={`residency[${idNum}].attendance.fromMonth`}
                        value={getValues()?.residency?.[idNum]?.attendance?.fromYear}
                    />
                </div>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-14" htmlFor={"residency-attendance"}>To{" "}</label>
                    <KDDateInput pickerId={`residency[${idNum}].attendance.toMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`residency[${idNum}].attendance.toMonth`)}
                        errorHandler={errors} register={register} 
                        watch={watch} valueToWatch={`residency[${idNum}].attendance.toYear`}
                        value={getValues()?.residency?.[idNum]?.attendance?.toMonth}
                    />
                    
                    <KDDateInput pickerId={`residency[${idNum}].attendance.toYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`residency[${idNum}].attendance.toYear`)}
                        errorHandler={errors} register={register}
                        watch={watch} valueToWatch={`residency[${idNum}].attendance.toMonth`}
                        value={getValues()?.residency?.[idNum]?.attendance?.toYear}
                    />
                </div>
                </div>
            </fieldset>

            <TextLimitLength label={"Residency Type "} register={register}
                name={`residency[${idNum}].programType`} 
                errors={errors} isRequired={false} minLength={1} maxLength={80}
            />

            <EducationDatePicker 
                pickerId={`residency[${idNum}].completionDate`}
                pickerLabel="Residency Completion Date "
                required={false}
                onHandleChange={handleDatePickerChange(`residency[${idNum}].completionDate`)}
                errorHandler={errors} register={register} 
                value={formData?.steps.educationTraining.data?.residency[idNum]?.completionDate}  
                updatedValue={getValues()?.residency?.[idNum]?.completionDate}
                validationType="notFutureDate"         
            />

            <div style={{height: "10px"}}></div>
            <CredInputFiles title="Residency Certificate" 
                description="Please attach your Residency certificate as a .pdf document" 
                fileId={`residency[${idNum}].evidenceFile.name`}
                required={false}
                register={register} errors={errors} setValue={setValue}
                value={getValues().residency?.[idNum]?.evidenceFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "30")}  
                documentTypeId={30} documentName={`residency[${idNum}].evidenceFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}

            />

            <div style={{height: "12px"}}></div>
            <EducationDatePicker 
                pickerId={`residency[${idNum}].postGraduateCompletionDate`}
                pickerLabel="Hospital Post - Graduate and Internship Completion Date"
                required={false}
                onHandleChange={handleDatePickerChange(`residency[${idNum}].postGraduateCompletionDate`)}
                errorHandler={errors} register={register}           
                value={formData?.steps.educationTraining.data?.residency[idNum]?.postGraduateCompletionDate} 
                updatedValue={getValues()?.residency?.[idNum]?.postGraduateCompletionDate}
                validationType="notFutureDate"
            />
        </form>
    </>
}

export default ResidencyFields;
