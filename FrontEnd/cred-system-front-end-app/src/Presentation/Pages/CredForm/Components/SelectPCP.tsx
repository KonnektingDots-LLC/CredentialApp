import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Radio } from "@trussworks/react-uswds";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { Specialty } from "../../../../Application/interfaces";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    name: string;
    trigger: () => void
    watch: (fieldName: string) => any
    radioValue?: string;
    selectPCPValue?: string;
    setValue:  UseFormSetValue<ExtendedFieldValues>
    specialtyList: Specialty[] | undefined
    selectSpecialtyValue?: string;
    primaryCareList: Specialty[] | undefined
}

const SelectPCP = ({ register, errors, name, watch, setValue, selectPCPValue, selectSpecialtyValue, 
    radioValue, specialtyList, primaryCareList }: Props) => {
    const [option, setOption] = useState(radioValue);
    const [selectPCPOption, setSelectPCPOption] = useState(selectPCPValue);
    const [selectSpecialtyOption, setSelectSpecialtyOption] = useState(selectSpecialtyValue);
    
    const handleOption = (key: string) => (data: ChangeEvent<HTMLInputElement>) => {
        setOption(data.target.value);
        setValue(key, data.target.value, {shouldValidate: true, shouldDirty: true});
    }
    const selectedOption = watch(name);

    const handleSelectPCPOption = (data: ChangeEvent<HTMLSelectElement>) => {
        setSelectPCPOption(data.target.value);
        setValue('specifyPrimaryCareId', data.target.value, {shouldValidate: true, shouldDirty: true});
    }

    const handleSelectSpecialtyOption = (data: ChangeEvent<HTMLSelectElement>) => {
        setSelectSpecialtyOption(data.target.value);
        setValue('typeOfSpecialistId', data.target.value, {shouldValidate: true, shouldDirty: true});
    }

    useEffect(()=> {
        if (selectSpecialtyValue) {
            setSelectSpecialtyOption(selectSpecialtyValue);
        }
        if (selectPCPValue) {
            setSelectPCPOption(selectPCPValue);
        }
    },[]);
    
    return (
        <div className={errors[name] && "usa-form-group usa-form-group--error"} style={errors[name] && {marginLeft: "-8px"}}>
            <div className={errors[name] ? "flex flex-col sm:flex-row mt-2 -ml-3" : "flex flex-col sm:flex-row mt-2"}>               
                <fieldset className="mr-10">
                    <label>PCP or Specialist:{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={name}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -mb-1" role="alert">
                            {message}
                        </p>
                        )}
                    />                    
                    <Radio id="rb-pcp"
                            {...register(name, {
                                required: "You must select one."
                            })}
                            name={name}
                            label="PCP"
                            value={1}
                            onChange={handleOption(name)}
                            checked={option === "1"}
                    />
                    <Radio id="rb-specialist"
                            {...register(name, {
                                required: "You must select one."
                            })}
                            name={name}
                            label="Specialist"
                            value={2}
                            onChange={handleOption(name)}
                            checked={option === "2"}
                    />
                </fieldset>
                { selectedOption === '1' &&
                    <div className="flex flex-col flex-grow ml-4 sm:ml-0 mt-2">
                        <label className="flex flex-row mb-1" htmlFor={'specifyPrimaryCareId'}>
                            Specify Primary Care: {" "}
                            <span className="text-red-error">*</span>
                        </label>
                        <ErrorMessage
                            errors={errors} name={'specifyPrimaryCareId'}
                            render={({ message }) => (
                                <p className="font-bold text-red-error mb-1" role="alert">
                                    {message}
                                </p>
                            )}
                        />
                        <select
                            {...register('specifyPrimaryCareId', {
                                required: "You must select a PCP"
                            })}
                            className={errors['specifyPrimaryCareId'] ? " border-red-error border-4 h-8 w-48" 
                                : " border-black border h-8 w-48"}
                            value={selectPCPOption}
                            onChange={handleSelectPCPOption}
                        >
                            <option value={""}></option>
                            {primaryCareList?.map((opt) => {
                            return <>
                                <option value={opt.id}>{opt.name}</option>
                            </>
                    })}
                        </select>
                    </div>
                    }
                {selectedOption === "2" && 
                    <div className="flex flex-col flex-grow ml-4 sm:ml-0 mt-2">
                        <label className="flex flex-row mb-1" htmlFor={'typeOfSpecialistId'}>
                        Specify type of Specialist:{" "}
                            <span className="text-red-error">*</span>
                        </label>
                        <ErrorMessage
                            errors={errors} name={'typeOfSpecialistId'}
                            render={({ message }) => (
                                <p className="font-bold text-red-error mb-1" role="alert">
                                    {message}
                                </p>
                            )}
                        />
                        <select
                            {...register('typeOfSpecialistId', {
                                required: "You must select a PCP"
                            })}
                            className={errors['typeOfSpecialistId'] ? " border-red-error border-4 h-8 w-48" 
                                : " border-black border h-8 w-48"}
                            value={selectSpecialtyOption}
                            onChange={handleSelectSpecialtyOption}
                        >
                            <option value={""}></option>
                            {specialtyList?.map((pcp) => {
                                return <>
                                    <option value={pcp.id}>{pcp.name}</option>
                                    </>
                            })}
                        </select>
                    </div>
                }
            </div>
        </div>
        
    )
};

export default SelectPCP;
