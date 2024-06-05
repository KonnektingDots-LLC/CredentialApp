import { TimePicker, Checkbox  } from "@trussworks/react-uswds";
import { ChangeEvent, useState } from "react";
import { ServiceHours } from "../../../../Layouts/formLayout/credInterfaces";
import { UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";

interface ServiceHoursInputProps {
    setValue: UseFormSetValue<ExtendedFieldValues>
    formData: ServiceHours[] | undefined;
    idNum?: number;
    dayOfWeek: number;
}

const ServiceHoursInput = ({setValue, formData, idNum = 0, dayOfWeek}:ServiceHoursInputProps) => {

    const [isClosed, setIsClosed] = useState(formData?.[dayOfWeek]?.isClosed);

    const day = (dayOfWeek: number) => {
        switch(dayOfWeek) {
            case 0:
                return "Monday"
            case 1:
                return "Tuesday"
            case 2:
                return "Wednesday"
            case 3:
                return "Thursday"
            case 4: 
                return "Friday"
            case 5: 
                return "Saturday"
            case 6: 
                return "Sunday"
        }
    }

    const handleServiceHoursChange = (data: string | undefined, key: string) => {
        setValue(`${key}`, data ?? "", { shouldDirty: true, shouldValidate: true});
    }

    const handleClosedDays = (data: ChangeEvent<HTMLInputElement>) => {
        setIsClosed(data.target.checked);
        setValue(`values[${idNum}].serviceHours[${dayOfWeek}].isClosed`, data.target.checked ?? false, { shouldDirty: true, shouldValidate: true});
        setValue(`values[${idNum}].serviceHours[${dayOfWeek}].hourFrom`, "", { shouldDirty: true, shouldValidate: true});
        setValue(`values[${idNum}].serviceHours[${dayOfWeek}].hourTo`, "", { shouldDirty: true, shouldValidate: true});
    }

    return <>
        <div className="flex flex-col gap-y-5">
            <div id="monday-container" className="flex items-center">
                <label className="items-center text-thin text-lg w-20 mt-2">
                    {day(dayOfWeek)}
                </label>
                <div className="flex flex-col ml-[5%]">
                    <label className="flex gap-x-2 items-center">
                        From
                        <p className="text-gray-50 text-base">{'('}hh:mm{')'}</p>
                    </label>
                    <TimePicker id={`values[${idNum}].serviceHours[${dayOfWeek}].hourFrom`}
                        className="-mt-8"
                        name={`values[${idNum}].serviceHours[${dayOfWeek}].hourFrom`}
                        onChange={(data) => handleServiceHoursChange(data, `values[${idNum}].serviceHours[${dayOfWeek}].hourFrom`)}
                        disabled={isClosed}
                        defaultValue={formData?.[dayOfWeek]?.hourFrom}
                    />
                </div>
                <div className="flex flex-col ml-[3%]">
                    <label className="flex gap-x-2 items-center">
                        To
                        <p className="text-gray-50 text-base">{'('}hh:mm{')'}</p>
                    </label>
                    <TimePicker id={`values[${idNum}].serviceHours[${dayOfWeek}].hourTo`}
                        className="-mt-8"
                        name={`values[${idNum}].serviceHours[${dayOfWeek}].hourTo`}
                        onChange={(data) => handleServiceHoursChange(data, `values[${idNum}].serviceHours[${dayOfWeek}].hourTo`)}
                        disabled={isClosed}
                        defaultValue={formData?.[dayOfWeek]?.hourTo}
                    />
                </div>
                <div className="flex flex-col ml-[3%] mt-3">
                    <Checkbox id={`values[${idNum}].serviceHours[${dayOfWeek}].isClosed`} 
                        name={`values[${idNum}].serviceHours[${dayOfWeek}].isClosed`}
                        label="Closed"
                        checked={isClosed}
                        onChange={handleClosedDays}
                    />
                </div>
            </div>
        </div>
    </>
}

export default ServiceHoursInput;