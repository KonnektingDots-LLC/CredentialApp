import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ExtendedFieldValues } from '../../../../../Application/utils/constants';
import CredInputFiles from '../../../../../Application/sharedComponents/CredInputFile';
import KDDatePicker from '../../../../../Application/sharedComponents/KDDatePicker';

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    fileLabel: string
    fileId: string
    dateId: string
    dateLabel: string
    setValue: UseFormSetValue<ExtendedFieldValues>
    required: boolean
    onDateChange: (val?: string) => void;
    dateValue?: string;
    fileValue?: string;
    onHandleUpdatedFiles: (files: File[]) => void;
    documentTypeId: number;
    documentName: string;
    onFileNameChange: (newFileName: string) => void;
}

const IdentificationFields = ({register, errors, setValue, fileId, fileLabel, 
    documentTypeId, documentName, dateId, dateLabel, required, onDateChange, 
    dateValue, fileValue, onHandleUpdatedFiles, onFileNameChange}: Props) => {

  return (
        <div>
            <CredInputFiles fileId={fileId}
                title={fileLabel}
                description={`Please attach a PDF file of a copy of your ${fileLabel}`}
                required={required} documentName={documentName}
                register={register} errors={errors} setValue={setValue}  
                value={fileValue} documentTypeId={documentTypeId}
                onHandleUpdatedFiles={onHandleUpdatedFiles}
                onFileNameChange={onFileNameChange}
            />
            <KDDatePicker 
                pickerId={dateId}
                pickerLabel={`Provide your ${dateLabel}`}
                required={required}
                onHandleChange={onDateChange}
                errorHandler={errors} register={register}   
                value={dateValue} validationType='expiration'                        
            />
        </div>
  );
};

export default IdentificationFields;
