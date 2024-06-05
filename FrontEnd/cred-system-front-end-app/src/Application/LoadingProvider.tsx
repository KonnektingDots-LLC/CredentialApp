
import { createContext, useState } from "react";
import LoadingOverlay from "./sharedComponents/loadingOverlay";

export type LoadingContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
    children: React.ReactNode;
}

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && <LoadingOverlay />}
                {children}
        </LoadingContext.Provider>
    );
};

export { LoadingProvider };

