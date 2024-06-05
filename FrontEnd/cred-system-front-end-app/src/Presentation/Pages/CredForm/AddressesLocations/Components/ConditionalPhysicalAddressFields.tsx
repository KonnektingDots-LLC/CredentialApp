import { Checkbox } from "@trussworks/react-uswds";
import PhysicalAddressFields from "./PhysicalAddressFields";
import { useEffect, useState } from "react";
import { Form } from "../../../../Layouts/formLayout/credInterfaces";
import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { AxiosInstance } from "axios";

interface PhysicalAddressProps {
    idNum: number;
    formData: Form | undefined;
    api: AxiosInstance
}

const ConditionalPhysicalAddressFields = ({idNum, formData, api }:PhysicalAddressProps) => {
    const { register, setValue, watch } = useFormContext<ExtendedFieldValues>(); // use this instead of the props


    const [sameAs, setSameAs] = useState(formData?.steps?.addressesLocations?.data?.values[idNum]?.addressInfo?.["isPhysicalAddressSameAsMail"]);

    const handleOnCheckboxChange = (data: any) => {
        setSameAs(data.target.checked);
        setValue(`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`, data.target.checked, { shouldDirty: true });
    }
    const physicalAddressValues = watch([
        `values[${idNum}].addressInfo.physical.name`,
        `values[${idNum}].addressInfo.physical.address1`,
        `values[${idNum}].addressInfo.physical.address2`,
        `values[${idNum}].addressInfo.physical.city`,
        `values[${idNum}].addressInfo.physical.stateId`,
        `values[${idNum}].addressInfo.physical.zipcode`,
        `values[${idNum}].addressInfo.physical.zipcodeExtension`
    ]);

    useEffect(() => {
        if(sameAs) {
            setValue(`values[${idNum}].addressInfo.mail.name`, physicalAddressValues[0], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.address1`, physicalAddressValues[1], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.address2`, physicalAddressValues[2], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.city`, physicalAddressValues[3], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.stateId`, physicalAddressValues[4], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.zipcode`, physicalAddressValues[5], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.zipcodeExtension`, physicalAddressValues[6], { shouldDirty: true });
        }
    }, [physicalAddressValues, setValue, idNum, sameAs]);

    return <>
        <Checkbox 
            {...register(`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`)}
            id={`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`}
            label="Same as Physical Address"
            name={`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`}
            checked={sameAs}
            onChange={handleOnCheckboxChange}
        />
        <div style={{height: "24px"}}></div>

        <section className={sameAs ? "hidden" : ""}>
            <PhysicalAddressFields idNum={idNum} 
                isMail={true}
                formData={formData} api={api}
            />
        </section>
    </>
}

export default ConditionalPhysicalAddressFields;