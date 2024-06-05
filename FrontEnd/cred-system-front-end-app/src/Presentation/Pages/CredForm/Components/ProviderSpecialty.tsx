import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { Radio } from "@trussworks/react-uswds";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    name: string
    setValue:  UseFormSetValue<ExtendedFieldValues>
    watch: (fieldName: string) => any
}
const ProviderSpecialty = ({ register, errors, setValue, watch, name }: Props) => {
    
    const handleOption = (key: string) => (data: ChangeEvent<HTMLInputElement>) => {
        setValue(key, data.target.value, {shouldValidate: true, shouldDirty: true});
    }

    const selectedOption = watch('careTypeId')

    return (
        <fieldset style={{marginTop: "10px"}}>
            <div className={errors[name] && "usa-form-group usa-form-group--error"}>
                <label>Provider Specialty:{" "}<span className="text-red-error">*</span></label>
                <ErrorMessage
                    errors={errors} name={name}
                    render={({ message }) => (
                    <p className="font-bold text-red-error -mb-1" role="alert">
                        {message}
                    </p>
                    )}
                />                
                <Radio id="rb-primary-care"
                        {...register(name)}
                        name={name}
                        label="Primary Care"
                        value="primary-care"
                        onChange={handleOption(name)}
                        checked={selectedOption === "1"}
                />
                <Radio id="rb-specialty-care"
                        {...register(name)}
                        name={name}
                        label="Specialty Care"
                        value="specialty-care"
                        onChange={handleOption(name)}
                        checked={selectedOption === "2"}
                />
            </div>
        </fieldset>
)};

export default ProviderSpecialty