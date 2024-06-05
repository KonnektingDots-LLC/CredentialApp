import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { useEffect, useState } from "react";
import { HospitalPrivilegesType } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    name: string
    label: string
    value?: string
    list: HospitalPrivilegesType[] | undefined
    required: boolean
}
const SelectHospitalPriviliges = ({ register, errors, name, setValue, label, value, list, required }: Props) => {
    const [option, setOption] = useState(value);
    
    const handleOption = (key: string) => (event: any) => {
        setOption(event.target.value);
        setValue(key, event.target.value, {shouldValidate: true, shouldDirty: true});
    }
    
    useEffect(()=> {
        if (value) {
            setOption(value);
        }
    },[value])

    return (
        <>
            <fieldset>
                <div className={errors[name] ? 
                    "usa-form-group usa-form-group--error flex flex-col w-[450px]" 
                    : "flex flex-col w-[450px]"}>

                    <label>
                        {label}{" "}
                        {required && <span className="text-red-error">*</span>}
                    </label>
                    <ErrorMessage
                        errors={errors} name={name}
                        render={({ message }) => (
                        <p className="font-bold text-red-error mb-1" role="alert">
                            {message}
                        </p>
                        )}
                    />
                    <select
                        {...register(name, required ? {
                            required: "You must select a Hospital Privileges"
                        } : {})}
                        className={errors[name]
                            ? " border-red-error border-4 h-8" 
                            : " border-black border h-8"}
                        value={option}
                        onChange={handleOption(name)}
                    >
                        <option value={""}></option>
                        {list?.map((type) => {
                            return <>
                                <option value={type.id}>{type.name}</option>
                                </>
                            })}
                    </select>
                </div>
            </fieldset>
            {(parseInt(option ?? "") === list?.find((h) => h.name === "Other")?.id) &&
            <TextLimitLength label={"Please specify Other Privileges Type"} 
                name={name.includes("primary") ? "primary.hospitalPrivilegesTypeOther" 
                    : "secondary.hospitalPrivilegesTypeOther"} 
                errors={errors} register={register} width={475} minLength={1} maxLength={255}
                isRequired={(parseInt(option ?? "") === list?.find((h) => h.name === "Other")?.id)} 
            />}
        </>
)};

export default SelectHospitalPriviliges;