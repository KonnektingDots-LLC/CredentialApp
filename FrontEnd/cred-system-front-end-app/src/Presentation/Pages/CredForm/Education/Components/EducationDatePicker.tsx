import { DatePicker } from "@trussworks/react-uswds";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { ErrorMessage } from "@hookform/error-message";
import { isNotExpired, isNotFutureDate, isOver18 } from "../../../../../Application/utils/helperMethods";
import { useEffect, useState } from "react";
import { DatePickerProps } from "@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker";

interface KDDatePickerProps {
    pickerId: string;
    pickerLabel: string;
    required: boolean;
    onHandleChange: (val?: string | undefined) => void;
    errorHandler: FieldErrors<ExtendedFieldValues>
    register: UseFormRegister<ExtendedFieldValues>
    value?: string;
    updatedValue: string;
    validationType?: "age" | "expiration" | "notFutureDate";
    optionalMessage?: string;
}

const EducationDatePicker = ({pickerId, pickerLabel, required, onHandleChange, errorHandler, 
    register, value, validationType, optionalMessage, updatedValue}:KDDatePickerProps) => {

     const [showDefault, setShowDefault] = useState(true);
    const handleDateChange = (val: string | number | Date) => {
        const date = new Date(val);
    
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
        onHandleChange(formattedDate);
    }

    const isValidDate = (dateString: string) => {
        const regex = /^(?:(?:19|20)\d\d-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:19|20)([2468][048]|[13579][26])-(?:0[1-9]|1[0-2])-29)$/;
        return regex.test(dateString);
    };

    useEffect(() => {
        if (updatedValue) {
            setShowDefault(true);
        } else {
            setShowDefault(false);
        }
    }, [value, updatedValue]);

    return <>
        <fieldset className="w-2/5">
            <div className={errorHandler[pickerId] && "usa-form-group usa-form-group--error"}>
                <div className="flex min-w-max gap-1">
                    <label 
                        {...register(pickerId, {
                            required: required ? "This field is required" : undefined,
                            validate: required ? value => {
                                if (!isValidDate(value)) {
                                    return "Invalid date format";
                                }
                                if (validationType === "age") {
                                    return isOver18(value) || "You must be over 18 years old";
                                } else if (validationType === "expiration") {
                                    return isNotExpired(value) || "Expired date";
                                } else if (validationType === "notFutureDate") {
                                    return isNotFutureDate(value) || "Date cannot be in the future"
                                }
                            } : undefined
                        })}
                        htmlFor={pickerId}>
                        {pickerLabel}{" "}
                    </label>
                    {required ? <span className="text-red-error">*</span> : 
                        <p className="text-gray-50 text-sm mt-1">{optionalMessage}</p>}
                </div>
                <ErrorMessage
                    errors={errorHandler} name={pickerId}
                    render={({ message }) => (
                    <p className="font-bold text-red-error" role="alert">
                        {message}
                    </p>
                    )}
                />
                <div style={{width: "320px"}}>

                    {showDefault ? (
                        <DatePickerDefault
                            id={pickerId}
                            name={pickerId}
                            onChange={(e: any) => handleDateChange(e)}
                            aria-invalid={
                                required ? (errorHandler[pickerId] ? "true" : "false") : "false"
                            }
                            defaultValue={value}
                        />
                    ) : (
                        <DatePickerValue
                            id={pickerId}
                            name={pickerId}
                            onChange={(e: any) => handleDateChange(e)}
                            aria-invalid={
                                required ? (errorHandler[pickerId] ? "true" : "false") : "false"
                            }
                            value={updatedValue}
                        />
                    )}
                </div>
            </div>
        </fieldset>
    </>
}

const DatePickerDefault = ({ id, name, onChange, defaultValue, ...props }: DatePickerProps) => {

    return <DatePicker
        id={id}
        name={name}
        onChange={onChange}
        aria-invalid={props["aria-invalid"]}
        defaultValue={defaultValue}
        placeholder="MM/DD/YYYY"
        readOnly
    />
};

const DatePickerValue = ({ id, name, onChange, value, ...props }: DatePickerProps) => {

    return <DatePicker
        id={id}
        name={name}
        onChange={onChange}
        aria-invalid={props["aria-invalid"]}
        value={value}
        placeholder="MM/DD/YYYY"
        readOnly
        className={props.className}
    />
};

export default EducationDatePicker;
