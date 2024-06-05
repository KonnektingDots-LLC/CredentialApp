import { create } from 'zustand';

export type ComponentMetadata = {
    /** name of the component */
    name: string;
    /** determines if document is present remotely or not. */
    documentExist: boolean;
    /** filename that is present in the document input. */
    selectedFilename: string;
    /** id that helps identify to which step is associated to. */
    documentTypeId: number;

};

type StoreState = {
    components: ComponentMetadata[];
    addComponent: (metadata: ComponentMetadata) => void;
    removeComponent: (name: string) => void;
    updateComponent: (name: string, newMetadata: Partial<ComponentMetadata>) => void;
    filterByFilename: (inputName: string) => ComponentMetadata[];
    findByPathName: (name: string) => ComponentMetadata | undefined;
};

// NOTE: for `persist()` to work with TS, need to add currying -- i.e. those empty extra parens
// https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
/**
 * Store to keep track of mounted `CredInputFile` components. Useful to grab their internal metadata, such as:
 * - has a document already uploaded
 * - list of mounted documents, to avoid repeated local filenames
 */
export const useDocumentInputStore = create<StoreState>(
    (set, get) => ({
        components: [] as ComponentMetadata[],
        addComponent: (metadata) => set(state => ({ components: [...state.components, metadata] })),
        removeComponent: (name) => set(state => ({ 
            components: state.components.filter(c => c.name !== name) 
        })),
        updateComponent: (name, newMetadata) => set(state => ({
            components: state.components.map(c => c.name === name ? { ...c, ...newMetadata } : c)
        })),
        filterByFilename: (inputName) => get().components.filter(c => c.selectedFilename === inputName),
        findByPathName: (name) => get().components.filter(c => c.name === name)?.pop(),
    }),
)
