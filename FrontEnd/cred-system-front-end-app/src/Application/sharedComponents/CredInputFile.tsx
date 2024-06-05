import { useState, useRef, useEffect, ReactNode } from "react";
import IMAGES from "../../Application/images/images";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { ExtendedFieldValues } from "../utils/constants";
import { useAxiosInterceptors } from "../../Infraestructure/axiosConfig";
import { getFormDocument, verifyFormDocument } from "../../Infraestructure/Services/documents.service";
import { ROLE } from "../utils/enums";
import { msalInstance } from "../..";
import { getProviderByEmail } from "../../Infraestructure/Services/provider.service";
import {useDocumentInputStore} from '../../Infraestructure/Store/documentStore.tsx'
import { atom, useAtom } from "jotai";
import { FileToDelete } from "../../Infraestructure/Services/form.service.ts";

interface CredInputFilesProps {
    title: string | ReactNode;
    description: string;
    fileId: string;
    required: boolean;
    onHandleUpdatedFiles: (files: File[]) => void;
    register: UseFormRegister<ExtendedFieldValues>
    errors: FieldErrors<ExtendedFieldValues>
    setValue: UseFormSetValue<ExtendedFieldValues>
    value?: string;
    optionalMessage?: string;
    documentTypeId: number;
    documentName: string;
    onFileNameChange: (newFileName: string) => void;
    removeDelete?: boolean;
}

export const documentToDeleteAtom = atom<FileToDelete[]>([]);

