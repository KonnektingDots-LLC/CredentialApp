import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../utils/constants";

interface NumberLimitLengthProps {
    label: string;
    register: UseFormRegister<ExtendedFieldValues>;
    name: string;
    errors: FieldErrors<ExtendedFieldValues>;
    isRequired: boolean;
    width?: number;
    caption?: string;
    captionBelow?: string;
    errorMessage?: string;
    ifOptional?: boolean;
    maxLength: number;
    minLength?: number;
    defaultValue?: string;
}

const NumberLimitLength = (
    // prettier-ignore
    { label, register, name, errors, isRequired, ifOptional, maxLength, caption, captionBelow, 
      errorMessage = "This field is required", minLength, defaultValue, width }: NumberLimitLengthProps
) => {
    // TODO: refactor component so the `isRequired` decision rendering is clear
    // e.g. if required, render the one with required code, otherwise render non-required version

    return (
        <fieldset style={width !== undefined ? { width: `${width}px` } : {}}>
            {isRequired ? (
                <div
                    className={
                        errors[name]
                            ? "usa-form-group usa-form-group--error"
                            : "flex flex-col gap-1"
                    }
                >
                    <label className={caption === undefined ? "-mb-1" : "-mb-2"} htmlFor={name}>
                        {label} <span className="text-red-error">*</span>
                    </label>
                    {caption && (
                        <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>{caption}</p>
                    )}
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="font-bold text-red-error pb-2" role="alert">
                                {message}
                            </p>
                        )}
                    />

                    <input
                        id={name}
                        className={
                            errors[name]
                                ? " border-red-error w-full border-4 h-8"
                                : " border-black w-full border h-8"
                        }
                        type={"text"}
                        {...register(name, {
                            required: errorMessage,
                            maxLength: {
                                value: maxLength,
                                message: `${maxLength} characters allowed`,
                            },
                            pattern: {
                                value: new RegExp(`^[0-9]{1,${maxLength}}$`),
                                message: "Only numbers allowed",
                            },
                            minLength: {
                                value: minLength ? minLength : maxLength,
                                message: `Minimum ${minLength ? minLength : maxLength} characters allowed`,
                            },
                        })}
                        maxLength={maxLength}
                        aria-invalid={errors[name] ? "true" : "false"}
                        defaultValue={defaultValue}
                    />

                    {captionBelow && (
                        <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                            {captionBelow}
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <label className="flex gap-2 items-center" htmlFor={name}>
                        {label}{" "}
                        <p className="text-gray-50 text-sm">
                            {ifOptional ? "(optional)" : "(if apply)"}
                        </p>
                    </label>
                    <input
                        className=" border-black border w-full h-8"
                        type={"text"}
                        id={name}
                        maxLength={maxLength}
                        {...register(name, {
                            minLength: {
                                value: maxLength,
                                message: `Minimum ${maxLength} characters allowed`,
                            },
                            pattern: {
                                value: new RegExp(`^[0-9]{1,${maxLength}}$`),
                                message: "Only numbers allowed",
                            },
                            maxLength: {
                                value: maxLength,
                                message: `Maximum ${maxLength} characters allowed`,
                            },
                        })}
                        defaultValue={defaultValue}
                    />
                    {captionBelow && (
                        <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                            {captionBelow}
                        </p>
                    )}
                </>
            )}
        </fieldset>
    );
};

export default NumberLimitLength;
