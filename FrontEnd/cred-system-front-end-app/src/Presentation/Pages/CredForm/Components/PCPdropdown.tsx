import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { Specialty } from "../../../../Application/interfaces";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    name: string;
    selectValue?: string;
    setValue:  UseFormSetValue<ExtendedFieldValues>
    list: Specialty[]
}

const PCPDropdown = ({ register, errors, name, setValue, selectValue, list }: Props) => {
    const [selectOption, setSelectOption] = useState(selectValue);

    const handleSelectOption = (data: ChangeEvent<HTMLSelectElement>) => {
        setSelectOption(data.target.value);
        setValue(name, data.target.value, {shouldValidate: true, shouldDirty: true});
    }

    useEffect(()=> {
        if (selectValue) {
            setSelectOption(selectValue);
        }
    },[selectValue]);

    return (
        <fieldset>
            <div className={errors[name] && "usa-form-group usa-form-group--error"} style={errors[name] && {marginLeft: "-8px"}}>
                <div className="flex flex-col flex-grow ml-4 sm:ml-0 mt-2">
                    <label className="flex flex-row mb-1" htmlFor={name}>
                        Specify Primary Care: {" "}
                        <span className="text-red-error">*</span>
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
                        {...register(name, {
                            required: "You must select a PCP"
                        })}
                        className={errors[name] ? " border-red-error border-4 h-8 w-48" 
                            : " border-black border h-8 w-48"}
                        value={selectOption}
                        onChange={handleSelectOption}
                    >
                        <option value={""}></option>
                    {list?.map((opt) => {
                    return <>
                        <option value={opt.id}>{opt.name}</option>
                        </>
                    })}
                    </select>
                </div>
            </div>
        </fieldset>
    )
};

export default PCPDropdown;
