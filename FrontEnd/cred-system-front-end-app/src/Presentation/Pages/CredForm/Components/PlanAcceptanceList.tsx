import { ErrorMessage } from "@hookform/error-message";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";
import { PlanAcceptanceInterface } from "../../../../Application/interfaces";
import { useEffect } from "react";

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    name: string;
    list: PlanAcceptanceInterface[] | undefined
    setValue: UseFormSetValue<ExtendedFieldValues>
}

const PlanAcceptanceList = ({ register, errors, list, setValue }: Props) => {
    const options = list?.map(plan => ({ value: plan.id, label: plan.name })) || [];    

    useEffect(() => {
        setValue("planAccept", list?.map(option => option.id) || [], { shouldValidate: true, shouldDirty: true });
    }, [list, setValue])

    return (
        <div>
            <div className={errors["planAccept"] && "usa-form-group usa-form-group--error"}>
                <input 
                    {...register("planAccept", {
                        required: "This field is required.",
                        validate: value => {
                            if (value.length !== list?.length) {
                                return "This field is required.";
                            }
                        }
                    })}
                    name={"planAccept"}                     
                    id={`select-medical-plans`}
                    className="mb-2"
                    type="hidden"
                />     
                <div>
                    <h3 className="font-black mt-8">3. Plan Acceptance List
                    <span className="text-red-error">*</span></h3>
                </div>      
                <p className={`text-gray-50 text-sm ml-4 mt-2`}>
                    Your application will be sent to the following insurance companies:
                </p>
                <ErrorMessage
                    errors={errors} name={"planAccept"}
                    render={({ message }) => (
                        <p className="font-bold text-red-error mb-1 ml-4" role="alert">
                            {message}
                        </p>
                    )}
                    />
                </div>
            <fieldset>
                <div>
                    {options.length > 0 && (
                        <div className="flex flex-wrap mt-3">
                            {options.map((optionValue, i) => (
                                <span
                                    key={i}
                                    style={{ borderWidth: '1px', borderColor: '#DDE6ED' }}
                                    className="bg-gray-100 text-gray rounded-md px-2 py-1 mr-2 mb-2"
                                >
                                    {list?.find((plan) => plan.id === optionValue.value)?.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
};


export default PlanAcceptanceList;
