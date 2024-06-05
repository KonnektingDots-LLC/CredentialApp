import { DateInput } from "@trussworks/react-uswds";
import { ChangeEventHandler } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { ExtendedFieldValues } from "../utils/constants";
import { isFutureDate, validateMonth, validateYear } from "../utils/helperMethods";
import { ErrorMessage } from "@hookform/error-message";

interface KDDateInputProps {
    pickerId: string;
    pickerLabel: string;
    required: boolean;
    unit: "month" | "year"
    onHandleChange: ChangeEventHandler<HTMLInputElement>
    errorHandler: FieldErrors<ExtendedFieldValues>
    register: UseFormRegister<ExtendedFieldValues>
    value?: string;
    watch: UseFormWatch<ExtendedFieldValues>
    valueToWatch: string;
    acceptFuture?: boolean;
}

const KDDateInput =({pickerId, pickerLabel, unit, onHandleChange,errorHandler, register,  
    value, required, watch, valueToWatch, acceptFuture = false}:KDDateInputProps) => {
        const valueWatch = watch(valueToWatch);

        const validateInput = (value: string) => {
            if (unit === "month") {
                if (!validateMonth(value)) {
                    return "Invalid";
                }
                if (valueToWatch && acceptFuture) {
                    return;
                }
                if (valueToWatch && isFutureDate(value, valueWatch)) {
                    return "Invalid";
                }
            } else if (unit === "year") {
                if (!validateYear(value, acceptFuture)) {
                    return "Invalid";
                }
                if (valueToWatch && acceptFuture) {
                    return;
                }
                if (valueWatch && isFutureDate(valueWatch, value)) {
                    return "Invalid";
                }
            }
            return true;
        };

    return <div className="flex flex-col">
            <label
            {...register(pickerId, {
                required: required ? "Required" : undefined,
                validate: required ? validateInput : undefined
            })}>
            </label>
            <DateInput
                id={pickerId}
                name={pickerId}
                aria-invalid={ errorHandler[pickerId] ? true : false} 
                label={pickerLabel} 
                unit={unit} 
                maxLength={unit === 'month' ? 2 : 4}   
                onChange={onHandleChange}
                placeholder={unit === 'month' ? 'mm' : 'yyyy'}
                defaultValue={value}
                type="number"
            />  
            <ErrorMessage
                errors={errorHandler} name={pickerId}
                render={({ message }) => (
                <p className="font-bold text-red-error -mb-1" role="alert">
                    {message}
                </p>
                )}
            />
    </div>
}

export default KDDateInput;