import { Radio } from "@trussworks/react-uswds";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";

interface RadioGroupProps {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    onChange: (data: ChangeEvent<HTMLInputElement>) => void
    name: string
    defaultValue?: string;
    optionLabels: string[];
    ids: string[];
    label: string;
    required: boolean;
}

const RadioGroup = ({register, errors, onChange, name, defaultValue,
    optionLabels, ids, label, required}:RadioGroupProps) => {

    return (
        <fieldset>
        <div className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label>{label}{" "}{required && <span className="text-red-error">*</span>}</label>
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                <p className="font-bold text-red-error -my-1" role="alert">
                    {message}
                </p>
                )}
            />            
            {optionLabels.map((label, i )=> (
                <Radio id={`rb-option-${ids[i]}-${name}`}
                {...register(name, required ? {
                    required: "You must select an option"
                } : {})}
                name={name}
                label={label}
                value={ids[i]}
                onChange={onChange}
                checked={ids[i] === defaultValue}
            />
            ))}
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
    )
};

export default RadioGroup;