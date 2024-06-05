import { useFormContext } from "react-hook-form";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { Radio } from "@trussworks/react-uswds";
import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import { ErrorMessage } from "@hookform/error-message";
import KDDatePicker from "../../../../../Application/sharedComponents/KDDatePicker";
import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "../../../../Layouts/formLayout/credInterfaces";
import { Files } from "../../../../../Application/interfaces";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import { handleKeyDown } from "../../../../../Application/utils/helperMethods";

interface Props {
    formData: Form | undefined;
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>
}

const LicensesAndCertificates = ({ formData, setFilesDetail }: Props) => {
    const { register, formState: { errors }, setValue, unregister } = useFormContext<ExtendedFieldValues>(); // use this instead of the props

    const [hasDEA, setHasDEA] = useState(formData?.steps.educationTraining.data?.licensesCertificates?.deaCertificate?.haveCertificate ?? "");
    const [hasMembership, setHasMembership] = useState(formData?.steps.educationTraining.data?.licensesCertificates?.membershipCertificate?.haveCertificate ?? "");
    const [hasASSMCA, setHasASSMCA] = useState(formData?.steps.educationTraining.data?.licensesCertificates?.assmcaCertificate?.haveCertificate ?? "");
    const [hasPTAN, setHasPTAN] = useState(formData?.steps.educationTraining.data?.licensesCertificates?.ptanCertificate?.haveCertificate ?? "");
    const [hasTelemedicine, setHasTelemedicine] = useState(formData?.steps.educationTraining.data?.licensesCertificates?.telemedicineCertificate?.haveCertificate ?? "");
    const [newFileName, setNewFileName] = useState('');

    // handle incoming `formData` changes after fetch, if any
    useEffect(() => {
        if (formData) {
            const selectedLicenses = formData?.steps.educationTraining.data?.licensesCertificates;

            if (selectedLicenses?.deaCertificate?.haveCertificate !== hasDEA) {
                setHasDEA(selectedLicenses?.deaCertificate?.haveCertificate ?? '');
            }

            if (selectedLicenses?.membershipCertificate?.haveCertificate !== hasMembership) {
                setHasMembership(selectedLicenses?.membershipCertificate?.haveCertificate ?? '');
            }

            if (selectedLicenses?.assmcaCertificate?.haveCertificate !== hasASSMCA) {
                setHasASSMCA(selectedLicenses?.assmcaCertificate?.haveCertificate ?? '');
            }

            if (selectedLicenses?.ptanCertificate?.haveCertificate !== hasPTAN) {
                setHasPTAN(selectedLicenses?.ptanCertificate?.haveCertificate ?? '');
            }

            if (selectedLicenses?.telemedicineCertificate?.haveCertificate !== hasTelemedicine) {
                setHasTelemedicine(
                    selectedLicenses?.telemedicineCertificate?.haveCertificate ?? ''
                );
            }
        }
    }, [formData]);
    const handleFileSelected = (files: File[], documentTypeId: string) => {
        
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (documentTypeId === "19" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.prMedicalLicenseFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.prMedicalLicenseFile?.name
            }
            if (documentTypeId === "32" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.deaCertificate?.certificateFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.deaCertificate?.certificateFile?.name
            }
            if (documentTypeId === "33" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.assmcaCertificate?.certificateFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.assmcaCertificate?.certificateFile?.name
            }
            if (documentTypeId === "34" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.membershipCertificate?.certificateFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.membershipCertificate?.certificateFile?.name
            }
            if (documentTypeId === "35" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.ptanCertificate?.certificateFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.ptanCertificate?.certificateFile?.name
            }
            if (documentTypeId === "36" && newFileName !== formData?.steps?.educationTraining.data?.licensesCertificates?.telemedicineCertificate?.certificateFile?.name) {
                oldFilename = formData?.steps?.educationTraining.data?.licensesCertificates?.telemedicineCertificate?.certificateFile?.name
            }
    
            return {
                documentTypeId: documentTypeId,
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(prevDetails => {
            const updatedDetails = prevDetails.filter(detail => detail.documentTypeId !== documentTypeId);
            return [...updatedDetails, ...newFileDetails];
        });
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };

    const handleDateInputChange = (key: string) => (value: string | undefined) => {
        setValue(key, value,  {shouldValidate: true, shouldDirty: true });
    };

    const handleRadioOptionChange = (key: string) => (data: ChangeEvent<HTMLInputElement>) => {

        switch(key) {
            case "licensesCertificates.deaCertificate.haveCertificate":
                if (data.target.value === "no") {
                    unregister('licensesCertificates.deaCertificate.certificateFile.name');
                    unregister('licensesCertificates.deaCertificate.certificateFile.documentTypeId');
                }
                setHasDEA(data.target.value);
                break;
            case "licensesCertificates.assmcaCertificate.haveCertificate":
                if (data.target.value === "no") {
                    unregister('licensesCertificates.assmcaCertificate.certificateFile.name');
                    unregister('licensesCertificates.assmcaCertificate.certificateFile.documentTypeId');
                }
                setHasASSMCA(data.target.value);
                break;
            case "licensesCertificates.membershipCertificate.haveCertificate":
                if (data.target.value === "no") {
                    unregister('licensesCertificates.membershipCertificate.certificateFile.name');
                    unregister('licensesCertificates.membershipCertificate.certificateFile.documentTypeId');
                }
                setHasMembership(data.target.value);
                break;
            case "licensesCertificates.ptanCertificate.haveCertificate":
                if (data.target.value === "no") {
                    unregister('licensesCertificates.ptanCertificate.certificateFile.name');
                    unregister('licensesCertificates.ptanCertificate.certificateFile.documentTypeId');
                }
                setHasPTAN(data.target.value);
                break;
            case "licensesCertificates.telemedicineCertificate.haveCertificate":
                if (data.target.value === "no") {
                    unregister('licensesCertificates.telemedicineCertificate.certificateFile.name');
                    unregister('licensesCertificates.telemedicineCertificate.certificateFile.documentTypeId');
                }
                setHasTelemedicine(data.target.value);
                break;
        }
        setValue(key, data.target.value,  { shouldValidate: true, shouldDirty: true });
    }
    
    return (
        <>
            <form autoComplete="off" onKeyDown={handleKeyDown}>
                <TextLimitLength label={"PR Professional License Number "} 
                    register={register} errors={errors} maxLength={15} minLength={5}
                    name={"licensesCertificates.prMedicalLicenseNumber"} isRequired
                    caption="Provide Number without spaces. Ex. 42233212" 
                    captionBelow="5-15 characters allowed" width={380}
                />
            
                <KDDatePicker 
                    pickerId="licensesCertificates.prMedicalLicenseExpDate"
                    pickerLabel="Provide PR Professional License Expiration Date"
                    register={register}
                    required={true}
                    onHandleChange={handleDateInputChange("licensesCertificates.prMedicalLicenseExpDate")}
                    errorHandler={errors}
                    value={formData?.steps?.educationTraining?.data?.licensesCertificates?.prMedicalLicenseExpDate}
                    validationType="expiration"
                />
                
                <div style={{height: "18px"}}></div>
                <CredInputFiles fileId="licensesCertificates.prMedicalLicenseFile.name"
                    title="PR Professional License"
                    description="Please attach a PDF file of a copy of an image of your Professional License"
                    required={true}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    value={formData?.steps.educationTraining.data?.licensesCertificates?.prMedicalLicenseFile?.name} 
                    onHandleUpdatedFiles={(f) => handleFileSelected(f, "19")}
                    documentTypeId={19} documentName="licensesCertificates.prMedicalLicenseFile.documentTypeId"
                    onFileNameChange={handleFileNameChange}
                />  

                <div style={{height: "28px"}}></div>

                <fieldset className="mb-4">
                    <div className={errors["licensesCertificates.membershipCertificate.haveCertificate"] && "usa-form-group usa-form-group--error"}>
                        <label>Do you have a Collegiate Membership ?</label>
                            <span className="text-red-error">*</span> 
                        <p className="text-gray-50 text-sm w-72 mb-1">
                            ("Colegio de Médicos Cirujanos")
                        </p>
                        <p className="text-gray-50 text-sm w-72">
                            If "Yes", please provide certificate.
                        </p>
                        <ErrorMessage
                            errors={errors} name={"licensesCertificates.membershipCertificate.haveCertificate"}
                            render={({ message }) => (
                            <p className="font-bold text-red-error -mb-1" role="alert">
                                {message}
                            </p>
                            )}
                        />
                        <Radio id="rb-haveMembership"
                                {...register("licensesCertificates.membershipCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="have-membership"
                                label="Yes"
                                value="yes"
                                onChange={handleRadioOptionChange("licensesCertificates.membershipCertificate.haveCertificate")}
                                checked={hasMembership === "yes"}
                                />
                        <Radio id="rb-doesNotHaveMembership"
                                name="have-membership"
                                label="No"
                                value="no"
                                onChange={handleRadioOptionChange("licensesCertificates.membershipCertificate.haveCertificate")}
                                checked={hasMembership === "no"}
                                />
                        <div style={{height: "8px"}}></div>
                    </div>
                </fieldset>
                {(hasMembership === "yes") && 
                    <section className="mt-4">
                        <TextLimitLength label={"Membership Number"} 
                            register={register} errors={errors} maxLength={15} minLength={5}
                            name={"licensesCertificates.membershipCertificate.certificateNumber"} isRequired
                            caption="Provide Number without spaces. Ex. 42233212" 
                            captionBelow="5-15 characters allowed" width={380} 
                            errorMessage="Your Membership Number is required"
                        />
            
                        <div className="mt-2"></div>
                        <KDDatePicker 
                            pickerId="licensesCertificates.membershipCertificate.expDate"
                            pickerLabel="Provide the membership Expiration Date"
                            register={register}
                            required={true}
                            onHandleChange={handleDateInputChange("licensesCertificates.membershipCertificate.expDate")}
                            errorHandler={errors}
                            value={formData?.steps.educationTraining.data?.licensesCertificates?.membershipCertificate?.expDate}
                            validationType="expiration"
                        />

                        <div className="mt-4"></div>
                        <CredInputFiles fileId="licensesCertificates.membershipCertificate.certificateFile.name"
                            title="Collegiate Membership Certificate"
                            description="Please attach a PDF file of a copy of your Membership Certificate"
                            required={true}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            value={formData?.steps.educationTraining.data?.licensesCertificates?.membershipCertificate?.certificateFile?.name} 
                            onHandleUpdatedFiles={(f) => handleFileSelected(f, "34")}
                            documentTypeId={34} documentName="licensesCertificates.membershipCertificate.certificateFile.documentTypeId"
                            onFileNameChange={handleFileNameChange}
                        />
                    <div className="mb-6"></div>
                </section>
                }

                <fieldset className="mb-4">
                    <div className={errors["licensesCertificates.deaCertificate.haveCertificate"] && "usa-form-group usa-form-group--error"}>
                        <label>Do you have a DEA Certificate ? <span className="text-red-error">*</span></label>
                        <p className="text-gray-50 text-sm w-72">
                            If "Yes", please provide certificate.
                        </p>
                        <ErrorMessage
                            errors={errors} name={"licensesCertificates.deaCertificate.haveCertificate"}
                            render={({ message }) => (
                            <p className="font-bold text-red-error -mb-1" role="alert">
                                {message}
                            </p>
                            )}
                        />
                        <Radio id="rb-haveDEA"
                                {...register("licensesCertificates.deaCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="have-dea"
                                label="Yes"
                                value="yes"
                                onChange={handleRadioOptionChange("licensesCertificates.deaCertificate.haveCertificate")}
                                checked={hasDEA === "yes"}
                                />
                        <Radio id="rb-doesNotHaveDEA"
                                name="have-dea"
                                label="No"
                                value="no"
                                onChange={handleRadioOptionChange("licensesCertificates.deaCertificate.haveCertificate")}
                                checked={hasDEA === "no"}
                                />
                        <div style={{height: "8px"}}></div>
                    </div>
                </fieldset>

                {(hasDEA === "yes") && <section>
                    <TextLimitLength label={"DEA Certificate Number"} 
                        register={register} errors={errors} maxLength={15} minLength={5}
                        name={"licensesCertificates.deaCertificate.certificateNumber"} isRequired
                        caption="Provide Number without spaces. Ex. 42233212" 
                        captionBelow="5-15 characters allowed" width={380} 
                        errorMessage="Your DEA Certificate Number is required"
                    />
            
                    <KDDatePicker 
                        pickerId="licensesCertificates.deaCertificate.expDate"
                        pickerLabel="Provide DEA Certificate Expiration Date"
                        register={register}
                        required={true}
                        onHandleChange={handleDateInputChange("licensesCertificates.deaCertificate.expDate")}
                        errorHandler={errors}
                        value={formData?.steps.educationTraining.data?.["licensesCertificates"]?.["deaCertificate"]?.["expDate"]}
                        validationType="expiration"
                    />

                    <div className="mt-4"></div>
                    <CredInputFiles fileId="licensesCertificates.deaCertificate.certificateFile.name"
                        title="DEA Certificate"
                        description="Please attach a PDF file of a copy of your DEA Certificate"
                        required={true}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value={formData?.steps.educationTraining.data?.licensesCertificates?.deaCertificate?.certificateFile?.name} 
                        onHandleUpdatedFiles={(f) => handleFileSelected(f, "32")} documentTypeId={32}
                        documentName="licensesCertificates.deaCertificate.certificateFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}

                    />  
                    <div className="mb-6"></div>
                </section>}

                <fieldset className="mb-4">
                    <div className={errors["licensesCertificates.assmcaCertificate.haveCertificate"] && "usa-form-group usa-form-group--error"}>
                        <label>Do you have a ASSMCA Certificate ? <span className="text-red-error">*</span></label>
                        <p className="text-gray-50 text-sm w-72">
                            If "Yes", please provide certificate.
                        </p>
                        <ErrorMessage
                            errors={errors} name={"licensesCertificates.assmcaCertificate.haveCertificate"}
                            render={({ message }) => (
                            <p className="font-bold text-red-error -mb-1" role="alert">
                                {message}
                            </p>
                            )}
                        />
                        <Radio id="rb-haveASSMCA"
                                {...register("licensesCertificates.assmcaCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.assmcaCertificate.haveCertificate"
                                label="Yes"
                                value="yes"
                                checked={hasASSMCA === "yes"}
                                onChange={handleRadioOptionChange("licensesCertificates.assmcaCertificate.haveCertificate")}
                        />
                        <Radio id="rb-doesNotHaveASSMCA"
                                {...register("licensesCertificates.assmcaCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.assmcaCertificate.haveCertificate"
                                label="No"
                                value="no"
                                checked={hasASSMCA === "no"}
                                onChange={handleRadioOptionChange("licensesCertificates.assmcaCertificate.haveCertificate")}
                        />
                        <div style={{height: "8px"}}></div>
                    </div>
                </fieldset>

                {(hasASSMCA === "yes") && <section>
                    <TextLimitLength label={"ASSMCA Certificate Number"} 
                        register={register} errors={errors} maxLength={15} minLength={5}
                        name={"licensesCertificates.assmcaCertificate.certificateNumber"} isRequired
                        caption="Provide Number without spaces. Ex. 42233212" 
                        captionBelow="5-15 characters allowed" width={380} 
                        errorMessage="Your ASSMCA Certificate Number is required"
                    />
            
                    <div className="mt-2"></div>
                    <KDDatePicker 
                        pickerId="licensesCertificates.assmcaCertificate.expDate"
                        pickerLabel="Provide ASSMCA Certificate Expiration Date"
                        required={true}
                        register={register}
                        onHandleChange={handleDateInputChange("licensesCertificates.assmcaCertificate.expDate")}
                        errorHandler={errors}
                        value={formData?.steps.educationTraining.data?.["licensesCertificates"]?.["assmcaCertificate"]?.["expDate"]}
                        validationType="expiration"
                    />

                    <div className="mt-4"></div>
                    <CredInputFiles fileId="licensesCertificates.assmcaCertificate.certificateFile.name"
                        title="ASSMCA Certificate"
                        description="Please attach a PDF file of a copy of your ASSMCA Certificate"
                        required={true}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value={formData?.steps.educationTraining.data?.licensesCertificates?.assmcaCertificate?.certificateFile?.name} 
                        onHandleUpdatedFiles={(f) => handleFileSelected(f, "33")} documentTypeId={33}
                        documentName="licensesCertificates.assmcaCertificate.certificateFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}
                    />
                    <div className="mb-6"></div>  
                </section>}

                <fieldset className="mb-4">
                    <div className={errors["licensesCertificates.ptanCertificate.haveCertificate"] && "usa-form-group usa-form-group--error"}>
                        <label>Do you have a Medicare Program {"(PTAN)"} ? <span className="text-red-error">*</span></label>
                        <p className="text-gray-50 text-sm w-72">
                            If "Yes", please provide certificate.
                        </p>
                        <ErrorMessage
                            errors={errors} name={"licensesCertificates.ptanCertificate.haveCertificate"}
                            render={({ message }) => (
                            <p className="font-bold text-red-error -mb-1" role="alert">
                                {message}
                            </p>
                            )}
                        />
                        <Radio id="rb-havePTAN"
                                {...register("licensesCertificates.ptanCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.ptanCertificate.haveCertificate"
                                label="Yes"
                                value="yes"
                                checked={hasPTAN === "yes"}
                                onChange={handleRadioOptionChange("licensesCertificates.ptanCertificate.haveCertificate")}
                        />
                        <Radio id="rb-doesNotHavePTAN"
                                {...register("licensesCertificates.ptanCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.ptanCertificate.haveCertificate"
                                label="No"
                                value="no"
                                checked={hasPTAN === "no"}
                                onChange={handleRadioOptionChange("licensesCertificates.ptanCertificate.haveCertificate")}
                        />
                        <div style={{height: "8px"}}></div>
                    </div>
                </fieldset>

                {(hasPTAN === "yes") && <section>
                    <TextLimitLength label={"PTAN License Number"} 
                        register={register} errors={errors} maxLength={15} minLength={5}
                        name={"licensesCertificates.ptanCertificate.certificateNumber"} isRequired
                        caption="Provide Number without spaces. Ex. 42233212" 
                        captionBelow="5-15 characters allowed" width={380} 
                        errorMessage="Your PTAN Certificate Number is required"
                    />
                    <div className="mt-2"></div>
                    <KDDatePicker 
                        pickerId="licensesCertificates.ptanCertificate.expDate"
                        pickerLabel="Provide PTAN License Expiration Date"
                        register={register}
                        required={true}
                        onHandleChange={handleDateInputChange("licensesCertificates.ptanCertificate.expDate")}
                        errorHandler={errors}
                        value={formData?.steps.educationTraining.data?.["licensesCertificates"]?.["ptanCertificate"]?.["expDate"]}
                        validationType="expiration"
                    />

                    <div className="mt-4"></div>
                    <CredInputFiles fileId="licensesCertificates.ptanCertificate.certificateFile.name"
                        title="PTAN License"
                        description="Please attach a PDF file of a copy of your PTAN License"
                        required={true}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value={formData?.steps.educationTraining.data?.licensesCertificates?.ptanCertificate?.certificateFile?.name} 
                        onHandleUpdatedFiles={(f) => handleFileSelected(f, "35")} documentTypeId={35}
                        documentName="licensesCertificates.ptanCertificate.certificateFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}
                    />
                    <div className="mb-6"></div>  
                </section>}

                <fieldset className="mb-4">
                    <div className={errors["licensesCertificates.telemedicineCertificate.haveCertificate"] && "usa-form-group usa-form-group--error"}>
                        <label>Do you have a Telemedicine Certificate ? <span className="text-red-error">*</span></label>
                        <p className="text-gray-50 text-sm w-72">
                            If "Yes", please provide certificate.
                        </p>
                        <ErrorMessage
                            errors={errors} name={"licensesCertificates.telemedicineCertificate.haveCertificate"}
                            render={({ message }) => (
                            <p className="font-bold text-red-error -mb-1" role="alert">
                                {message}
                            </p>
                            )}
                        />
                        <Radio id="rb-haveTelemedicine"
                                {...register("licensesCertificates.telemedicineCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.telemedicineCertificate.haveCertificate"
                                label="Yes"
                                value="yes"
                                checked={hasTelemedicine === "yes"}
                                onChange={handleRadioOptionChange("licensesCertificates.telemedicineCertificate.haveCertificate")}
                        />
                        <Radio id="rb-doesNotHaveTelemedicine"
                                {...register("licensesCertificates.telemedicineCertificate.haveCertificate", {
                                    required: "You must select an option"
                                })}
                                name="licensesCertificates.telemedicineCertificate.haveCertificate"
                                label="No"
                                value="no"
                                checked={hasTelemedicine === "no"}
                                onChange={handleRadioOptionChange("licensesCertificates.telemedicineCertificate.haveCertificate")}
                        />
                    </div>
                </fieldset>

                {(hasTelemedicine === "yes") && <section>
                    <TextLimitLength label={"Telemedicine Certificate Number"} 
                        register={register} errors={errors} maxLength={15} minLength={5}
                        name={"licensesCertificates.telemedicineCertificate.certificateNumber"} isRequired
                        caption="Provide Number without spaces. Ex. 42233212" 
                        captionBelow="5-15 characters allowed" width={380} 
                        errorMessage="Your Telemedicine Certificate Number is required"
                    />
                    <div className="mt-2"></div>
                    <KDDatePicker 
                        pickerId="licensesCertificates.telemedicineCertificate.expDate"
                        pickerLabel="Provide Telemedicine Certificate Expiration Date"
                        required={true}
                        register={register}
                        onHandleChange={handleDateInputChange("licensesCertificates.telemedicineCertificate.expDate")}
                        errorHandler={errors}
                        value={formData?.steps.educationTraining.data?.["licensesCertificates"]?.["telemedicineCertificate"]?.["expDate"]}
                        validationType="expiration"
                    />

                    <div className="mt-4"></div>
                    <CredInputFiles fileId="licensesCertificates.telemedicineCertificate.certificateFile.name"
                        title="Telemedicine Certificate"
                        description="Please attach a PDF file of a copy of your Telemedicine Certificate"
                        required={true}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value={formData?.steps.educationTraining.data?.licensesCertificates?.telemedicineCertificate?.certificateFile?.name} 
                        onHandleUpdatedFiles={(f) => handleFileSelected(f, "36")} documentTypeId={36}
                        documentName="licensesCertificates.telemedicineCertificate.certificateFile.documentTypeId"
                        onFileNameChange={handleFileNameChange}
                        />  
                </section>}
            </form>
        </>
    )
};

export default LicensesAndCertificates;
