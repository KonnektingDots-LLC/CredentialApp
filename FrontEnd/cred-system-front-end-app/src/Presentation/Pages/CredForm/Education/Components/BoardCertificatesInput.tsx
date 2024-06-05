import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues, defaultBoardStruct } from "../../../../../Application/utils/constants";
import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { Form, boardCertificates } from "../../../../Layouts/formLayout/credInterfaces";
import SpecialtyDropdown from "../../Components/SpecialtyDropdown";
import { useState, useEffect } from "react";
import { Files, Specialty } from "../../../../../Application/interfaces";
import { getSpecialtyList } from "../../../../../Infraestructure/Services/dropdowns.service";
import { AxiosInstance } from "axios";
import { handleKeyDown, prepareDeleteFiles } from "../../../../../Application/utils/helperMethods";
import { FileToDelete } from "../../../../../Infraestructure/Services/form.service";
import { useDocumentInputStore } from "../../../../../Infraestructure/Store/documentStore";
import EducationDatePicker from "./EducationDatePicker";

interface Props {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>;
    setFilesToDelete: (value: React.SetStateAction<FileToDelete[] | undefined>) => void
}

const BoardCertificatesInput = ({idNum, formData, api, setFilesDetail, setFilesToDelete}: Props) => {
    const { register, formState: { errors }, setValue, reset, getValues } = useFormContext<ExtendedFieldValues>();
    const[list, setSpecialtyList] = useState<Specialty[] | undefined>(undefined);
    const [newFileName, setNewFileName] = useState<string[]>([]);
    const findByPathName = useDocumentInputStore(store => store.findByPathName)

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (newFileName[idNum] !== formData?.steps?.educationTraining?.data?.boardCertificates[idNum]?.certificateFile?.name) {
                oldFilename = formData?.steps.educationTraining.data?.boardCertificates?.[idNum]?.certificateFile?.name
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


    const handleSpecialtyBoardIssuedDatePickerChange = (value: string | undefined) => {
        if (value === "NaN-NaN-NaN") {
            setValue(`boardCertificates[${idNum}].issuedDate`, "", {shouldValidate: true, shouldDirty: true});
        } else {
            setValue(`boardCertificates[${idNum}].issuedDate`, value, {shouldValidate: true, shouldDirty: true});            
        }
    }

    const handleSpecialtyBoardExpDatePickerChange = (value: string | undefined) => {
        if (value === "NaN-NaN-NaN") {
            setValue(`boardCertificates[${idNum}].expirationDate`, "", {shouldValidate: true, shouldDirty: true});
        } else {
            setValue(`boardCertificates[${idNum}].expirationDate`, value, {shouldValidate: true, shouldDirty: true});
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const fetchSpecialtyList = await getSpecialtyList(api, 1);
            setSpecialtyList(fetchSpecialtyList);
        };
        fetchData();
    }, []);

    const handleClearFields = () => {
        const filePath = [`boardCertificates[${idNum}].certificateFile.documentTypeId`];
        const file = prepareDeleteFiles(filePath, findByPathName);
        setFilesToDelete(prevFiles => prevFiles ? [...prevFiles, ...file] : [...file]);

        const currentValues = getValues(); 
        currentValues.boardCertificates = defaultBoardStruct as boardCertificates[];
        reset(currentValues)
    };

    return <>
        <form autoComplete="off" onKeyDown={handleKeyDown}>
            <div className="flex justify-between">
                <label>Required fields are marked with an asterisk(*)</label>
                {getValues()?.boardCertificates?.length === 1 && idNum === 0 &&
                <button type="button" className="usa-button usa-button--outline" 
                onClick={handleClearFields}>Clear</button>}
            </div>
            <CredInputFiles fileId={`boardCertificates[${idNum}].certificateFile.name`}
                title="Board Certificate"
                description="Please attach a PDF file of a copy of your Board Certificate"
                required={false}
                register={register}
                errors={errors}
                setValue={setValue}
                value={getValues().boardCertificates?.[idNum]?.certificateFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "20")}
                documentTypeId={20} documentName={`boardCertificates[${idNum}].certificateFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />

            <SpecialtyDropdown register={register} errors={errors} setValue={setValue} 
                name={`boardCertificates[${idNum}].specialtyBoard`} label={"Specialty Board"} 
                required={false} list={list} width={480}
                // value={formData?.steps?.educationTraining?.data?.boardCertificates?.[idNum]?.specialtyBoard}
                value={getValues().boardCertificates?.[idNum]?.specialtyBoard}
            />

            <EducationDatePicker 
                pickerId={`boardCertificates[${idNum}].issuedDate`}
                pickerLabel="Provide Specialty Board Issued Date"
                register={register}
                required={false}
                onHandleChange={handleSpecialtyBoardIssuedDatePickerChange}
                errorHandler={errors}
                value={formData?.steps.educationTraining.data?.boardCertificates?.[idNum]?.issuedDate}
                updatedValue={getValues().boardCertificates?.[idNum]?.issuedDate}
            />

            <div className="mt-5"></div>
            <EducationDatePicker 
                pickerId={`boardCertificates[${idNum}].expirationDate`}
                pickerLabel="Provide Specialty Board Expiration Date"
                register={register}
                required={false}
                onHandleChange={handleSpecialtyBoardExpDatePickerChange}
                errorHandler={errors}
                value={formData?.steps.educationTraining.data?.boardCertificates?.[idNum]?.expirationDate}
                updatedValue={getValues().boardCertificates?.[idNum]?.expirationDate}
                validationType="expiration"
            />
        </form>
        
    </>
}

export default BoardCertificatesInput;
