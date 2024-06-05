import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { ExtendedFieldValues } from '../../utils/constants';

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    label: string
    name: string
    setValue: UseFormSetValue<ExtendedFieldValues>
    value?: string;
}

const TaxIdInput = ({register, errors, label, name, setValue, value}: Props) => {
  const [taxId, setTaxId] = useState(value ?? "");

  useEffect(() => { 
    let val = value ?? "";
    if (val?.length > 9) {
        val = val?.substring(0, 9);
    }      
    setTaxId(val);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length <= 9) {
      setTaxId(val);
      setValue(name, val, { shouldDirty: true });
    } else {
        val = val.substring(0, 9);
        setTaxId(val);
        setValue(name, val, { shouldValidate: true, shouldDirty: true });
    }
};

  const formatTaxId = (value:string) => {
    const section1 = value.substring(0, 3);
    const section2 = value.substring(3, 5);
    const section3 = value.substring(5, 9);
    return `${section1}-${section2}-${section3}`;
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
                We are required by law to collect your Tax ID.
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
                        required: "Please validate your Tax ID",
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
                    value={taxId}
                    onChange={handleChange}
                    className={ errors[name]
                        ? " border-red-error border-4 w-3/5 h-8"
                        : " border-black border w-3/5 h-8"
                    }
                    style={{color: 'transparent', caretColor: '#000', fontSize: "21px" }}
                    maxLength={9}
                    defaultValue={taxId}
                />
            </div>
            <p className='-mt-7 ml-1 text-lg'>
                {formatTaxId(taxId)}
            </p>
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
  );
};

export default TaxIdInput;
