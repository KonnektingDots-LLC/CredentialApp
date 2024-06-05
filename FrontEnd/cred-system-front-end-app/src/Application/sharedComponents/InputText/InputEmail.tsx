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
    caption?: string
    captionBelow?: string
    errorMessage?: string
    ifOptional?: boolean
}
const InputEmail = ({ label, register, name, errors, isRequired, ifOptional,
    width, caption, captionBelow, errorMessage = "This field is required"}: Props) => (
    <fieldset style={width !== undefined ? {width: `${width}px`} : {}}>
    { isRequired ?
        <div className={errors[name] ? "usa-form-group usa-form-group--error" : "flex flex-col gap-1"}>
            <label className={caption === undefined ? "-mb-1" : "-mb-2"} htmlFor={name}>
                {label}{" "}
                <span className="text-red-error">*</span>
            </label>
            {caption !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px] mt-1`}>
                {caption}
            </p>: <></>}
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <input
                className={
                    errors[name]
                    ? " border-red-error w-full border-4 h-8"
                    : " border-black w-full border h-8"
                    }
                type={"text"}
                {...register(name, { required: errorMessage,
                    pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "Invalid email",
                    },
                    minLength: {
                        value: 1,
                        message: `1 characters allowed`,
                    },
                    maxLength: {
                        value: 100,
                        message: `100 characters allowed`,
                    }
                })}
                maxLength={100}
                aria-invalid={errors[name] ? "true" : "false"} 
            />
            {captionBelow !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                {captionBelow}
            </p> : <></>}
        </div> : <>
            <label className="flex gap-2 items-center" htmlFor={name}>
                {label} <p className="text-gray-50 text-sm">{ifOptional ? "(optional)" : "(if apply)"}</p>
            </label>
            <input
                className=" border-black border w-full h-8"
                type={"text"}
                {...register(name, {
                    pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "Invalid email",
                    },
                    minLength: {
                        value: 1,
                        message: `1 characters allowed`,
                    },
                    maxLength: {
                        value: 100,
                        message: `100 characters allowed`,
                    }
                })}
                maxLength={100}
            />
            {captionBelow !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                {captionBelow}
            </p> : <></>}
        </>
    }
    </fieldset> 
);

export default InputEmail