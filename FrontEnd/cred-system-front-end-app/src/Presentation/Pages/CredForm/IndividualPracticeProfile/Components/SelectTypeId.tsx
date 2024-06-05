import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormUnregister, UseFormGetValues } from 'react-hook-form';
import { ExtendedFieldValues } from '../../../../../Application/utils/constants';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';
import IdentificationFields from './IdentificationFields';
import { useDocumentInputStore } from '../../../../../Infraestructure/Store/documentStore';
import { PAGES_NAME } from '../../../../../Application/utils/enums';
import { FileToDelete, postForm } from '../../../../../Infraestructure/Services/form.service';
import { useAxiosInterceptors } from '../../../../../Infraestructure/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import { Form } from '../../../../Layouts/formLayout/credInterfaces';
import { Files } from '../../../../../Application/interfaces';
import { getProvider } from '../../../../../Infraestructure/Hooks/useGetForm';

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    legalPermissionToWork: string
    idTypeValue?: string
    dateExp?: string;
    fileValue?: string;
    onHandleUpdatedFiles: (files: File[], docId: string) => void;
    setNewFileName: React.Dispatch<React.SetStateAction<string>>;
    unregister: UseFormUnregister<ExtendedFieldValues>;
    getValues: UseFormGetValues<ExtendedFieldValues>;
    deletedDocuments: FileToDelete[]
    filesDetail: Files[]
}

