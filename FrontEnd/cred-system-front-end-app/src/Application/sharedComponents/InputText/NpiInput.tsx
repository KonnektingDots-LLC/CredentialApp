import { useFormContext, Controller } from "react-hook-form";
import { getValidationNPI } from "../../../Infraestructure/Services/form.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";

type Props = {
    name: string;
    label: string;
    isRequired?: boolean;
    /** NOTE: already has default "For example: 4281986" caption*/
    caption?: string;
    /** NOTE: already has default "10 characters allowed" caption*/
    captionBelow?: string;
};

export const NpiInput = ({
    name,
    label,
    isRequired,
    caption = "For example: 4281986",
    captionBelow = "10 characters allowed",
}: Props) => {
    const { control, setError, clearErrors } = useFormContext();

    // TODO: to avoid the LoadingOverlay from appearing,create a
    // new interceptor without the `LoadingContext` implementation.
    // An alternative would be inside `useAxiosInterceptors` hook return a
    // differnt axios interceptor depending on the passed args.
    const api = useAxiosInterceptors();

    return (
        <fieldset>
            <Controller
                name={name}
                control={control}
                rules={{ required: isRequired }}
                render={({ field, fieldState, formState }) => (
                    <>
                        <div
                            className={
                                formState.errors[name]
                                    ? "usa-form-group usa-form-group--error"
                                    : "flex flex-col gap-1"
                            }
                        >
                            <label htmlFor={name} className={!caption ? "-mb-1" : "-mb-2"}>
                                {label} <RequiredStar required={isRequired} />
                            </label>
                            {caption && <p className="text-gray-50 text-sm">{caption}</p>}

                            {fieldState.error && (
                                <p className="font-bold text-red-error pb-2" role="alert">
                                    {fieldState.error.message}
                                </p>
                            )}
                            <input
                                {...field}
                                type="text"
                                maxLength={10}
                                onChange={(e) => {
                                    clearErrors(name);

                                    // only allow numeric input
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    field.onChange(value);
                                }}
                                onBlur={async () => {
                                    const isValidNpi = await getValidationNPI(api, field.value);
                                    if (!isValidNpi) {
                                        setError(name, {
                                            type: "manual",
                                            message: "Invalid NPI",
                                        });
                                    }
                                }}
                                className={
                                    formState.errors[name]
                                        ? "border-red-error w-full border-4 h-8"
                                        : "border-black w-full border h-8"
                                }
                            />

                            {captionBelow && <p className="text-gray-50 text-sm">{captionBelow}</p>}
                        </div>
                    </>
                )}
            />
        </fieldset>
    );
};

const RequiredStar = ({ required }: { required?: boolean }) => {
    if (!required) {
        return null;
    }
    return <span className="text-red-error">*</span>;
};
