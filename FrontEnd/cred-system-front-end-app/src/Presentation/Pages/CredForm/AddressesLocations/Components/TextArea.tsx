import { UseFormRegister } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";

interface TextAreaProps {
    id: string;
    label: string;
    register: UseFormRegister<ExtendedFieldValues>
}

const TextArea = ({id, label, register}:TextAreaProps) => {

    return <>
        <label className="usa-label" htmlFor={id}>
            {label}{" "}
        </label>
        <textarea
            {...register(id)} 
            className="usa-textarea"
            id={id}
            name={id}
            >
        </textarea>
    </>
}

export default TextArea;