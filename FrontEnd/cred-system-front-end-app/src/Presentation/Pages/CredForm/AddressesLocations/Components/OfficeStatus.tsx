import { ChangeEvent, useEffect, useState } from 'react';
import { ExtendedFieldValues } from '../../../../../Application/utils/constants';
import { useFormContext } from 'react-hook-form';
import { Form } from '../../../../Layouts/formLayout/credInterfaces';
import { ErrorMessage } from '@hookform/error-message';
import { Radio } from '@trussworks/react-uswds';
import TextArea from './TextArea';
import TextLimitLength from '../../../../../Application/sharedComponents/InputText/TextLimitLength';

interface Props {
    formData: Form | undefined;
    idNum: number
}

const OfficeStatus = ({ formData, idNum }: Props) => {
    const { register, formState: { errors }, setValue } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const [_, setIsPrincipal] = useState(formData?.steps?.addressesLocations?.data?.values[idNum]?.addressPrincipalTypeId);
    const [isActive, setIsActive] = useState(formData?.steps?.addressesLocations?.data?.values[idNum]?.isActive);
    const [acceptingPatients, setIsAcceptingPatients] = useState(formData?.steps?.addressesLocations?.data?.values[idNum]?.isAcceptingNewPatients);
    const [ada, setAda] = useState(formData?.steps?.addressesLocations?.data?.values[idNum]?.isComplyWithAda);

    const handlePrincipal = (data: ChangeEvent<HTMLInputElement>) => {
        setValue(`values[${idNum}].addressPrincipalTypeId`, data.target.value, { shouldDirty: true });
        setIsPrincipal(data.target.value);
    }
    const handleActive = (data: ChangeEvent<HTMLInputElement>) => {
        setValue(`values[${idNum}].isActive`, data.target.value, { shouldDirty: true });
        setIsActive(data.target.value);
    }
    const handlePatients = (data: ChangeEvent<HTMLInputElement>) => {
        setValue(`values[${idNum}].isAcceptingNewPatients`, data.target.value, { shouldDirty: true });
        setIsAcceptingPatients(data.target.value);
    }    
    const handleAda = (data: ChangeEvent<HTMLInputElement>) => {
        setValue(`values[${idNum}].isComplyWithAda`, data.target.value, { shouldDirty: true });
        setAda(data.target.value);
    }

    useEffect(() => {
        if (idNum === 0) {
            setIsPrincipal("1");
            setValue(`values[${idNum}].addressPrincipalTypeId`, "1", { shouldDirty: true });
        } else {
            setIsPrincipal("2");
            setValue(`values[${idNum}].addressPrincipalTypeId`, "2", { shouldDirty: true });
        }
    }, [formData]);

    return (
        <div>
            <h2 className="text-bold">Office Status</h2>
            <label>Describe the current status of your location</label>
            <fieldset>
                <div className={errors[`values[${idNum}].addressPrincipalTypeId`] && "usa-form-group usa-form-group--error"}>

                    <label className="block">
                        This will be considered your{" "}
                        {idNum === 0 ? <b>Primary</b> : <b>Secondary</b>} address
                    </label>
       
                    <Radio id={`rb-[${idNum}]-principal`}
                        {...register(`values[${idNum}].addressPrincipalTypeId`)}
                        name={`values[${idNum}].addressPrincipalTypeId`}
                        label="Principal"
                        value="1"
                        onChange={handlePrincipal}
                        checked={idNum === 0}
                        disabled
                    />
                    <Radio id={`rb-[${idNum}]-secondary`}
                        name={`values[${idNum}].addressPrincipalTypeId`}
                        label="Secondary"
                        value="2"
                        onChange={handlePrincipal}
                        checked={idNum !== 0}
                        disabled
                    />
                    <div style={{height: "12px"}}></div>
                </div>
            </fieldset>
            <fieldset>
                <div className={errors[`values[${idNum}].isActive`] && "usa-form-group usa-form-group--error"}>
                    <label>Active or Closed?{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={`values[${idNum}].isActive`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />            
                    <Radio id={`rb-[${idNum}]-active`}
                        {...register(`values[${idNum}].isActive`, {
                            required: "You must select an option"
                        })}
                        name={`values[${idNum}].isActive`}
                        label="Active"
                        value="active"
                        onChange={handleActive}
                        checked={"active" === isActive}
                    />
                    <Radio id={`rb-[${idNum}]-closed`}
                        name={`values[${idNum}].isActive`}
                        label="Closed"
                        value="closed"
                        onChange={handleActive}
                        checked={"closed" === isActive}
                    />
                    <div style={{height: "12px"}}></div>
                </div>
            </fieldset>
            <fieldset>
                <div className={errors[`values[${idNum}].isAcceptingNewPatients`] && "usa-form-group usa-form-group--error"}>
                    <label>Accepting New Patients?{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={`values[${idNum}].isAcceptingNewPatients`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />            
                    <Radio id={`rb-[${idNum}]-yes-isAcceptingNewPatients`}
                        {...register(`values[${idNum}].isAcceptingNewPatients`, {
                            required: "You must select an option"
                        })}
                        name={`values[${idNum}].isAcceptingNewPatients`}
                        label="Yes"
                        value="yes"
                        onChange={handlePatients}
                        checked={"yes" === acceptingPatients}
                    />
                    <Radio id={`rb-[${idNum}]-no-isAcceptingNewPatients`}
                        name={`values[${idNum}].isAcceptingNewPatients`}
                        label="No"
                        value="no"
                        onChange={handlePatients}
                        checked={"no" === acceptingPatients}
                    />
                    <div style={{height: "12px"}}></div>
                </div>
            </fieldset>
            <fieldset>
                <div className={errors[`values[${idNum}].isComplyWithAda`] && "usa-form-group usa-form-group--error"}>
                    <label>Does it meet ADA Requirements?{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={`values[${idNum}].isComplyWithAda`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />            
                    <Radio id={`rb-[${idNum}]-yes-isComplyWithAda`}
                        {...register(`values[${idNum}].isComplyWithAda`, {
                            required: "You must select an option"
                        })}
                        name={`values[${idNum}].isComplyWithAda`}
                        label="Yes"
                        value="yes"
                        onChange={handleAda}
                        checked={"yes" === ada}
                    />
                    <Radio id={`rb-[${idNum}]-no-isComplyWithAda`}
                        name={`values[${idNum}].isComplyWithAda`}
                        label="No"
                        value="no"
                        onChange={handleAda}
                        checked={"no" === ada}
                    />
                </div>
            </fieldset>

            <fieldset>
            <TextArea id={`values[${idNum}].adaCompliantComment`} 
                label="Please, add comments on ADA requirement compliance." register={register}
            />
            </fieldset>

            <div style={{height: "16px"}}></div>
            <TextLimitLength register={register} errors={errors}
                label={" Medicaid ID for Location "} isRequired minLength={5}
                name={`values[${idNum}].medicalId`} maxLength={25} 
                caption={"Please add your Medicaid ID"}
                captionBelow="5-25 characters allowed"
            />
        </div>
    );
};

export default OfficeStatus;
