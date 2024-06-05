import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { useState } from "react";
import { entityTypeList } from "../../../../../Infraestructure/MockData";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    name: string;
    value?: string;
    required: boolean
}

const SelectInput = ({ register, errors, name, value, required, setValue }: Props) => {
    const [option, setOption] = useState(value);
    
    const handleOption = (key: string) => (event: any) => {
        setOption(event.target.value);
        setValue(key, event.target.value, {shouldValidate: true, shouldDirty: true});
    }
    return(
    <>
    <fieldset>
        <div className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label className="mr-[10%] flex flex-row" htmlFor={name}>
                Entity Type{" "}
                <span className="text-red-error">*</span>
            </label>
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                    <p className="font-bold text-red-error -mt-1" role="alert">
                        {message}
                    </p>
                )}
            />
            <select
                id={name}
                {...register(name, required ?{
                    required: "You must select an Entity Type"
                } : {})}
                className={errors[name] ? " border-red-error border-4 w-2/5 h-8" 
                    : " border-black border w-2/5 h-8"}
                    value={option}
                onChange={handleOption(name)}
            >
                <option value={""}></option>
                {entityTypeList.map((type) => {
                    return <>
                    <option value={type.id}>{type.name}</option>
                    </>
                })}
            </select>
        </div>
    </fieldset>
    {(parseInt(option ?? "") === entityTypeList?.find((h) => h.name === "Other")?.id) &&
            <TextLimitLength label={"Please specify Other Entity Type"} 
                name={'entityTypeOther'} minLength={1} maxLength={255}
                errors={errors} register={register} width={475}
                isRequired={(parseInt(option ?? "") === entityTypeList?.find((h) => h.name === "Other")?.id)} 
            />}
    </>
)};

export default SelectInput;