const SelectTypeId = ({register, errors, setValue, legalPermissionToWork, dateExp, 
    deletedDocuments, idTypeValue, fileValue, onHandleUpdatedFiles, setNewFileName, 
    getValues, unregister, filesDetail}: Props) => {

    const api = useAxiosInterceptors();
    const provider = getProvider(sessionStorage);
    const formData = useQueryClient().getQueryData<Form>(['formData', provider?.providerId]);

    const [currentSelectedCitizenTypeID, setCurrentSelectedCitizenTypeID] = useState<string|undefined>(idTypeValue ?? "4");
    const findByName = useDocumentInputStore(state => state.findByPathName);
    
    const handleTypeOfIDForCitizenSelection = async (event: any) => {
        setCurrentSelectedCitizenTypeID(event.target.value);
        setValue("idType", event.target.value,  {shouldValidate: true, shouldDirty: true });

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
        register("idFile.documentTypeId", { required: "This field is required."});
        register("idFile.name", { required: "This field is required."});
        register("idExpDate", { required: "This field is required."});
        
        if (findByName(selectedIdType.documentIdType)?.documentExist){
            if (formData) {
                formData.steps.individualPracticeProfile.data = getValues();
                formData.setup.currentStep = PAGES_NAME.Individual;

                await postForm(
                    api, formData.setup.providerId,
                    formData, [], deletedDocuments
                )
            }
        }
    };

    const handleDateInputChange  = (key: string) => (value: string | undefined) => {
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
      };

    return (
        <>
            <fieldset className="flex flex-col">
                <label htmlFor="idType">Select Type of ID{" "}
                    <span className="text-red-error">*</span>
                </label>
                <ErrorMessage 
                    errors={errors}
                    name="idType"
                    render={({ message }) => (
                    <p className=" font-bold text-red-error" role="alert">
                        {message}
                    </p>
                    )}
                />
                <select
                    className={
                        errors["idType"]
                            ? " border-red-error border-4 h-8 w-96 mb-2"
                            : " border-black border h-8 w-96 mb-2"
                    }
                    {...register("idType", {required: "This field is required."})}
                    value={currentSelectedCitizenTypeID}
                    onChange={handleTypeOfIDForCitizenSelection}
                >   
                    <option value={""}></option>
                    <option value={4}>Driver's License</option>
                    <option value={5}>REAL ID</option>
                    <option value={6}>Passport</option>
                    <option value={7}>
                        U.S. Department of Defense Common Access Card
                    </option>
                    <option value={8}>
                        U.S. Tribal or Bureau of Indian Affairs Tribal Identification Card
                    </option>
                </select>
            </fieldset>
            {currentSelectedCitizenTypeID === "4" &&
                <IdentificationFields 
                    register={register} errors={errors} setValue={setValue}
                    fileLabel={"Driver's License"} 
                    fileId={"idFile.name"} 
                    dateId={"idExpDate"} 
                    dateLabel={"Driver's License Expiration Date"} 
                    required={legalPermissionToWork === "1"} 
                    onDateChange={handleDateInputChange("idExpDate")}
                    dateValue={dateExp}
                    fileValue={fileValue}
                    onHandleUpdatedFiles={(f) => onHandleUpdatedFiles(f, "4")}
                    documentTypeId={4}
                    documentName='idFile.documentTypeId'
                    onFileNameChange={handleFileNameChange}
                />
            }
            {currentSelectedCitizenTypeID === "5" && 
                <IdentificationFields 
                    register={register} errors={errors} setValue={setValue}
                    fileLabel={"REAL ID"} 
                    fileId={"idFile.name"} 
                    dateId={"idExpDate"} 
                    dateLabel={"REAL ID Expiration Date"} 
                    required={legalPermissionToWork === "1"} 
                    onDateChange={handleDateInputChange("idExpDate")}
                    dateValue={dateExp}
                    fileValue={fileValue}
                    onHandleUpdatedFiles={(f) => onHandleUpdatedFiles(f, "5")}
                    documentTypeId={5}
                    documentName='idFile.documentTypeId'
                    onFileNameChange={handleFileNameChange}
                />
            }
            {currentSelectedCitizenTypeID === "6" && 
                <IdentificationFields 
                    register={register} errors={errors} setValue={setValue}
                    fileLabel={"Passport"} 
                    fileId={"idFile.name"} 
                    dateId={"idExpDate"} 
                    dateLabel={"Passport Expiration Date"} 
                    required={legalPermissionToWork === "1"} 
                    onDateChange={handleDateInputChange("idExpDate")}
                    dateValue={dateExp}
                    fileValue={fileValue}
                    onHandleUpdatedFiles={(f) => onHandleUpdatedFiles(f, "6")}
                    documentTypeId={6}
                    documentName='idFile.documentTypeId'
                    onFileNameChange={handleFileNameChange}
                />
            }
            {currentSelectedCitizenTypeID === "7" && 
                <IdentificationFields 
                    register={register} errors={errors} setValue={setValue}
                    fileLabel={"U.S. Department of Defense Common Access Card"} 
                    fileId={"idFile.name"} 
                    dateId={"idExpDate"} 
                    dateLabel={"U.S. Department of Defense Common Access Card Expiration Date"} 
                    required={legalPermissionToWork === "1"} 
                    onDateChange={handleDateInputChange("idExpDate")}
                    dateValue={dateExp}
                    fileValue={fileValue}
                    onHandleUpdatedFiles={(f) => onHandleUpdatedFiles(f, "7")}
                    documentTypeId={7}
                    documentName='idFile.documentTypeId'
                    onFileNameChange={handleFileNameChange}
                />
            }
            {currentSelectedCitizenTypeID === "8" && 
                <IdentificationFields 
                    register={register} errors={errors} setValue={setValue}
                    fileLabel={"U.S. Tribal or Bureau of Indian Affairs Tribal Identification Card"} 
                    fileId={"idFile.name"} 
                    dateId={"idExpDate"} 
                    dateLabel={"U.S. Tribal or Bureau of Indian Affairs Tribal Identification Card Expiration Date"} 
                    required={legalPermissionToWork === "1"} 
                    onDateChange={handleDateInputChange("idExpDate")}
                    dateValue={dateExp}
                    fileValue={fileValue}
                    onHandleUpdatedFiles={(f) => onHandleUpdatedFiles(f, "8")}
                    documentTypeId={8}
                    documentName='idFile.documentTypeId'
                    onFileNameChange={handleFileNameChange}
                />
            }
        </>
    );
};

export default SelectTypeId;
