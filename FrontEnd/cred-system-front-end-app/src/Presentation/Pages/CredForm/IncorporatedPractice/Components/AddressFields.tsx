import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { AxiosInstance } from "axios";
import { useState, useEffect } from "react";
import { IncorporatedPracticeProfile } from "../../../../Layouts/formLayout/credInterfaces";
import { State } from "../../../../../Application/interfaces";
import { getStates } from "../../../../../Infraestructure/Services/dropdowns.service";
import InputTextField from "../../../../../Application/sharedComponents/InputText/InputTextField";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import ZipCodeInput from "../../../../../Application/sharedComponents/InputText/ZipCodeInput";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { ErrorMessage } from "@hookform/error-message";

interface AddressProps {
    formData: IncorporatedPracticeProfile | undefined;
    api: AxiosInstance;
    addressName?: boolean;
    register: UseFormRegister<ExtendedFieldValues>;
    setValue: UseFormSetValue<ExtendedFieldValues>;
    errors: FieldErrors<ExtendedFieldValues>;
    isMail?: boolean;
    idNum: number;
    prefix: "addressInfo" | "employerIDAddressInfo";
    setError: UseFormSetError<ExtendedFieldValues>;
    clearErrors: UseFormClearErrors<ExtendedFieldValues>;
}

const AddressFields = ({ register, errors, setValue, formData, prefix, api, 
    addressName, isMail = false, idNum, setError, clearErrors }:AddressProps) => {
   
    const[statesList, setStatesList] = useState<State[] | undefined>(undefined);
    const [statesLoad, setStatesLoad] = useState(false);

    const [option, setOption] = useState(prefix === "addressInfo" ? 
        formData?.values?.[idNum]?.addressInfo?.[`${isMail ? "mail" : "physical"}`]?.stateId
        : formData?.values?.[idNum]?.employerIDAddressInfo?.physical?.stateId);
        
    const handleUpdateInput = (data: any, key: string) => {
        if (data.target.value === "") {
            setError(key, {
                type: "manual",
                message: "Please select a valid option"
            });
        }
        clearErrors(key);
        setValue(key, data.target.value, { shouldDirty: true });
        setOption(data.target.value);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!statesLoad) {
                const fetchStateList: State[] = await getStates(api);
                setStatesList(fetchStateList);
                setStatesLoad(true);

                if (!option) {
                    const puertoRico = fetchStateList?.find(state => state.name === "Puerto Rico");
        
                    if (puertoRico) {
                        setOption(puertoRico.id.toString());
                        setValue(`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`, puertoRico.id, { shouldDirty: true });
                    }
                }
            }
        };
        fetchData();
    }, []);

    return <>
        {addressName && 
            <InputTextField  register={register} errors={errors} 
                name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.name`} ifOptionalMessage="(optional)"
                label={"Address Name "}
                type={"text"} isRequired={true}
            />
        }
        
        <TextLimitLength  register={register} errors={errors} 
            name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.address1`} 
            label={"Street address 1 "} maxLength={60} isRequired={true} minLength={1}
        />
        
        <TextLimitLength  register={register} errors={errors} 
            name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.address2`} 
            label={"Street address 2 "} maxLength={60} isRequired={false} minLength={1}
        />

        <TextLimitLength  register={register} errors={errors} 
            name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.city`} 
            label={"City "}isRequired={true} minLength={1} maxLength={60}
        />

        <div style={{height: "12px"}}></div>
        <fieldset>
            <label htmlFor={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`}>
                State, territory, or military post{" "}
                <span className="text-red-error">*</span>
            </label>
            <ErrorMessage
                errors={errors} name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <select
                key={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`}
                {...register(`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`, {
                    required: "State is required",
                    })}
                className={errors[`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`]
                ? " border-red-error w-full border-4 h-8"
                :" border-black border w-full h-8"}
                onChange={(data) => handleUpdateInput(data, `values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.stateId`)}
                value={option}
                >
                <option value={""}></option>
                {statesList?.map((state) => {
                    return <>
                        <option value={state.id}>{state.name}</option>
                    </>
                })}
            </select>
        </fieldset>

        <ZipCodeInput  register={register} errors={errors} 
            name={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.zipcode`} 
            label={"ZIP Code "} isRequired={true}
            extensionName={`values[${idNum}].${prefix}.${isMail ? `mail` : `physical`}.zipcodeExtension`}
        />
    </>
}

export default AddressFields;