import { useFormContext } from "react-hook-form";
import { Form } from "../../../../Layouts/formLayout/credInterfaces";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { useEffect, useState } from "react";
import { State } from "../../../../../Application/interfaces";
import { getStates } from "../../../../../Infraestructure/Services/dropdowns.service";
import { AxiosInstance } from "axios";
import ZipCodeInput from "../../../../../Application/sharedComponents/InputText/ZipCodeInput";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { ErrorMessage } from "@hookform/error-message";

interface PhysicalAddressProps {
    idNum: number;
    isMail?: boolean;
    formData: Form | undefined;
    api: AxiosInstance
}

const PhysicalAddressFields = ({ idNum, isMail = false, formData, api }:PhysicalAddressProps) => {
    const { register, formState: { errors }, setValue, clearErrors, setError } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const[statesList, setStatesList] = useState<State[] | undefined>(undefined);

    const [option, setOption] = useState(formData?.steps?.addressesLocations?.data?.values?.[idNum]?.addressInfo?.[`${isMail ? "mail":"physical"}`]?.stateId)
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
                    setValue(`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`, puertoRico.id, { shouldDirty: true });
                }
            }
        };
        fetchData();
    }, []);

    return <>
        <label>
            Required fields are marked with an asterisk{"("}
            <span className="text-red-error">*</span>
            {") "}
        </label>
        <div style={{height: "24px"}}></div>

        <TextLimitLength register={register} errors={errors} 
            name={`values[${idNum}].addressInfo.${isMail ? "mail.name":"physical.name"}`} 
            label={"Address Name "} isRequired={true}
            maxLength={50} minLength={1}
        />
        
        <TextLimitLength register={register} errors={errors}
            name={`values[${idNum}].addressInfo.${isMail ? "mail.address1":"physical.address1"}`}
            label={"Street address 1 "} isRequired={true} maxLength={60} minLength={1}
        />
        
        <TextLimitLength register={register} errors={errors} 
            name={`values[${idNum}].addressInfo.${isMail ? "mail.address2":"physical.address2"}`} 
            label={"Street address 2 "} isRequired={false} maxLength={60} minLength={1}
        />

        <TextLimitLength register={register} errors={errors} 
            name={`values[${idNum}].addressInfo.${isMail ? "mail.city":"physical.city"}`} 
            label={"City "} isRequired={true} minLength={1} maxLength={60}
        />

        <div style={{height: "12px"}}></div>
        <fieldset>
            <label htmlFor={`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`}>
                State, territory, or military post{" "}
                <span className="text-red-error">*</span>
            </label>
            <ErrorMessage
                errors={errors} name={`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`}
                render={({ message }) => (
                <p className="font-bold text-red-error pb-2" role="alert">
                    {message}
                </p>
                )}
            />
            <select
                key={`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`}
                {...register(`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`, {
                    required: "State is required",
                    })}
                className={errors[`values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`]
                ? " border-red-error w-full border-4 h-8"
                :" border-black border w-full h-8"}
                onChange={(data) => handleUpdateInput(data, `values[${idNum}].addressInfo.${isMail ? "mail.stateId":"physical.stateId"}`)}
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

        <ZipCodeInput register={register} errors={errors}
           name={`values[${idNum}].addressInfo.${isMail ? "mail.zipcode" : "physical.zipcode"}`}
           label={"ZIP Code "} isRequired={true}
           extensionName={`values[${idNum}].addressInfo.${isMail ? "mail.zipcodeExtension" : "physical.zipcodeExtension"}`}
        />
    </>
}

export default PhysicalAddressFields;