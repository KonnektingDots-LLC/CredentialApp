import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { ExtendedFieldValues } from '../../../../Application/utils/constants';

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    label: string
    name: string
    setValue: UseFormSetValue<ExtendedFieldValues>
    value: string;
}

const EINInput = ({register, errors, label, name, setValue, value}: Props) => {
  const [ein, setEIN] = useState(value);

  useEffect(() => { 
    if (value) {
      setEIN(value);
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 9) {
      setEIN(val);
      setValue(name, e.target, { shouldDirty: true });
    }
};

const formatEIN = (value: string) => {
    const section1 = value.substring(0, 2);
    const section2 = value.substring(2, 9);
    return `${section1}-${section2}`;
  };

  return (
    <fieldset>
        <div style={{ position: 'relative', display: 'inline-block' }}
            className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label htmlFor={name}>
                {label}
                <span className="text-red-error">*</span>
            </label>
            <p className="text-gray-50 text-sm w-72">
                Enter your EIN without any spaces or dashes.
            </p>
            <ErrorMessage
                errors={errors} name={name}
                render={({ message }) => (
                <p className="font-bold text-red-error mb-2 mt-1" role="alert">
                    {message}
                </p>
                )}
            />
            <div className='flex items-center gap-1'>
                <input
                {...register(name, {
                        required: "Please validate your EIN",
                        pattern: {
                            value: /^\d+$/,
                            message: "Only numbers allowed",
                        },
                        minLength: {
                            value: 9,
                            message: "Minimum of 9 characters allowed",
                        },
                        maxLength: {
                            value: 9,
                            message: "Maximum of 9 characters allowed",
                        },
                    })}
                    type="number"
                    value={ein}
                    onChange={handleChange}
                    className={ errors[name]
                        ? " border-red-error border-4 w-3/5 h-8"
                        : " border-black border w-3/5 h-8"
                    }
                    style={{color: 'transparent', caretColor: '#000', fontSize: "19px" }}
                    maxLength={9} // EIN without dashes
                />
            </div>
            <p className='-mt-7 ml-1 text-lg'>
                {formatEIN(ein)}
            </p>
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
  );
};

export default EINInput;
