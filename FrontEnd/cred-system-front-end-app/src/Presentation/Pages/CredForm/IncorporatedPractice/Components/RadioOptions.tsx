import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { Radio } from "@trussworks/react-uswds";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    onChange: (data: ChangeEvent<HTMLInputElement>) => void
    name: string
    defaultValue?: string;
    idNum: number
}
const RadioOptions = ({ register, errors, onChange, name, defaultValue, idNum }: Props) => (
    <fieldset>
        <div className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label>Provider Specialty:{" "}<span className="text-red-error">*</span></label>
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                <p className="font-bold text-red-error -my-1" role="alert">
                    {message}
                </p>
                )}
            />            
            <Radio id={`rb-${idNum}-primary-care`}
                {...register(name, {
                    required: "You must select an option"
                })}
                name={name}
                label="Primary Care"
                value="1"
                onChange={onChange}
                checked={"1" === defaultValue}
            />
            <Radio id={`rb-${idNum}-specialty-care`}
                name={name}
                label="Specialty Care"
                value="2"
                onChange={onChange}
                checked={"2" === defaultValue}
            />
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
);

export default RadioOptions