import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../utils/constants";

interface Props {
    label: string
    register: UseFormRegister<ExtendedFieldValues>
    name: string
    errors: FieldErrors<ExtendedFieldValues>
    isRequired: boolean
    width?: number
    errorMessage?: string
    ifOptionalMessage?: string
    zipcodeVal?: string;
    extensionName: string;
    extensionVal?: string;
}
const ZipCodeInput = ({ label, register, name, errors, isRequired, ifOptionalMessage,
    width, errorMessage = "This field is required", zipcodeVal, extensionName, extensionVal}: Props) => (
    <fieldset style={width !== undefined ? {width: `${width}px`} : {}}>
    { isRequired ?
        <div className={errors[name] ? "usa-form-group usa-form-group--error" : "flex flex-col gap-1"}>
            <label className={"-mb-2"} htmlFor={name}>
                {label}{" "}
                <span className="text-red-error">*</span>
            </label>
             <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
             Zip code extension is optional.
            </p>
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                <p className="font-bold text-red-error" role="alert">
                    {message}
                </p>
                )}
            />
            <ErrorMessage
                errors={errors} name={extensionName}
                render={({ message }) => (
                <p className="font-bold text-red-error" role="alert">
                    {message}
                </p>
                )}
            />
            <div className="flex flex-row gap-1 items-center">
                <input
                    id={name}
                    className={
                        errors[name]
                        ? " border-red-error border-4 h-8 w-12"
                        : " border-black border h-8 w-12"
                        }
                    type={"text"}
                    {...register(name, {
                        required: errorMessage,
                        maxLength: {
                            value: 5,
                            message: `Zip Code must be 5 digits`,
                        },
                        pattern: {
                            value: /^[0-9]{5}$/,
                            message: "Invalid format",
                        },
                        minLength: {
                            value: 5,
                            message: `Zip Code must be 5 digits`,
                        },
                    })}
                    maxLength={5}
                    aria-invalid={errors[name] ? "true" : "false"} 
                    defaultValue={zipcodeVal}
                    autoComplete="random-string"
                />
                <p className={`text-2xl`}>
                    -
                </p>
                <input
                    id={extensionName}
                    className={
                        errors[extensionName]
                        ? " border-red-error border-4 h-8 w-10"
                        : " border-black border h-8 w-10"
                        }
                    type={"text"}
                    {...register(extensionName, {
                        required: extensionVal && errorMessage,
                        maxLength: {
                            value: 4,
                            message: `Zip Code extension must be 4 digits`,
                        },
                        pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Invalid format",
                        },
                        minLength: {
                            value: 4,
                            message: `Zip Code extension must be 4 digits`,
                        },
                    })}
                    maxLength={4}
                    aria-invalid={errors[extensionName] ? "true" : "false"} 
                    defaultValue={extensionVal}
                    autoComplete="random-string"
                />
            </div>
        </div> : <>
            <label className="flex gap-2 items-center" htmlFor={name}>
            {label} <p className="text-gray-50 text-sm">{ifOptionalMessage}</p>
            </label>
            <div className="flex flex-row gap-1 items-center">
                <input
                    id={name}
                    className={" border-black border h-8 w-12"}
                    type={"text"}
                    {...register(name, {
                        maxLength: {
                            value: 5,
                            message: `Zip Code must be 5 digits`,
                        },
                        pattern: {
                            value: /^[0-9]{5}$/,
                            message: "Invalid format",
                        },
                        minLength: {
                            value: 5,
                            message: `Zip Code must be 5 digits`,
                        },
                    })}
                    maxLength={5}
                    aria-invalid={errors[name] ? "true" : "false"} 
                    defaultValue={zipcodeVal}
                    autoComplete="random-string"
                />
                <p className={`text-2xl`}>
                    -
                </p>
                <input
                    id={extensionName}
                    className={" border-black border h-8 w-10"}
                    type={"text"}
                    {...register(extensionName, {
                        maxLength: {
                            value: 4,
                            message: `Zip Code extension must be 4 digits`,
                        },
                        pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Invalid format",
                        },
                        minLength: {
                            value: 4,
                            message: `Zip Code extension must be 4 digits`,
                        },
                    })}
                    maxLength={4}
                    aria-invalid={errors[extensionName] ? "true" : "false"} 
                    defaultValue={extensionVal}
                />
            </div>
        </>
    }
    </fieldset> 
);

export default ZipCodeInput;
