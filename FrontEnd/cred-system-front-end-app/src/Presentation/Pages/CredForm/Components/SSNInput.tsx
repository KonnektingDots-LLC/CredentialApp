import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ExtendedFieldValues } from '../../../../Application/utils/constants';
import { ErrorMessage } from '@hookform/error-message';
import { MdOutlineVisibility } from "react-icons/md"
import { MdOutlineVisibilityOff } from "react-icons/md"

interface Props {
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    label: string
    name: string
    setValue: UseFormSetValue<ExtendedFieldValues>
    value?: string;
}

const SSNInput = ({register, errors, label, name, setValue, value}: Props) => {
  const [ssn, setSsn] = useState(value ?? "");
  const [showFull, setShowFull] = useState(false);

  useEffect(() => { 
    if (value) {
      setSsn(value);
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 9) {
      setSsn(val);
      setValue(name, e.target, { shouldDirty: true });
    }
};

  const formatSSN = (value:string) => {
    const section1 = value.substring(0, 3);
    const section2 = value.substring(3, 5);
    const section3 = value.substring(5, 9);
    return `${section1}-${section2}-${section3}`;
  };

  const getMaskedSSN = () => {
    let visiblePart = '';
    let maskedValue = ssn.replace(/\d/g, '*');
    if (ssn.length > 5) {
        visiblePart = ssn.slice(5);
        maskedValue = maskedValue.slice(0, 5) + visiblePart;
    }
    const formattedValue = formatSSN(maskedValue);
    return formattedValue;
};

  const displayedValue = showFull ? formatSSN(ssn) : getMaskedSSN();

  return (
    <fieldset>
        <div style={{ position: 'relative', display: 'inline-block' }}
            className={errors[name] && "usa-form-group usa-form-group--error"}>
            <label htmlFor={name}>
                {label}
                <span className="text-red-error">*</span>
            </label>
            <p className="text-gray-50 text-sm w-72">
                We are required by law to collect your SSN. Enter
                your SNN without any spaces or dashes.
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
                        required: "Please validate your SSN",
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
                    value={ssn}
                    onChange={handleChange}
                    className={ errors[name]
                        ? " border-red-error border-4 w-3/5 h-8"
                        : " border-black border w-3/5 h-8"
                    }
                    style={{color: 'transparent', caretColor: '#000', fontSize: "19px" }}
                    maxLength={9} // SSN without dashes
                />
                <span onClick={() => setShowFull(!showFull)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', margin: "0px", padding: "0px"}}>
                    {showFull ? <MdOutlineVisibility size={20}/> : <MdOutlineVisibilityOff size={20}/>}
                </span>
            </div>
            <p className='-mt-7 ml-1 text-lg'>
                {displayedValue}
            </p>
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
  );
};

export default SSNInput;
