import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { useEffect, useState } from "react";
import { InsuranceCarrierName } from "../../../../Application/interfaces";
import TextLimitLength from "../../../../Application/sharedComponents/InputText/TextLimitLength";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    name: string;
    width?: number,
    label: string
    required: boolean
    value?: string;
    list: InsuranceCarrierName[] | undefined;
    sectionName: string;
}

const SelectInsuranceName = ({ register, errors, name, setValue, 
    width, label, required, value, list, sectionName }: Props) => {
    const [option, setOption] = useState(value);
    
    const handleChange = (data: any) => {
        setValue(name, data.target.value,  {shouldValidate: true, shouldDirty: true });
        setOption(data.target.value);
    }

    useEffect(()=> {
        if (value) {
            setOption(value);
        }
    },[value]);

    return (
        <>
    <fieldset style={width !== undefined ? {width: `${width}px`} : {}}>
        <div className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label className="flex flex-row mb-1" htmlFor={name}>
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
                {...register(name, required ?{
                    required: "You must select one."
                } : {})}
                className={errors[name]
                    ? " border-red-error w-full border-4 h-8"
                    : " border-black w-full border h-8"}
                value={parseInt(option ?? "")}
                onChange={handleChange}
            >
                <option value={""}></option>
                {list?.map((insurance) => {
                    return <>
                        <option value={insurance.id}>{insurance.name}</option>
                        </>
                    })}
            </select>
        </div>
        </fieldset>
        {(parseInt(option ?? "") === list?.find((value) => value.name === "Other")?.id) &&
            <TextLimitLength label={"Specify Insurance Carrier Name"} register={register} 
                name={sectionName === "malpractice" ? 
                    "malpractice.malpracticeCarrierOther" 
                    : "professionalLiability.professionalLiabilityCarrierOther"} 
                errors={errors} minLength={1} maxLength={255}
                isRequired={(parseInt(option ?? "") === list?.find((value) => value.name === "Other")?.id)}
            />
        }
    </>
)};

export default SelectInsuranceName;
