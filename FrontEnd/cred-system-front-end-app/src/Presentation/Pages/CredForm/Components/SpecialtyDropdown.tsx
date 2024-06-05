import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import Select from 'react-select';
import { Specialty } from "../../../../Application/interfaces";
import { useEffect, useState } from "react";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    name: string;
    width?: number,
    label: string
    required: boolean
    value?: number[];
    list: Specialty[] | undefined
}

const SpecialtyDropdown = ({ register, errors, name, setValue, label, required, value, list }: Props) => {
    const options = list?.map(plan => ({ value: plan.id, label: plan.name })) || [];
    const [_, setSelectedOptions] = useState(options.filter(option => value?.includes(option.value)));
    const [hasEffectRun, setHasEffectRun] = useState(false);

    const handleChange = (newSelectedOptions: any) => {
        const selectedValues = newSelectedOptions.map((option: any) => option.value);
        setValue(name, selectedValues, { shouldValidate: true, shouldDirty: true });
        setSelectedOptions(newSelectedOptions);
    };

    useEffect(() => {
        if (!hasEffectRun && options.length > 0) {
            setSelectedOptions(options.filter(option => value?.includes(option.value)));
            setHasEffectRun(true);
        }
    }, [value, options]);

    return (
        <fieldset>
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
                <Select
                    {...register(name, required ?{
                        required: "You must select one."
                    } : {})}
                    isMulti
                    name={name}
                    options={options}
                    className={errors[name] ? "react-select-container-error" : "react-select-container"}
                    classNamePrefix="react-select"
                    onChange={handleChange}
                    value={options.filter(option => value?.includes(option.value))}
                    styles={{ control: (provided) => ({
                        ...provided,
                        borderColor: "black",
                        borderRadius: "0px",
                        '&:hover': {
                            borderColor: 'black',
                        }
                    })}}
                />
            </div>
        </fieldset>
    );
};


export default SpecialtyDropdown;
