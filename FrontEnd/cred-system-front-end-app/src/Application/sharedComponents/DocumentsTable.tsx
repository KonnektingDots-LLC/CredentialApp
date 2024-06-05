import "../../Presentation/Pages/DocumentsView/documentTable.css"
import IMAGES from "../../Application/images/images";
import { getDownloadAllDocuments, getDownloadDocument, getOpenDocument } from "../../Infraestructure/Services/documents.service";
import { useAxiosInterceptors } from "../../Infraestructure/axiosConfig";

type DocumentsTableProps = {
    data: {
        azureBlobFilename: string,
        name: string,
        downloadable?: boolean,
    }[],
    setCountSelectedFiles: React.Dispatch<React.SetStateAction<number>>
    providerId: string
    allChecked: string[],
    setAllChecked: React.Dispatch<React.SetStateAction<string[]>>
}

const DocumentsTable = ({data, setCountSelectedFiles, providerId, allChecked, setAllChecked}: DocumentsTableProps) => {
    const api = useAxiosInterceptors();

    const updateDownloadableState = (item: any) => {
        const updateAllChecked: string[] = [];

        // add current documentProp.id element as string
        allChecked.forEach(element => {
            updateAllChecked.push(element);
        });

        if (updateAllChecked.includes(item.azureBlobFilename)) {
            setCountSelectedFiles(prev => prev-1);
            // exclude and update variable
            const index = updateAllChecked.indexOf(item.azureBlobFilename, 0);
            if (index > -1) {
                updateAllChecked.splice(index, 1);
            }
            
        } else {
            setCountSelectedFiles(prev => prev + 1);
            // Add and update variable
            updateAllChecked.push(item.azureBlobFilename);
        }
        setAllChecked(updateAllChecked);
    }

    const downloadDocument = async (documentId: string, name: string) => {
        await getDownloadDocument(api, providerId, documentId, name);
    }

    const downloadAllDocument = async () => {
        await getDownloadAllDocuments(api, providerId);
    }

    const handleOpenDocument = async (filename: string) => {
        await getOpenDocument(api, providerId, filename)
    }
    
    const handleSelectAll = (event: any) => {
        if (event.target.checked) {
            setCountSelectedFiles(data.length);
        } else {
            setCountSelectedFiles(0);
        }
        
        const isDownloadable: boolean = event.target.checked;
        const updateAllChecked: string[] = [];
        // Causes all checkboxes to be true or false
        data.forEach(element => {
            if(isDownloadable) {
                // add all
                updateAllChecked.push(element.azureBlobFilename);
            } else {
                // remove all
                const index = updateAllChecked.indexOf(element.azureBlobFilename, 0);
                if (index > -1) {
                    updateAllChecked.splice(index, 1);
                }
            }
        });

        setAllChecked(updateAllChecked);
    }

    return <>
    <table className="usa-table--borderless cred-docs-table">
            <thead>
                <tr>
                    <th>
                        <input onChange={handleSelectAll} className="mt-2 ml-1" type="checkbox" />
                    </th>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>
                        <div className="flex flex-row-reverse">
                            <img className="ml-8 cursor-pointer" src={IMAGES.iconDownload} onClick={downloadAllDocument}/>
                            <label className="text-normal">Download All</label>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map( function(item, i){
                        return <>
                            <tr id={i + "-document"}>
                                <td>
                                    <input className="mt-2 ml-1" 
                                           type="checkbox"
                                           id={item.azureBlobFilename}
                                           checked={allChecked.includes(item.azureBlobFilename)} 
                                           onChange={() => updateDownloadableState(item)}/>
                                </td>
                                <td>{item.name}</td>
                                <td className="text-underline text-primary-vivid cursor-pointer" 
                                    onClick={() => handleOpenDocument(item.azureBlobFilename)}>
                                    {item.azureBlobFilename}
                                </td>
                                <td>
                                    <img onClick={() => downloadDocument(item.azureBlobFilename, item.name)} 
                                         className="cursor-pointer" 
                                         src={IMAGES.iconDownload} 
                                    />
                                </td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}


export default DocumentsTable;