const CredInputFiles = ({title, description, fileId, required, documentTypeId, documentName, onFileNameChange,
    register, errors, setValue, value, optionalMessage, onHandleUpdatedFiles, removeDelete = false}:CredInputFilesProps) => {

    const FILE_MIN_KB = 1024; // 1 KB
    const FILE_MAX_MB = 1024 * 1024 * 5; // MB
    const FILE_MIN_FORMATTED = `${FILE_MIN_KB / 1024} KB`;
    const FILE_MAX_FORMATTED = `${FILE_MAX_MB / 1024 / 1024} MB`;

    const api = useAxiosInterceptors();
    const [isDragging, setIsDragging] = useState(false);
    // const initialFile = value ? [{name: value} as File] : [];
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const [documentExist, setDocumentExist] = useState(false);
    const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;

    const addFileToList = useDocumentInputStore(store => store.addComponent);
    const removeFileFromList = useDocumentInputStore(store => store.removeComponent);
    const updateFileListEntry = useDocumentInputStore(store => store.updateComponent);
    const findByPathName = useDocumentInputStore(store => store.findByPathName);
    const documents = useDocumentInputStore(store => store.components);

    const [deletedDocuments, setDocumentToDelete] = useAtom(documentToDeleteAtom);

    // track created components
    useEffect(() => {
        addFileToList({ 
            name: documentName,
            selectedFilename: droppedFiles[0]?.name,
            documentExist,
            documentTypeId
        });
        return () => {
            removeFileFromList(documentName);
            setDocumentToDelete([]);
        };
    }, []);
  
    const handleDragEnter = (event: any) => {
      event.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = (event: any) => {
      event.preventDefault();
      setIsDragging(false);
    };
  
    const handleDragOver = (event: any) => {
      event.preventDefault();
    };
  
    function fileValidations(pdfFiles: File[]) {
        const selectedFile = pdfFiles[0];

        if (selectedFile) {
            const fileSize = selectedFile.size;

            if (fileSize < FILE_MIN_KB) {
                alert(`File size is too small (minimum size: ${FILE_MIN_FORMATTED})`);
                // NOTE: remain the old value, and keep the isDirty false
                setValue(fileId, value, { shouldValidate: false, shouldDirty: false });
                setValue(documentName, documentTypeId, { shouldValidate: false, shouldDirty: false });
                // event.target.value = null;
                return;
            }

            if (fileSize > FILE_MAX_MB) {
                alert(`File size exceeds the limit (${FILE_MAX_FORMATTED})`);
                // NOTE: remain the old value, and keep the isDirty false
                setValue(fileId, value, { shouldValidate: false, shouldDirty: false });
                setValue(documentName, documentTypeId, { shouldValidate: false, shouldDirty: false });
                // event.target.value = null;
                return;
            }
        }

        const isDuplicate = documents.some(
            (item) =>
                item.documentTypeId === documentTypeId &&
                item.selectedFilename === selectedFile.name
        );

        if (isDuplicate) {
            alert("Document was already selected");
            // NOTE: remain the old value, and keep the isDirty false
            setValue(fileId, value, { shouldValidate: false, shouldDirty: false });
            setValue(documentName, documentTypeId, { shouldValidate: false, shouldDirty: false });

            return;
        }

        const document = findByPathName(documentName);
        if (document && document.documentExist) {
            const updatedDocuments = deletedDocuments.filter(
                (document) => document.documentTypeId !== documentTypeId
            );
            setDocumentToDelete(updatedDocuments);
        }

        setDroppedFiles(pdfFiles);
        onHandleUpdatedFiles(pdfFiles);
        updateFileListEntry(documentName, { selectedFilename: pdfFiles[0].name });

        onFileNameChange(pdfFiles[0].name);
        setValue(fileId, pdfFiles[0].name, { shouldValidate: true, shouldDirty: true });
        setValue(documentName, documentTypeId, { shouldValidate: true, shouldDirty: true });
        setDocumentExist(false);
    }

    const handleDrop = (event: any) => {
      event.preventDefault();
      setIsDragging(false);
  
      const files = Array.from(event.dataTransfer.files) as File[];

      const pdfFiles = files.filter((file) => file.type === 'application/pdf');
      fileValidations(pdfFiles);
    };

    const handleBrowseFilesClick = (event: any) => {
        event.preventDefault();
        if (inputFile.current !== null) {
            inputFile.current?.click();
        }
    }

    const onFileChangeCapture = (event: any) => {
        if (event.target.files.length === 1) {
            const files = Array.from(event.target.files) as File[];
            const pdfFiles = files.filter((file) => file.type === 'application/pdf');
            fileValidations(pdfFiles)
        }
    }

    const handleDeleteFile = () => {
        setDroppedFiles([]);
        onHandleUpdatedFiles([]);

        setDocumentToDelete((prev) => [
            ...prev,
            { documentTypeId, uploadFilename: droppedFiles[0]?.name }
        ]);
        setValue(fileId, undefined, {shouldDirty: true});
        setValue(documentName, undefined, {shouldDirty: true});
        setDocumentExist(false);
    }

    const handleGetDoc = async () => {
        if (role === ROLE.Provider) {
            const email = msalInstance.getActiveAccount()?.username as string;
            const providerIdByEmail = await getProviderByEmail(api, email);

            const provider = { providerId: providerIdByEmail.providerId}
            sessionStorage.setItem('provider', JSON.stringify(provider));
            
        }
        const providerId = JSON.parse(sessionStorage.getItem('provider') || '{}').providerId;
        if (value) {
            await getFormDocument(api, documentTypeId, value, true, providerId);
        }
    }

    useEffect(() => {
        const fetchDocument = async (value: string) => {
            if (role === ROLE.Provider) {
                const email = msalInstance.getActiveAccount()?.username as string;
                const providerIdByEmail = await getProviderByEmail(api, email);

                const provider = { providerId: providerIdByEmail.providerId}
                sessionStorage.setItem('provider', JSON.stringify(provider));
                
            }
            const providerId = JSON.parse(sessionStorage.getItem('provider') || '{}').providerId;
            const response = await verifyFormDocument(api, documentTypeId, value, providerId);

            if (response && response.status === 200) {
                if (response.data) {
                    setDocumentExist(true);
                    updateFileListEntry(documentName, { documentExist: true });
                } else {
                    setDocumentExist(false);
                    updateFileListEntry(documentName, { documentExist: false });
                }
            }

        }
        if (value) {
            setDroppedFiles([{ name: value } as File]);
            updateFileListEntry(documentName, {selectedFilename: value})
            fetchDocument(value);
        } else {
            setDroppedFiles([]);
        }
    }, [value]);
    

    return <>
        <fieldset style={errors[fileId] && {marginTop:"-30px"}}>
            <div className={errors[fileId] && "usa-form-group usa-form-group--error"}>
                <label className="mb-1 flex items-center" htmlFor={fileId}>
                    {title}{" "}
                    {required ? <span className="text-red-error">*</span> : <p className="text-gray-50 text-sm ml-2">
                    {optionalMessage}
                </p>}
                </label>
                <p className="text-gray-50 text-sm w-[390px]">
                    {description}
                </p>
                <p className="text-gray-50 text-sm w-[390px] mb-1">
                    Maximum file size is {`${FILE_MAX_FORMATTED}`}
                </p>
                <ErrorMessage
                    errors={errors} name={fileId}
                    render={({ message }) => (
                    <p className="font-bold text-red-error mb-2" role="alert">
                        {message}
                    </p>
                    )}
                />
                <div className={`flex ${droppedFiles.length <= 0 ? "items-center" : ""} text-center h-24 w-96 border-dashed border !border-gray-300 cursor-pointer hover:bg-primary-lighter ${isDragging || droppedFiles.length === 1 ? "bg-primary-lighter" : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    >
                    <input 
                        {...register(fileId, required ? {
                            required: "This file is required"
                        }: {})}
                        type='file' 
                        id={fileId} 
                        ref={inputFile} 
                        style={{display: 'none'}}
                        onChangeCapture={onFileChangeCapture}
                        accept=".pdf"
                    />
                    {droppedFiles.length <= 0 && <div className="mx-auto">
                        <div className="usa-file-input text-gray-50 text-semibold">
                            <span className="usa-file-input__drag-text">Drag file here or{" "}</span>
                            <button onClick={handleBrowseFilesClick} 
                                className="usa-file-input__browse-text text-primary-vivid text-underline">choose from folder</button>
                        </div>
                    </div>}
                    
                    {droppedFiles.length > 0 && <div className="w-full text-left">
                        <div className="flex my-2 mx-1">
                            <label className="ml-1 text-bold">Selected File</label>
                            <div className="ml-auto">
                                {documentExist && !removeDelete && <button className="mr-6 text-underline text-primary"
                                    onClick={handleDeleteFile}
                                    >
                                        Delete
                                    </button>}
                                <button className="text-underline text-primary"
                                    onClick={handleBrowseFilesClick}
                                    >
                                        Change file
                                    </button>
                            </div>
                            
                        </div>
                        
                        <div className="h-1 mb-2 bg-white"></div>
                        <div className="flex items-center">
                            {droppedFiles.map((file, index) => (
                            <>
                                <img className="ml-1" src={IMAGES.tnCertificatePreview} alt="Thumbnail denoting a certificate"/>
                                {documentExist ? 
                                <a className={"ml-2 text-primary-blue underline"} key={index} onClick={handleGetDoc}>{file.name}</a> 
                                : 
                                <label className="ml-2" key={index}>{file.name}</label>
                                }
                            </>
                            ))}
                        </div>
                    </div>
                    }
                </div>
            </div>
        </fieldset>
    </>
}

export default CredInputFiles;
