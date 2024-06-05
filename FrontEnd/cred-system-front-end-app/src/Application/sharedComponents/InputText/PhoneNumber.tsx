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
    value: string | undefined;
}

const PhoneNumber = ({register, errors, label, name, setValue, value}: Props) => {
  const PHONE_LENGTH = 10;
  const [phoneNumber, setPhoneNumber] = useState(value);

  useEffect(() => { 
    if (value) {
      setPhoneNumber(validPhoneString(value));
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= PHONE_LENGTH) {
      setPhoneNumber(validPhoneString(val));
      setValue(name, e.target, { shouldDirty: true });
    }
  };

const formatPhoneNumber = (value: string) => {
    if(value.length < PHONE_LENGTH) {
      return value;
    }

    const section1 = value.substring(0, 3);
    const section2 = value.substring(3, 6);
    const section3 = value.substring(6, PHONE_LENGTH);
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
                Enter your phone number without any spaces or dashes.
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
                        required: "Please validate your phone number",
                        pattern: {
                            value: /^\d+$/,
                            message: "Only numbers allowed",
                        },
                        minLength: {
                            value: PHONE_LENGTH,
                            message: "Minimum of 10 characters allowed",
                        },
                        maxLength: {
                            value: PHONE_LENGTH,
                            message: "Maximum of 10 characters allowed",
                        },
                    })}
                    type="number"
                    value={phoneNumber}
                    onChange={handleChange}
                    className={ errors[name]
                        ? " border-red-error border-4 w-3/5 h-8"
                        : " border-black border w-3/5 h-8"
                    }
                    style={{color: 'transparent', caretColor: '#000', fontSize: "21px" }}
                    maxLength={PHONE_LENGTH} // Phone number without dashes
                    autoComplete='random-string'
                />
            </div>
            <p className='-mt-7 ml-1 text-lg'>
                {formatPhoneNumber(validPhoneString(phoneNumber))}
            </p>
            <div style={{height: "12px"}}></div>
        </div>
    </fieldset>
  );
};

/** Weird struct that appears when an autocomplete occurs in PhoneNumber inputs. */
type WrapperState = {
    /** actual phone number value is trapped here */
    value: string;
    _wrapperState: {
        initialValue: string;
        controlled: boolean;
    };
    _valueTracker: {};
};

function validPhoneString(phoneObj: WrapperState | string | undefined): string {
    if (typeof phoneObj === "string") {
        return phoneObj;
    }

    if (isWrapperState(phoneObj)) {
        return phoneObj.value;
    }

    return "";
}

/** Type guard function, to validate at runtime if the uncoming object has the @type {WrapperState} shape.
 * From `https://bobbyhadz.com/blog/typescript-check-if-unknown-has-property#:~:text=Use%20a%20user%2Ddefined%20type,object%20and%20returns%20a%20predicate`
 * */
function isWrapperState(obj: unknown): obj is WrapperState {
    if (typeof obj === "object" && obj !== null) {
        const castObj = obj as WrapperState;

        return (
            "_valueTracker" in castObj &&
            "value" in castObj &&
            "_wrapperState" in castObj &&
            typeof castObj.value === "string" &&

            // check if nested object
            typeof castObj._wrapperState === "object" &&
            castObj._wrapperState !== null &&

            // check if nested object has the following fields with correct types
            "initialValue" in castObj._wrapperState &&
            "controlled" in castObj._wrapperState &&
            typeof castObj._wrapperState.initialValue === "string" &&
            typeof castObj._wrapperState.controlled === "boolean"
        );
    }
    return false;
}

export default PhoneNumber;
