import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues, defaultFellowshipStruct } from "../../../../../Application/utils/constants";
import { Fellowship, Form } from "../../../../Layouts/formLayout/credInterfaces";
import AddressFields from "./AddressFields";
import { AxiosInstance } from "axios";
import { Files } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { useState } from "react";
import { handleKeyDown, prepareDeleteFiles } from "../../../../../Application/utils/helperMethods";
import { FileToDelete } from "../../../../../Infraestructure/Services/form.service";
import { useDocumentInputStore } from "../../../../../Infraestructure/Store/documentStore";
import EducationDatePicker from "./EducationDatePicker";
import KDDateInput from "../../../../../Application/sharedComponents/KDDateInput";

interface Props {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>;
    setFilesToDelete: (value: React.SetStateAction<FileToDelete[] | undefined>) => void
}

const FellowshipFields = ({idNum, formData, api, setFilesDetail, setFilesToDelete}:Props) => {
    const { register, formState: { errors }, setValue, watch, getValues, reset } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const [newFileName, setNewFileName] = useState<string[]>([]);
    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName[idNum] !== formData?.steps?.educationTraining?.data?.fellowship?.[idNum]?.evidenceFile?.name) {
                oldFilename = formData?.steps.educationTraining.data?.fellowship?.[idNum]?.evidenceFile.name
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
        const filePath = [`fellowship[${idNum}].evidenceFile.documentTypeId`];
        const file = prepareDeleteFiles(filePath, findByPathName);
        setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...file] : [...file]);

        const currentValues = getValues(); 
        currentValues.fellowship = defaultFellowshipStruct as Fellowship[];
        reset(currentValues, { keepDirty: true });
    };

    return <>
        <form autoComplete="off" onKeyDown={handleKeyDown}>
            <div className="flex justify-between">
                <label>
                    Required fields are marked with an asterisk{"("}
                    <span className="text-red-error">*</span>
                    {") "}
                </label>
                {getValues()?.fellowship?.length === 1 && idNum === 0 &&
                <button type="button" className="usa-button usa-button--outline" onClick={handleClearFields}>Clear</button>}
            </div>

            <TextLimitLength label={"Fellowship Institution Name "} register={register}
                name={`fellowship[${idNum}].institutionName`} maxLength={80}
                errors={errors} isRequired={false} minLength={1}
            />

            <AddressFields formData={formData} idNum={idNum}
                api={api} sectionName="fellowship" required={false}   
            />

            <fieldset className="flex flex-col mt-3">
                <label className="-mb-4 flex items-center gap-2" htmlFor={"fellowship-attendance"}>
                    Attendance{" "}               
                </label>
                <div className={errors[`fellowship[${idNum}].attendance.fromMonth` && 
                    `fellowship[${idNum}].attendance.fromYear` &&  
                    `fellowship[${idNum}].attendance.toMonth` && 
                    `fellowship[${idNum}].attendance.toYear`] && 
                    "usa-form-group usa-form-group--error"}>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-9" htmlFor={"fellowship-attendance"}>
                    From{" "}
                    </label>
                    <KDDateInput pickerId={`fellowship[${idNum}].attendance.fromMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`fellowship[${idNum}].attendance.fromMonth`)}
                        errorHandler={errors} register={register} 
                        value={getValues().fellowship?.[idNum]?.attendance?.fromMonth}
                        watch={watch} valueToWatch={`fellowship[${idNum}].attendance.fromYear`}
                    />
                    
                    <KDDateInput pickerId={`fellowship[${idNum}].attendance.fromYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`fellowship[${idNum}].attendance.fromYear`)}
                        errorHandler={errors} register={register} 
                        value={getValues().fellowship?.[idNum]?.attendance?.fromYear}
                        watch={watch} valueToWatch={`fellowship[${idNum}].attendance.fromMonth`}
                    />
                </div>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-14" htmlFor={"fellowship-attendance"}>
                    To{" "}
                    </label>
                    <KDDateInput pickerId={`fellowship[${idNum}].attendance.toMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`fellowship[${idNum}].attendance.toMonth`)}
                        errorHandler={errors} register={register} 
                        value={getValues().fellowship?.[idNum]?.attendance?.toMonth}
                        watch={watch} valueToWatch={`fellowship[${idNum}].attendance.toYear`}
                    />
                    
                    <KDDateInput pickerId={`fellowship[${idNum}].attendance.toYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`fellowship[${idNum}].attendance.toYear`)}
                        errorHandler={errors} register={register} 
                        value={getValues().fellowship?.[idNum]?.attendance?.toYear}
                        watch={watch} valueToWatch={`fellowship[${idNum}].attendance.toMonth`}
                    />
                </div>
                </div>
            </fieldset>

            <TextLimitLength label={"Fellowship Type "} register={register}
                name={`fellowship[${idNum}].programType`} maxLength={80}
                errors={errors} isRequired={false} minLength={1}
            />

            <EducationDatePicker
                pickerId={`fellowship[${idNum}].completionDate`}
                pickerLabel="Fellowship/Training Completion Date "
                required={false}
                onHandleChange={handleDatePickerChange(`fellowship[${idNum}].completionDate`)}
                errorHandler={errors} register={register}           
                value={formData?.steps.educationTraining.data?.fellowship[idNum]?.completionDate} 
                updatedValue={getValues().fellowship?.[idNum]?.completionDate}
                validationType="notFutureDate"
            />

            <div style={{height: "10px"}}></div>
            <CredInputFiles title="Fellowship Evidence" 
                description="Please attach your Fellowship evidence as a .pdf document" 
                fileId={`fellowship[${idNum}].evidenceFile.name`}
                required={false}
                register={register} errors={errors} setValue={setValue}
                value={getValues().fellowship?.[idNum]?.evidenceFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "31")}
                documentTypeId={31} documentName={`fellowship[${idNum}].evidenceFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
        </form>
    </>
}

export default FellowshipFields;
