import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues, defaultInternshipStruct } from "../../../../../Application/utils/constants";
import { Form, Internship } from "../../../../Layouts/formLayout/credInterfaces";
import { AxiosInstance } from "axios";
import AddressFields from "./AddressFields";
import { Files } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { useState } from "react";
import { handleKeyDown, prepareDeleteFiles } from "../../../../../Application/utils/helperMethods";
import { FileToDelete } from "../../../../../Infraestructure/Services/form.service";
import { useDocumentInputStore } from "../../../../../Infraestructure/Store/documentStore";
import KDDateInput from "../../../../../Application/sharedComponents/KDDateInput";

interface Props {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>;
    setFilesToDelete: (value: React.SetStateAction<FileToDelete[] | undefined>) => void
}

const InternshipFields = ({idNum, formData, api, setFilesDetail, setFilesToDelete}:Props) => {
    const { register, formState: { errors }, setValue, watch, reset, getValues } = useFormContext<ExtendedFieldValues>();
    const [newFileName, setNewFileName] = useState<string[]>([]);
    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName[idNum] !== formData?.steps?.educationTraining?.data?.internship[idNum]?.evidenceFile?.name) {
                oldFilename = formData?.steps.educationTraining.data?.internship?.[idNum]?.evidenceFile.name
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

    const handleClearFields = () => {
        const filePath = [`internship[${idNum}].evidenceFile.documentTypeId`];
        const file = prepareDeleteFiles(filePath, findByPathName);
        setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...file] : [...file]);
        
        const currentValues = getValues(); 
        currentValues.internship = defaultInternshipStruct as Internship[];
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
                {getValues()?.internship?.length === 1 && idNum === 0 && 
                <button type="button" className="usa-button usa-button--outline" 
                onClick={handleClearFields}>Clear</button>}
            </div>

            <TextLimitLength label={"Internship Institution Name "} register={register}
                name={`internship[${idNum}].institutionName`} minLength={1}
                errors={errors} isRequired={false} maxLength={80}
            />

            <AddressFields formData={formData} idNum={idNum}
                api={api} sectionName="internship" required={false}
            />

            <fieldset className="flex flex-col mt-3">
                <label className="-mb-4" htmlFor={"internship-attendance"}>
                    Internship Attendance{" "}
                    {/* <span className="text-red-error">*</span> */}
                </label>
                <div className={errors[`internship[${idNum}].attendance.fromMonth` && 
                    `internship[${idNum}].attendance.fromYear` &&  
                    `internship[${idNum}].attendance.toMonth` && 
                    `internship[${idNum}].attendance.toYear`] && 
                    "usa-form-group usa-form-group--error"}>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-9" htmlFor={"internship-attendance"}>
                    From{" "}
                    </label>
                    <KDDateInput pickerId={`internship[${idNum}].attendance.fromMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`internship[${idNum}].attendance.fromMonth`)}
                        errorHandler={errors} register={register} 
                        value={getValues().internship?.[idNum]?.attendance?.fromMonth}
                        watch={watch} valueToWatch={`internship[${idNum}].attendance.fromYear`}
                    />
                    
                    <KDDateInput pickerId={`internship[${idNum}].attendance.fromYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`internship[${idNum}].attendance.fromYear`)}
                        errorHandler={errors} register={register} 
                        value={getValues().internship?.[idNum]?.attendance?.fromYear}
                        watch={watch} valueToWatch={`internship[${idNum}].attendance.fromMonth`}
                    />
                </div>
                <div className="flex gap-3">
                    <label className="mt-[9%] mr-14" htmlFor={"internship-attendance"}>
                    To{" "}
                    </label>
                    <KDDateInput pickerId={`internship[${idNum}].attendance.toMonth`}
                        pickerLabel={"Month "} unit={"month"} required={false}
                        onHandleChange={handleDateInputChange(`internship[${idNum}].attendance.toMonth`)}
                        errorHandler={errors} register={register} 
                        value={getValues().internship?.[idNum]?.attendance?.toMonth}
                        watch={watch} valueToWatch={`internship[${idNum}].attendance.toYear`}
                    />
                    
                    <KDDateInput pickerId={`internship[${idNum}].attendance.toYear`}
                        pickerLabel={"Year "} unit={"year"} required={false}
                        onHandleChange={handleDateInputChange(`internship[${idNum}].attendance.toYear`)}
                        errorHandler={errors} register={register} 
                        value={getValues().internship?.[idNum]?.attendance?.toYear}
                        watch={watch} valueToWatch={`internship[${idNum}].attendance.toMonth`}
                    />
                </div>
                </div>
            </fieldset>

            <TextLimitLength label={"Program Type "} register={register}
                name={`internship[${idNum}].programType`} maxLength={80}
                errors={errors} isRequired={false} minLength={1}
            />

            <div style={{height: "18px"}}></div>
            <CredInputFiles title="Internship Evidence" 
                description="Please attach your Internship evidence as a .pdf document" 
                fileId={`internship[${idNum}].evidenceFile.name`}
                required={false}
                register={register} errors={errors} setValue={setValue}
                value={getValues().internship?.[idNum]?.evidenceFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "29")}
                documentTypeId={29} documentName={`internship[${idNum}].evidenceFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
        </form>
    </>
}

export default InternshipFields;
