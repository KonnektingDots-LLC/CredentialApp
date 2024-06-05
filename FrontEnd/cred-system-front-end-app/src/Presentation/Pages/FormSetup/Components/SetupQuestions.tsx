import RadioFormSetup from './RadioFormSetup';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ExtendedFieldValues } from '../../../../Application/utils/constants';
import { ChangeEvent } from 'react';

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
}
const SetupQuestions = ({register, errors, setValue}:Props) => {

    const handleChange  = (key: string) => (data: ChangeEvent<HTMLInputElement>) => {
        setValue(key, data.target.value,  {shouldValidate: true, shouldDirty: true });
    }

    return (
        <div className="flex flex-col w-fit gap-4 ml-10">
            <RadioFormSetup register={register} errors={errors} onChange={handleChange('pcpApplies')}
                name='pcpApplies' label='Is the Provider a Primary Care Physician in the Medicaid Program?'
            />

            <RadioFormSetup register={register} errors={errors} onChange={handleChange('f330Applies')}
                name='f330Applies' label='Is the provider employed or contracted by a Federally Qualified Health Center (330)?'
            />

            <RadioFormSetup register={register} errors={errors} onChange={handleChange('hospitalAffiliationsApplies')}
                name='hospitalAffiliationsApplies' label='Is the provider affiliated to one or more hospitals (has privileges, is attending, etc.)?'
            />

            <RadioFormSetup register={register} errors={errors} onChange={handleChange('insuranceApplies')}
                name='insuranceApplies' label='Does the Provider have a Malpractice and Professional Liability Insurance?'
            />       
        </div>
    );
};

export default SetupQuestions;