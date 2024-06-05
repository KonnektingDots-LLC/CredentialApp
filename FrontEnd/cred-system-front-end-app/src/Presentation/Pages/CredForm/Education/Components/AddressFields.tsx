import { useFormContext } from "react-hook-form";
import { AxiosInstance } from "axios";
import { useState, useEffect } from "react";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { Country, State } from "../../../../../Application/interfaces";
import { Form } from "../../../../Layouts/formLayout/credInterfaces";
import ZipCodeInput from "../../../../../Application/sharedComponents/InputText/ZipCodeInput";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { ErrorMessage } from "@hookform/error-message";
import { useQueryClient } from "@tanstack/react-query";

interface AddressProps {
    formData: Form | undefined;
    api: AxiosInstance;
    addressName?: boolean;
    sectionName: "medicalSchool" | "internship" | "residency" | "fellowship";
    idNum: number;
    required: boolean
    optionalMessage?: string
}

const AddressFields = ({ formData, addressName, sectionName, idNum, required, optionalMessage }:AddressProps) => {
    const { register, formState: { errors }, setValue } = useFormContext<ExtendedFieldValues>(); // use this instead of the props

    const [stateOption, setStateOption] = useState(formData?.steps.educationTraining.data?.[`${sectionName}`]?.[idNum]?.addressInfo?.stateId);
    const stateOtherOption = formData?.steps.educationTraining.data?.[`${sectionName}`]?.[idNum]?.addressInfo?.stateOther ?? "";
    const [countryOption, setCountryOption] = useState(formData?.steps.educationTraining.data?.[`${sectionName}`]?.[idNum]?.addressInfo?.addressCountryId);
    const [showStateInput, setShowStateInput] = useState(stateOption === "56" ?? false);

    const countryList = useQueryClient().getQueryData<Country[]>(['countries']);
    const statesList = useQueryClient().getQueryData<State[]>(['states']);

    const handleStateInput = (data: any, key: string) => {
        if (countryOption === "" && stateOption == statesList?.find((h) => h.name === "Other")?.id) {
            setValue(`${sectionName}[${idNum}].addressInfo.stateId`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
            setStateOption("");
            setShowStateInput(false);
            return;
        }
        setValue(key, parseInt(data.target.value));
        setStateOption(data.target.value);
        if ((data.target.value as string).length === 0) {
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setShowStateInput(false);
            return;
        }

        if (data.target.value == statesList?.find((h) => h.name === "Other")?.id) {
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
            setShowStateInput(true);
            return;
        } else if (data.target.value == statesList?.find((h) => h.name === "Puerto Rico")?.id) {
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            setShowStateInput(false);
            setValue(`${sectionName}[${idNum}].addressInfo.addressCountryId`, countryList?.find((h) => h.name === "Puerto Rico")?.id.toString());
            setCountryOption(countryList?.find((h) => h.name === "Puerto Rico")?.id.toString());
            return;
        }
        else {
            setValue(`${sectionName}[${idNum}].addressInfo.addressCountryId`, countryList?.find((h) => h.name === "United States")?.id.toString());
            setCountryOption(countryList?.find((h) => h.name === "United States")?.id.toString());
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setShowStateInput(false);
            return;
        }
    }

    const handleCountryInput = (data: any, key: string) => {
        setValue(key, parseInt(data.target.value));
        setCountryOption(data.target.value);

        if ((data.target.value as string).length === 0) {
            if (stateOption == statesList?.find((h) => h.name === "Other")?.id) {
                setStateOption("");
                setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
                setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
                setValue(`${sectionName}[${idNum}].addressInfo.stateId`, null);
                setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
                setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
                setShowStateInput(false);
                return;
            }
            return;
        }

        if (data.target.value == countryList?.find((h) => h.name === "United States")?.id) {
            setStateOption("");
            setValue(`${sectionName}[${idNum}].addressInfo.stateId`, null);
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            // clearErrors(`${sectionName}[${idNum}].addressInfo.stateOther`);
            // clearErrors(`${sectionName}[${idNum}].addressInfo.internationalCode`);
            setShowStateInput(false);      
            return;      
        } else if (data.target.value == countryList?.find((h) => h.name === "Puerto Rico")?.id) {
            setValue(`${sectionName}[${idNum}].addressInfo.stateId`, statesList?.find((h) => h.name === "Puerto Rico")?.id.toString());
            setStateOption(statesList?.find((h) => h.name === "Puerto Rico")?.id.toString());
            setValue(`${sectionName}[${idNum}].addressInfo.stateOther`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.internationalCode`, "");
            // clearErrors(`${sectionName}[${idNum}].addressInfo.stateOther`);
            // clearErrors(`${sectionName}[${idNum}].addressInfo.internationalCode`);
            setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
            setShowStateInput(false); 
            return;
        } else {
            setValue(`${sectionName}[${idNum}].addressInfo.stateId`, statesList?.find((h) => h.name === "Other")?.id.toString())
            setStateOption(statesList?.find((h) => h.name === "Other")?.id.toString());
            setValue(`${sectionName}[${idNum}].addressInfo.zipcode`, "");
            setValue(`${sectionName}[${idNum}].addressInfo.zipcodeExtension`, "");
            setShowStateInput(true);
            return;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (stateOption === "0") {
                setStateOption("");
            }
        };
        fetchData();
    }, []);

    return <>
        {addressName && 
            <TextLimitLength  register={register} errors={errors} 
                name={`${sectionName}[${idNum}].addressInfo.name`}
                label={"Address Name "} ifOptionalMessage={optionalMessage}
                isRequired={required} minLength={1} maxLength={80}
            />
        }
        
        <TextLimitLength  register={register} errors={errors} 
            name={`${sectionName}[${idNum}].addressInfo.address1`} 
            label={"Street address 1 "} ifOptionalMessage={optionalMessage}
            isRequired={required} maxLength={60} minLength={1}
        />
        
        <TextLimitLength register={register} errors={errors} 
            name={`${sectionName}[${idNum}].addressInfo.address2`} 
            label={"Street address 2 "} ifOptionalMessage={"(optional)"}
            isRequired={false} maxLength={60} minLength={1}
        />

        <TextLimitLength  register={register} errors={errors} 
            name={`${sectionName}[${idNum}].addressInfo.city`} 
            label={"City "} ifOptionalMessage={optionalMessage}
            isRequired={required} maxLength={60} minLength={1}
        />

        <div style={{height: "12px"}}></div>
        <fieldset>
            <div className="flex flex-col">
            <label htmlFor={`${sectionName}[${idNum}].addressInfo.stateId`}>
                State, territory, or military post{" "}
                {required ? <span className="text-red-error">*</span> :
                    <p className="text-gray-50 text-sm w-72">
                    {optionalMessage}
                    </p>
                }
            </label>
            <ErrorMessage
                errors={errors} name={`${sectionName}[${idNum}].addressInfo.stateId`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <select
                key={`${sectionName}[${idNum}].addressInfo.stateId`}
                {...register(`${sectionName}[${idNum}].addressInfo.stateId`, {
                    required: required ? "State is required" : undefined,
                    })}
                className={errors[`${sectionName}[${idNum}].addressInfo.stateId`]
                    ? " border-red-error w-2/4 border-4 h-8"
                    :" border-black border w-2/4 h-8"}
                onChange={(data) => handleStateInput(data, `${sectionName}[${idNum}].addressInfo.stateId`)}
                // disabled={showStateInput || stateOption == statesList?.find((h) => h.name === "Other")?.id}
                value={stateOption}
                >
                <option value={""}></option>
                {statesList?.map((state) => {
                    return <>
                        <option value={state.id}>{state.name}</option>
                    </>
                })}
            </select>
            </div>
        </fieldset>
        <fieldset>
        {showStateInput && <div>
            <label htmlFor={`${sectionName}[${idNum}].addressInfo.stateOther`}>
                Please, specify Other state, territory, or military post here: {" "}
                {required  ? <span className="text-red-error">*</span> :
                    <p className="text-gray-50 text-sm w-72">
                    {optionalMessage}
                    </p>
                }
            </label>
            <ErrorMessage
                errors={errors} name={`${sectionName}[${idNum}].addressInfo.stateOther`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <input
                {...register(`${sectionName}[${idNum}].addressInfo.stateOther`, {
                    required: required ? "This field is required" : undefined
                })}
                className={errors[`${sectionName}[${idNum}].addressInfo.stateOther`]
                    ? "border-red-error w-2/4 border-4 h-8"
                    : "border-black border w-2/4 h-8"}
                defaultValue={stateOtherOption}
                maxLength={60} 
                minLength={1}
            />
        </div>}
        </fieldset>

        {showStateInput ? 
            <TextLimitLength  register={register} errors={errors} 
                name={`${sectionName}[${idNum}].addressInfo.internationalCode`} 
                label={"Postal Code "} ifOptionalMessage={optionalMessage}
                isRequired={required} maxLength={10} minLength={1} width={330}
            />
            : <ZipCodeInput  register={register} errors={errors}
                name={`${sectionName}[${idNum}].addressInfo.zipcode`}
                label={"ZIP Code "} ifOptionalMessage={optionalMessage}
                isRequired={required}
                extensionName={`${sectionName}[${idNum}].addressInfo.zipcodeExtension`}
            />
        }
        <fieldset>
            <div className="flex flex-col">
            <label htmlFor={`${sectionName}[${idNum}].addressInfo.addressCountryId`}>
                Country{" "}
                {required ? <span className="text-red-error">*</span> :
                    <p className="text-gray-50 text-sm w-72">
                    {optionalMessage}
                    </p>
                }
            </label>
            <ErrorMessage
                errors={errors} name={`${sectionName}[${idNum}].addressInfo.addressCountryId`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <select
                key={`${sectionName}[${idNum}].addressInfo.addressCountryId`}
                {...register(`${sectionName}[${idNum}].addressInfo.addressCountryId`, {
                    required: required ? "Country is required" : undefined,
                    })}
                className={errors[`${sectionName}[${idNum}].addressInfo.addressCountryId`]
                    ? " border-red-error w-2/4 border-4 h-8"
                    :" border-black border w-2/4 h-8"}
                onChange={(data) => handleCountryInput(data, `${sectionName}[${idNum}].addressInfo.addressCountryId`)}
                value={countryOption}
                >
                <option value={""}></option>
                {countryList?.map((country) => {
                    return <>
                        <option value={country.id}>{country.name}</option>
                    </>
                })}
            </select>
            </div>
        </fieldset>
    </>
}

export default AddressFields;
