import { useState } from "react";

type UseArray<T> = {
    value: T[];
    setValue: React.Dispatch<React.SetStateAction<T[]>>;
    push: (element: T) => void;
    remove: (index: number) => void;
    isEmpty: () => boolean;
};

/** 
 * Taken from: https://dev.to/iamludal/custom-react-hooks-usearray-101g
 * Modified to support types and generics.
 */
export function useArray<T>(initialValue: T[] = []): UseArray<T> {
    const [value, setValue] = useState<T[]>(initialValue);

    const push = (element: T) => {
        setValue((oldValue) => [...oldValue, element]);
    };

    const remove = (index: number) => {
        setValue((oldValue) => oldValue.filter((_, i) => i !== index));
    };

    const isEmpty = () => value.length === 0;

    return { value, setValue, push, remove, isEmpty };
};
