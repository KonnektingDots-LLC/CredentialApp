import { TimePicker, Checkbox  } from "@trussworks/react-uswds";
import { ChangeEvent, useState } from "react";
import { ServiceHours } from "../../../Layouts/formLayout/credInterfaces";
import { UseFormSetValue } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../Application/utils/constants";

interface ServiceHoursInputProps {
    setValue: UseFormSetValue<ExtendedFieldValues>;
    formData: ServiceHours[] | undefined;
    dayOfWeek: number;
}

const ServiceHoursInput = ({setValue, formData, dayOfWeek }:ServiceHoursInputProps) => {

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
        setValue(`${key}`, data ?? "", { shouldValidate: true, shouldDirty: true});
    }

    const handleClosedDays = (data: ChangeEvent<HTMLInputElement>) => {
        setIsClosed(data.target.checked);
        setValue(`serviceHours[${dayOfWeek}].isClosed`, data.target.checked ?? false, { shouldValidate: true, shouldDirty: true});
        setValue(`serviceHours[${dayOfWeek}].hourFrom`, "", { shouldValidate: true, shouldDirty: true});
        setValue(`serviceHours[${dayOfWeek}].hourTo`, "", { shouldValidate: true, shouldDirty: true});
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
                    <TimePicker id={`serviceHours[${dayOfWeek}].hourFrom`}
                        className="-mt-8"
                        name={`serviceHours[${dayOfWeek}].hourFrom`}
                        onChange={(data) => handleServiceHoursChange(data, `serviceHours[${dayOfWeek}].hourFrom`)}
                        disabled={isClosed}
                        defaultValue={formData?.[dayOfWeek]?.hourFrom}
                    />
                </div>
                <div className="flex flex-col ml-[3%]">
                    <label className="flex gap-x-2 items-center">
                        To
                        <p className="text-gray-50 text-base">{'('}hh:mm{')'}</p>
                    </label>
                    <TimePicker id={`serviceHours[${dayOfWeek}].hourTo`}
                        className="-mt-8"
                        name={`serviceHours[${dayOfWeek}].hourTo`}
                        onChange={(data) => handleServiceHoursChange(data, `serviceHours[${dayOfWeek}].hourTo`)}
                        disabled={isClosed}
                        defaultValue={formData?.[dayOfWeek]?.hourTo}
                    />
                </div>
                <div className="flex flex-col ml-[3%] mt-3">
                    <Checkbox id={`serviceHours[${dayOfWeek}].isClosed`} name={`serviceHours[${dayOfWeek}].isClosed`}
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