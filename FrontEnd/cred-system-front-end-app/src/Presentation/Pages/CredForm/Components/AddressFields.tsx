import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { AxiosInstance } from "axios";
import { useState, useEffect } from "react";
import { State } from "../../../../Application/interfaces";
import { getStates } from "../../../../Infraestructure/Services/dropdowns.service";
import InputTextField from "../../../../Application/sharedComponents/InputText/InputTextField";
import { F330Interface, PCPInterface } from "../../../Layouts/formLayout/credInterfaces";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import ZipCodeInput from "../../../../Application/sharedComponents/InputText/ZipCodeInput";
import TextLimitLength from "../../../../Application/sharedComponents/InputText/TextLimitLength";
import { ErrorMessage } from "@hookform/error-message";

interface AddressProps {
    formData: PCPInterface | F330Interface | undefined;
    states: State[] | undefined;
    api: AxiosInstance;
    addressName?: boolean;
    register: UseFormRegister<ExtendedFieldValues>;
    setValue: UseFormSetValue<ExtendedFieldValues>;
    errors: FieldErrors<ExtendedFieldValues>;
    isMail?: boolean;
    setError: UseFormSetError<ExtendedFieldValues>;
    clearErrors: UseFormClearErrors<ExtendedFieldValues>;
}

const AddressFields = ({ register, errors, setValue, formData, states, api, addressName, isMail = false, setError, clearErrors}:AddressProps) => {
    const[statesList, setStatesList] = useState<State[] | undefined>(states);


    const [option, setOption] = useState(formData?.addressInfo?.[`${isMail ? "mail" : "physical"}`]?.stateId);
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
            const fetchStateList: State[] = await getStates(api);
            setStatesList(fetchStateList);

            if (!option) {
                const puertoRico = fetchStateList?.find(state => state.name === "Puerto Rico");
    
                if (puertoRico) {
                    setOption(puertoRico.id.toString());
                    setValue(`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`, puertoRico.id.toString(), { shouldDirty: true });
                }
            }
        };
        fetchData();
    }, []);

    return <>
        {addressName && 
            <InputTextField  register={register} errors={errors} 
                name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.name`} ifOptionalMessage="(optional)"
                label={"Address Name "}
                type={"text"} isRequired={true}
            />
        }
        
        <TextLimitLength  register={register} errors={errors} 
            name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.address1`} 
            label={"Street address 1 "} isRequired={true} maxLength={60} minLength={1}
        />
        
        <TextLimitLength  register={register} errors={errors} 
            name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.address2`} 
            label={"Street address 2 "} maxLength={60} isRequired={false} minLength={1}
        />

        <TextLimitLength  register={register} errors={errors} 
            name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.city`} 
            label={"City "} isRequired={true} minLength={1} maxLength={60}
        />

        <div style={{height: "12px"}}></div>
        <fieldset>
            <label htmlFor={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`}>
                State, territory, or military post{" "}
                <span className="text-red-error">*</span>
            </label>
            <ErrorMessage
                errors={errors} name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <select
                key={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`}
                {...register(`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`, {
                    required: "State is required",
                    })}
                className={errors[`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`]
                ? " border-red-error w-full border-4 h-8"
                :" border-black border w-full h-8"}
                onChange={(data) => handleUpdateInput(data, `${isMail ? `addressInfo.mail` : `addressInfo.physical`}.stateId`)}
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
            name={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.zipcode`} 
            label={"ZIP Code "} isRequired={true}
            extensionName={`${isMail ? `addressInfo.mail` : `addressInfo.physical`}.zipcodeExtension`}
        />
    </>
}

export default AddressFields;
