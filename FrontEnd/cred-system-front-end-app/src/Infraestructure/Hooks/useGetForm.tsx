import { useQuery } from "@tanstack/react-query";
import { Form } from "../../Presentation/Layouts/formLayout/credInterfaces";
import { AxiosInstance } from "axios";
import { getForm } from "../Services/form.service";
import { logout } from "../../Application/utils/auth";

type QueryOptions = {
    enabled?: boolean;
};

/**
 * Represents the structure of a provider object.
 */
type Provider = {
    providerId: number;
}

/**
 * React-query implementantion of the `useFormData` hook/context for consistent
 * data fetching, caching, and error handling.
 *
 * Verifies the existance of the provider object,
 * but the `providerId` can be passed through the options
 * */
export function useGetForm(
    api: AxiosInstance,
    options: QueryOptions & { providerId?: number } = {}
) {
    const { enabled, providerId } = options;

    const providerSession = getProvider(sessionStorage)
    const safeProviderId = providerSession?.providerId ? providerSession.providerId : providerId;

    return useQuery<Form>({
        queryKey: ["formData", safeProviderId],
        queryFn: () => {
            if (typeof safeProviderId === "number") {
                return getForm(api, safeProviderId);
            } else {
                logout()
                throw new Error("Provider ID is required for fetching form data.");
            }
        },
        enabled: enabled,
    });
}


/**
 * Retrieves the provider object from sessionStorage.
 * @param {Storage} storage - sessionStorage object.
 * @throws {Error} if parsing or accessing the provider data fails.
 * @returns {Provider | null} provider object if found, or null if not found or an error occurred.
 */
export function getProvider(storage: Storage): Provider | null {
    try {
        const providerData = storage.getItem("provider");
        if (providerData) {
            const parsedProvider: Provider = JSON.parse(providerData);
            return parsedProvider;
        }

        return null;
    } catch (error) {
        throw new Error("Error parsing provider data");
    }
}
