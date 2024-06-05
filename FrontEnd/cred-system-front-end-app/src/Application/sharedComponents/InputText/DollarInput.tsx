import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExtendedFieldValues } from "../../utils/constants";
import { MdOutlineAttachMoney } from "react-icons/md"

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
    maxLength: number
    minLength?: number
    ifOptionalMessage?: string
}
const DollarInput = ({ label, register, name, errors, isRequired, ifOptionalMessage, maxLength,
    width, caption, captionBelow, errorMessage = "This field is required", minLength}: Props) => {

    return (
    <fieldset style={width !== undefined ? {width: `${width}px`} : {}}>
    { isRequired ?
        <div className={errors[name] ? "usa-form-group usa-form-group--error" : "flex flex-col gap-1"}>
            <label className={caption === undefined ? "-mb-1" : "-mb-2"} htmlFor={name}>
                {label}{" "}
                <span className="text-red-error">*</span>
            </label>
            {caption !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
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
            <div className="flex flex-row items-center -ml-4">
                <MdOutlineAttachMoney size={20}/>
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
                        pattern: {
                            value: /^\d*\.?\d{0,2}$/,
                            message: "Invalid amount",
                        },
                        maxLength: {
                            value: maxLength,
                            message: `${maxLength} characters allowed`,
                        },
                        minLength: {
                            value: minLength ? minLength : maxLength,
                            message: `${minLength ? minLength : maxLength} characters allowed`,
                        },
                    })}
                    maxLength={maxLength}
                    aria-invalid={errors[name] ? "true" : "false"} 
                />
            </div>
            {captionBelow !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                {captionBelow}
            </p> : <></>}
        </div> : <>
            <label className="flex gap-2 items-center" htmlFor={name}>
            {label} <p className="text-gray-50 text-sm">{ifOptionalMessage}</p>
            </label>
            <div className="flex flex-row items-center -ml-4">
                <MdOutlineAttachMoney size={20}/>
                <input
                    className=" border-black border w-full h-8"
                    type={"text"} id={name}
                    maxLength={maxLength}
                    {...register(name, { 
                        pattern: {
                            value: /^\d*\.?\d{0,2}$/,
                            message: "Invalid amount",
                        },
                        maxLength: {
                            value: maxLength,
                            message: `${maxLength} characters allowed`,
                        },
                        minLength: {
                            value: minLength ? minLength : maxLength,
                            message: `${minLength ? minLength : maxLength} characters allowed`,
                        },
                    })}
                />
            </div>
            {captionBelow !== undefined ? <p className={`text-gray-50 text-sm w-[${width || 385}px]`}>
                {captionBelow}
            </p> : <></>}
        </>
    }
    </fieldset> 
)};

export default DollarInput;