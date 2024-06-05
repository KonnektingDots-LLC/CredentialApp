import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { Radio } from "@trussworks/react-uswds";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    name: string;
    onChange: (data: ChangeEvent<HTMLInputElement>) => void
    label: string;
}

const RadioFormSetup = ({ register, errors, name, onChange, label }: Props) => {

    return (
        <div className="flex flex-col sm:flex-row items-center mt-4">
            <fieldset>
                <label>{label}{" "}<span className="text-red-error">*</span></label>
                <Radio id={`rb-${name}-yes`}
                        {...register(name, {
                            required: "You must select one."
                        })}
                        name={name}
                        label="Yes"
                        value="Yes"
                        onChange={onChange}
                />
                <Radio id={`rb-${name}-no`}
                        name={name}
                        label="No"
                        value="No"
                        onChange={onChange}
                />
                <ErrorMessage
                    errors={errors} name={name}
                    render={({ message }) => (
                    <p className="font-bold text-red-error mt-2" role="alert">
                        {message}
                    </p>
                    )}
                />
            </fieldset>
        </div>
    )
};

export default RadioFormSetup;
