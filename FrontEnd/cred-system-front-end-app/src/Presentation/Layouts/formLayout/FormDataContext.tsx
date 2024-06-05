import { ReactNode, createContext, useContext, useState } from 'react';
import { Form } from './credInterfaces';
import { defaultForm } from './defaultForm';

// const FormDataContext = createContext<Form>(defaultForm);

// eslint-disable-next-line react-refresh/only-export-components
export const useFormData = () => {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error('useFormData must be used within a FormDataProvider');
    }
    return context;
}

interface Props {
    children: ReactNode
}

interface FormDataContextValue {
    formData: Form;
    setFormData: React.Dispatch<React.SetStateAction<Form>>;
}

const FormDataContext = createContext<FormDataContextValue | undefined>(undefined);

export const FormDataProvider: React.FC<Props> = ({ children }) => {
    const [formData, setFormData] = useState<Form>(defaultForm);

    return (
        <FormDataContext.Provider value={{formData, setFormData}}>
            {children}
        </FormDataContext.Provider>
    );
}
