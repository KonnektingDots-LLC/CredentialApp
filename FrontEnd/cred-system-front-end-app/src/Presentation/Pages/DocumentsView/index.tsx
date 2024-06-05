import { useState, useEffect } from "react";
import { Button, Pagination } from "@trussworks/react-uswds";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import "./documentTable.css";
import DocumentsTable from "../../../Application/sharedComponents/DocumentsTable";
import { DocumentData } from "../../../Application/interfaces";
import { getDocumentByProvider, getDownloadAllDocuments, getDownloadSelectedDocument } from "../../../Infraestructure/Services/documents.service";
import { msalInstance } from "../../..";
import { ROLE } from "../../../Application/utils/enums";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import BackButton from "../CredForm/Components/BackButton";
import { useNavigate } from "react-router-dom";

const DocumentsView = ()=>{
    const api = useAxiosInterceptors();
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState<string>("");
    const [documentsData, setDocumentsData] = useState<DocumentData[]>([]);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
    const providerInfo = JSON.parse(sessionStorage.getItem('provider') || '{}');
    
    // handle locally the division between documents per pages
    const [activeDocuments, setActiveDocuments] = useState<Array<DocumentData[]>>([]);
    const [allChecked, setAllChecked] = useState<string[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<number>(0);

    const handleOnPageChangeAt = (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
        setCurrentPage(page);
        console.log(event);
    }

    const handleOnNextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage+1);
        }
    }

    const handleOnPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage-1);
        }
    }

    const downloadAllDocument = async () => {
        await getDownloadAllDocuments(api, providerInfo.providerId);
    }

    const downloadSelectedDocuments = async () => {
        // Transform the allChecked array
        const filesToDownload = allChecked.map(filename => ({ azureBlobFilename: filename }));
        await getDownloadSelectedDocument(api, filesToDownload);
    }

    useEffect(() => {
        if (role === ROLE.Provider) {
            const firstName = msalInstance.getActiveAccount()?.idTokenClaims?.given_name as string;
            const middleName = msalInstance.getActiveAccount()?.idTokenClaims?.extension_MiddleName as string;
            const lastName = msalInstance.getActiveAccount()?.idTokenClaims?.extension_LastName as string;
            const surName = msalInstance.getActiveAccount()?.idTokenClaims?.family_name as string;
            const nameArr = [firstName, middleName, lastName, surName].filter(Boolean);
            const formattedDoctorName = nameArr.join(' ');
            setDoctorName(formattedDoctorName);
        } else {
            const name = providerInfo.name;
            const middleName = providerInfo.middleName;
            const lastName = providerInfo.lastName;
            const surName = providerInfo.surName;
            const nameArr = [name, middleName, lastName, surName].filter(value => value !== "" && value !== undefined);
            const formattedDoctorName = nameArr.join(' ');
            setDoctorName(formattedDoctorName);
        }

        const fetchDocuments = async () => {
          const documents = await getDocumentByProvider(api, providerInfo.providerId);

          if (documents) {
            setDocumentsData(documents);
            setCurrentPage(1);
            // build Pagination Logic, but response should handle the logistic
            if(documents.length <= 10) {
                setTotalPage(1);
                setActiveDocuments([documents]);
            } else {
                setTotalPage(Math.ceil(documents.length/10));
                const documentsTotalPerPage = 10;
                const documentsToView: Array<DocumentData[]> = [];
                for (let i = 0; i < documents.length; i += documentsTotalPerPage) {
                    const documentsTotal = documents.slice(i, i + documentsTotalPerPage);
                    documentsToView.push(documentsTotal);
                }
                setActiveDocuments(documentsToView);
            }
          }
        }
        fetchDocuments();
    }, [api])

    return <div>
        <BackButton label="Go back" onClick={() => navigate(-1)} paddingTop={0} />
        <div style={{height: "24px"}}></div>
        <PageTitle title={`Dr. ${doctorName}`} subtitle="Here are all the documents."/>
        <div>
            <div className="flex flex-row mt-4 ml-2">
                {/* <Button type="button" outline={true}>Download Recent Form</Button> */}
                <Button type="button" disabled={documentsData.length === 0} onClick={downloadAllDocument}>Download All</Button>
            </div>
        </div>

        <div style={{height: "80px"}}></div>
        {
            documentsData.length > 0 &&
        <div className="flex flex-row">
           <label className="text-primary">
                {selectedFiles === documentsData.length ? "All" : selectedFiles} 
                {selectedFiles === 1 ? " file" : " files"} selected</label> 
        </div>
        }
        
        <div style={{height: "24px"}}></div>

                    
        {documentsData.length > 0 && activeDocuments[currentPage - 1] ? (
            <DocumentsTable
                data={activeDocuments[currentPage - 1]}
                setCountSelectedFiles={setSelectedFiles}
                providerId={providerInfo.providerId}
                allChecked={allChecked}
                setAllChecked={setAllChecked}
            />
        ) : (
            <div>You have not uploaded any documents yet.</div>
        )}
        
        <div className="flex flex-row mt-12 items-center">
            <Button disabled={documentsData.length === 0 || selectedFiles < 1} type="button" style={{height: "min-content"}} onClick={downloadSelectedDocuments}>Download</Button>
            <Pagination 
                className="ml-auto"
                pathname="/documents"
                currentPage={currentPage} 
                totalPages={totalPage} 
                onClickNext={handleOnNextPage}
                onClickPrevious={handleOnPreviousPage}
                onClickPageNumber={handleOnPageChangeAt}>

            </Pagination>
        </div>
        

        </div>
}

export default DocumentsView;
