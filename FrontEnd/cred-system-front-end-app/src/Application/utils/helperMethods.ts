import { useContext } from "react";
import { LoadingContext, LoadingContextType } from "../LoadingProvider";
import { Form, ServiceHours } from "../../Presentation/Layouts/formLayout/credInterfaces";
import { FileToDelete, postForm } from "../../Infraestructure/Services/form.service";
import { NavigateFunction } from "react-router-dom";
import { AxiosInstance, AxiosResponse } from "axios";
import jsPDF from "jspdf";
import { PAGES_NAME, STATUS, STATUS_CODE } from "./enums";
import { Files } from "../interfaces";
import { ComponentMetadata } from "../../Infraestructure/Store/documentStore";

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const CheckNavigateToPost = async (currentStep: string, formData: Form, api: AxiosInstance, 
    navigate: NavigateFunction, filesDetail: Files[], filesToDelete?: FileToDelete[]) => {

    if (import.meta.env.DEV) console.log("formData", formData);
    if (currentStep === PAGES_NAME.Incorporated) {
        if (formData.setup.pcpApplies) {
            formData.setup.currentStep = PAGES_NAME.PCP
            await postForm(api, formData.setup.providerId, formData, filesDetail, filesToDelete).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/5');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            })
        } else if (formData.setup.f330Applies) {
            formData.setup.currentStep = PAGES_NAME.F330
            await postForm(api, formData.setup.providerId, formData, filesDetail, filesToDelete).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/6');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            })
        } else if (formData.setup.hospitalAffiliationsApplies) {
            formData.setup.currentStep = PAGES_NAME.Hospitals
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/7');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            })
        } else {
            formData.setup.currentStep = PAGES_NAME.Education
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/8');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            })
        }
    } 
    else if (currentStep === PAGES_NAME.PCP) {
        if (formData.setup.f330Applies) {
            formData.setup.currentStep = PAGES_NAME.F330
            await postForm(api, formData.setup.providerId, formData, filesDetail, filesToDelete).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/6');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        } else if (formData.setup.hospitalAffiliationsApplies) {
            formData.setup.currentStep = PAGES_NAME.Hospitals
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/7');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        } else {
            formData.setup.currentStep = PAGES_NAME.Education
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/8');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    else if (currentStep === PAGES_NAME.F330) {
        if (formData.setup.hospitalAffiliationsApplies) {
            formData.setup.currentStep = PAGES_NAME.Hospitals
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/7');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        } else {
            formData.setup.currentStep = PAGES_NAME.Education
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/8');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        }
    } 
    else if (currentStep === PAGES_NAME.CriminalRecord) {
        if (formData.setup.insuranceApplies) {
            formData.setup.currentStep = PAGES_NAME.Insurance;
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/10');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        } else {
            formData.setup.currentStep = PAGES_NAME.Submit
            await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                if (res?.status === 200) {
                    navigate('/cred/review');
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
};

export const CheckNavigateToPass = async (currentStep: string, formData: Form, navigate: NavigateFunction) => {

    if (currentStep === PAGES_NAME.Incorporated) {
        if (formData.setup.pcpApplies) {
            navigate('/cred/5');
            return;
        } else if (formData.setup.f330Applies) {
            navigate('/cred/6');
            return;
        } else if (formData.setup.hospitalAffiliationsApplies) {
            navigate('/cred/7');
            return;
        } else {
            navigate('/cred/8');
            return;
        }
    } else if (currentStep === PAGES_NAME.CriminalRecord) {
        if (formData.setup.insuranceApplies) {
            navigate('/cred/10');
            return;
        } else {
            navigate('/cred/review');
            return;
        }
    }
};

export const CheckNavigateToBack = async (currentStep: string, formData: Form, navigate: NavigateFunction) => {

    if (currentStep === PAGES_NAME.Education) {
        if (formData.setup.hospitalAffiliationsApplies) {
            navigate('/cred/7');
            return;
        }
        if (formData.setup.f330Applies) {
            navigate('/cred/6');
            return;
        }
        if (formData.setup.pcpApplies) {
            navigate('/cred/5');
            return;
        } else {
            navigate('/cred/4');
            return;
        }
    } else if (currentStep === PAGES_NAME.Hospitals) {
        if (formData.setup.f330Applies) {
            navigate('/cred/6');
            return;
        } 
        if (formData.setup.pcpApplies) {
            navigate('/cred/5');
            return;
        } else {
            navigate('/cred/4');
            return;
        }
    } else if (currentStep === PAGES_NAME.F330) {
        if (formData.setup.pcpApplies) {
            navigate('/cred/5');
            return;
        } else {
            navigate('/cred/4');
            return;
        }
    } else if (currentStep === PAGES_NAME.Submit) {
        formData.setup.insuranceApplies ?
            navigate('/cred/10') : navigate('/cred/9');
            return;
    }
};

export const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

export const validateMonth = (month: string) => {
    const validMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    if (!validMonths.includes(month)) {
        return false;
    }
    return true;
}

export const validateYear = (year: string, acceptFutureDate: boolean) => {
    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1900 || (!acceptFutureDate && parsedYear > currentYear)) {
        return false;
    }
    return true;  
}

export const isFutureDate = (month: string, year: string) => {
    const today = new Date();
    const inputDate = new Date(Number(year), Number(month) - 1);

    return inputDate.getFullYear() > today.getFullYear() ||
        (inputDate.getFullYear() === today.getFullYear() && inputDate.getMonth() > today.getMonth());
};

export const isNotFutureDate = (value: string) => {
    const inputDate = new Date(value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
};

export const generatePdf = (content: string) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(content, 8, 10);
    doc.output("dataurlnewwindow", { filename: `Attestation to invite a delegate.pdf` });
    return null;       
}

export const isOver18 = (date: string) => {
    const dob = new Date(date);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));

    return dob <= eighteenYearsAgo;
}

export const isNotExpired = (date: string) => {
    const expDate = new Date(date);
    const today = new Date();

    return expDate >= today;
}

export const openDocumentInNewTab = (response: AxiosResponse<any, any>) => {
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const downloadDocument = (response: AxiosResponse<any, any>, documentType: string) => {
    const blob = new Blob([response.data], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = documentType;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const downloadZipFile = (response: AxiosResponse<any, any>) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Credentialing Application.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const formatServiceHours = (serviceHours: ServiceHours[]) => {
    if (!serviceHours.length) {
        serviceHours = new Array(7).fill({});
    }
    if (serviceHours.length < 7) {
        const emptyDaysCount = 7 - serviceHours.length;
        const emptyDays = new Array(emptyDaysCount).fill({});
        serviceHours = serviceHours.concat(emptyDays);
    }
    return serviceHours?.map((hour, index) => ({
        ...hour,
        dayOfWeek: index,
        hourFrom: hour?.hourFrom || "",
        hourTo: hour?.hourTo || "",
        isClosed: hour?.isClosed ?? false
    }));
};

export function processCertificate(cert: any) {
    return cert?.haveCertificate === "no" ? null : {
        ...cert,
        haveCertificate: cert?.haveCertificate ?? "",
        certificateNumber: cert?.certificateNumber ?? "",
        expDate: cert?.expDate ?? "",
        certificateFile: cert?.certificateFile?.documentTypeId 
            ? {
                name: cert?.certificateFile?.name ?? "",
                documentTypeId: cert?.certificateFile?.documentTypeId
            } 
            : {}
    };
}

export function formatError(str: string): string {
    const result = str.replace(/([A-Z])/g, " $1");

    return result
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const processZipcode = (address: any) => {
    let zip = address?.zipcode ?? "";
    let zipExtension = address?.zipcodeExtension ?? "";
    if (zip.includes("-")) {
        [zip, zipExtension] = zip.split("-");
    }
    return {
        ...address,
        zipcode: zip,
        zipcodeExtension: zipExtension
    };
};

export const getProviderFormStatusColor = (status: string | undefined): string => {
    if (status == STATUS.APPROVED || status === STATUS_CODE.APPROVED) {
        return "#00A91C";
    } else if (status === STATUS.SUBMITTED) {
        return "#005EA2";
    } else if (status === STATUS.DRAFT || status === STATUS.PENDING || status === STATUS_CODE.PENDING) {
        return "#E5A000";
    } else if (status === STATUS.RETURNED || status === STATUS_CODE.RETURNED) {
        return "#FF5C00";
    } else if (status === STATUS.REJECTED || status === STATUS_CODE.REJECTED) {
        return "#B50909";
    }
    return "#565C65";
}

/**
 * Removes default behavior on key `Enter`. To avoid deleting documents accidentaly.
 * */
export const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
        event.preventDefault();
    }
};

/** 
 * Returns an array of document objects if they are valid to remove from remote location
 */
export function prepareDeleteFiles(
    filePaths: string[], 
    findByPathName: (pathName: string) => ComponentMetadata | undefined
) {
    const files: FileToDelete[] = [];
    for (const path of filePaths) {
        const document = findByPathName(path)
        if (document && document.documentExist) {
            const { documentTypeId, selectedFilename } = document;
            files.push({ uploadFilename: selectedFilename, documentTypeId })
        }
    }
    return files;
}

export function mergeDeleteLists(
    ...listsToDelete: (FileToDelete[] | undefined)[]
): FileToDelete[] {
    let mergedList: FileToDelete[] = [];

    for (const listToDelete of listsToDelete) {
        if (listToDelete) {
            mergedList = [...mergedList, ...listToDelete];
        }
    }

    // remove duplicates, if any (in case a file was set to be deleted separately and the entire section gone)
    const uniqueMergedList = mergedList.filter(
        (item, index, self) =>
            index ===
            self.findIndex(
                (i) =>
                    i.documentTypeId === item.documentTypeId &&
                    i.uploadFilename === item.uploadFilename
            )
    );

    return uniqueMergedList;
}

// TEST: add to proper test suite (tested with vitest)
if (import.meta.vitest) {
    const { expect, test } = import.meta.vitest;
    test('Unique objects for mergeDeleteLists', () => {
        const input = mergeDeleteLists(
            [{
                documentTypeId: 20, uploadFilename: "hello.pdf",
            }],
            [{
                documentTypeId: 20, uploadFilename: "hello.pdf",
            }]
        )

        const expected = JSON.stringify([{ documentTypeId: 20, uploadFilename: "hello.pdf" }])

        expect(JSON.stringify(input)).toBe(expected)
    })
}
