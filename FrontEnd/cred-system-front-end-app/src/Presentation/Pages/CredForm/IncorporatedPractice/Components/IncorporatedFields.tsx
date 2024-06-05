import CredInputFiles from "../../../../../Application/sharedComponents/CredInputFile";
import KDDatePicker from "../../../../../Application/sharedComponents/KDDatePicker";
import { useFormContext } from "react-hook-form";
import SelectInput from "./SelectInput";
import { ExtendedFieldValues } from "../../../../../Application/utils/constants";
import { IncorporatedPracticeProfile } from "../../../../Layouts/formLayout/credInterfaces";
import { ErrorMessage } from "@hookform/error-message";
import { Checkbox, Radio } from "@trussworks/react-uswds";
import { ChangeEvent, useEffect, useState } from "react";
import EINInput from "../../Components/EINInput";
import SSNInput from "../../Components/SSNInput";
import SpecialtyDropdown from "../../Components/SpecialtyDropdown";
import { Files, Specialty } from "../../../../../Application/interfaces";
import { getSpecialtyList } from "../../../../../Infraestructure/Services/dropdowns.service";
import { AxiosInstance } from "axios";
import AddressFields from "./AddressFields";
import TextLimitLength from "../../../../../Application/sharedComponents/InputText/TextLimitLength";
import PhoneNumber from "../../../../../Application/sharedComponents/InputText/PhoneNumber";
import { NpiInput } from "../../../../../Application/sharedComponents/InputText/NpiInput";
import { handleKeyDown } from "../../../../../Application/utils/helperMethods";

interface Props {
    formData: IncorporatedPracticeProfile | undefined;
    idNum: number;
    specialtyList: Specialty[] | undefined;
    api: AxiosInstance
    setFilesDetail: React.Dispatch<React.SetStateAction<Files[]>>
}

const IncorporatedFields = ({ formData, idNum, specialtyList, api, setFilesDetail }: Props) => {
    const { register, formState: { errors }, setValue, watch, unregister, setError, clearErrors, getValues } = useFormContext<ExtendedFieldValues>(); // use this instead of the props
    const[list, setSpecialtyList] = useState<Specialty[] | undefined>(specialtyList);
    const [sameAs, setSameAs] = useState(formData?.values?.[idNum]?.addressInfo?.isPhysicalAddressSameAsMail);
    const [specialtyType, setSpecialtyType] = useState(formData?.values?.[idNum]?.specialtyTypeId);
    const [participateMedicaid, setParticipateMedicaid] = useState(formData?.values?.[idNum]?.participateMedicaid);
    const [numberOption, setNumberOption] = useState(parseInt(formData?.values?.[idNum]?.corporateTaxType ?? ""));
    const [newFileName, setNewFileName] = useState('');

    const handleFileSelected = (files: File[], documentTypeId: string) => {
        const newFileDetails = files.map(file => {
            let oldFilename;
            if (documentTypeId === "10" && newFileName !== formData?.values?.[idNum]?.corporationCertificateFile?.name) {
                oldFilename = formData?.values?.[idNum]?.corporationCertificateFile?.name
            }
            if (documentTypeId === "11" && newFileName !== formData?.values?.[idNum]?.corporateNpiCertificateFile?.name) {
                oldFilename = formData?.values?.[idNum]?.corporateNpiCertificateFile?.name
            }
            if (documentTypeId === "12" && newFileName !== formData?.values?.[idNum]?.w9File?.name) {
                oldFilename = formData?.values?.[idNum]?.w9File?.name
            }
    
            return {
                documentTypeId: documentTypeId,
                file: file,
                ...(oldFilename ? { oldFilename } : {})
            };
        });
        setFilesDetail(prevDetails => {
            return [...prevDetails, ...newFileDetails];
        });
    };

    const handleFileNameChange = (newFileName: string) => {
        setNewFileName(newFileName);
    };

    const handleDateInputChange  = (key: string) => (value: string | undefined) => {
        setValue(key, value, {shouldValidate: true, shouldDirty: true });
    }

    const handleProviderSpecialty = (data: ChangeEvent<HTMLInputElement>) => {
        setSpecialtyType(data.target.value);
        setValue(`values[${idNum}].specialtyTypeId`, data.target.value, {shouldValidate: true, shouldDirty: true });
    }

    const handleParticipateMedicaid = (data: ChangeEvent<HTMLInputElement>) => {
        setParticipateMedicaid(data.target.value)
        setValue(`values[${idNum}].participateMedicaid`, data.target.value, {shouldValidate: true, shouldDirty: true });
        setValue(`values[${idNum}].medicaidIdLocation`, '');
        setValue(`values[${idNum}].subspecialty`, []);
        setValue(`values[${idNum}].specialtyTypeId`, '');
    }

    const handleNumberOption = (data: ChangeEvent<HTMLInputElement>) => {
        if (data.target.value === "2") {
            unregister(`values[${idNum}].w9File.name`);
            unregister(`values[${idNum}].w9File.documentTypeId`);
        }
        setValue(`values[${idNum}].corporateTaxType`, data.target.value, {shouldValidate: true, shouldDirty: true });
        setNumberOption(parseInt(data.target.value));
    }

    const handleOnCheckboxChange = (data: any) => {
        setSameAs(data.target.checked);
        setValue(`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`, data.target.checked, { shouldDirty: true });
    }

    const physicalAddressValues = watch([
        `values[${idNum}].addressInfo.physical.name`,
        `values[${idNum}].addressInfo.physical.address1`,
        `values[${idNum}].addressInfo.physical.address2`,
        `values[${idNum}].addressInfo.physical.city`,
        `values[${idNum}].addressInfo.physical.state`,
        `values[${idNum}].addressInfo.physical.zipcode`,
        `values[${idNum}].addressInfo.physical.zipcodeExtension`
    ]);

    useEffect(() => {
        if(sameAs) {
            setValue(`values[${idNum}].addressInfo.mail.name`, physicalAddressValues[0], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.address1`, physicalAddressValues[1], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.address2`, physicalAddressValues[2], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.city`, physicalAddressValues[3], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.stateId`, physicalAddressValues[4], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.zipcode`, physicalAddressValues[5], { shouldDirty: true });
            setValue(`values[${idNum}].addressInfo.mail.zipcodeExtension`, physicalAddressValues[6], { shouldDirty: true });
        }
    }, [physicalAddressValues, setValue, idNum, sameAs]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchSpecialtyList = await getSpecialtyList(api, 1);
            setSpecialtyList(fetchSpecialtyList);

        };
        fetchData();
    }, []);

    useEffect(() => {
        if (participateMedicaid === "No") {
            unregister(`values[${idNum}].specialtyTypeId`);
        }
    }, [participateMedicaid, unregister, idNum]);
    
    
    return (<>
        <form autoComplete="off" onKeyDown={handleKeyDown}>
            <p>
                Required fields are marked with an asterisk{"("}
                <span className="text-red-error">*</span>
                {") "}
            </p>

            <TextLimitLength label={"Corporate Practice Name "} register={register}
                name={`values[${idNum}].corporatePracticeName`} errors={errors}
                isRequired={true} minLength={1} maxLength={50}
            />

            <KDDatePicker 
                pickerId={`values[${idNum}].incorporationEffectiveDate`}
                pickerLabel="Incorporation Effective Date"
                required={true}
                onHandleChange={handleDateInputChange(`values[${idNum}].incorporationEffectiveDate`)}
                errorHandler={errors} register={register}  
                value={formData?.values?.[idNum]?.incorporationEffectiveDate}          
            />
            
            <NpiInput
                isRequired
                name={`values[${idNum}].corporationNpiNumber`}
                label="Corporation NPI Number"
            />

            <CredInputFiles title="Corporation Certificate"
                description="Please attach your Corporation Certificate as a .pdf document"
                fileId={`values[${idNum}].corporationCertificateFile.name`}
                required={true} documentTypeId={10}
                register={register} errors={errors} setValue={setValue}
                value={formData?.values?.[idNum]?.corporationCertificateFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "10")}
                documentName={`values[${idNum}].corporationCertificateFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
            <div style={{height: "14px"}}></div>

            <NpiInput
                isRequired
                name={`values[${idNum}].renderingNpiNumber`}
                label="Rendering NPI Number"
            />

            <CredInputFiles title="NPI Certificate"
                description="Please attach your NPI Certificate as a .pdf document"
                fileId={`values[${idNum}].corporateNpiCertificateFile.name`}
                required={true} documentTypeId={11}
                register={register} errors={errors} setValue={setValue}
                value={formData?.values?.[idNum]?.corporateNpiCertificateFile?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "11")}
                documentName={`values[${idNum}].corporateNpiCertificateFile.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
            <div style={{height: "14px"}}></div>

            <fieldset>
                <div className={errors[`values[${idNum}].corporateTaxType`] && "usa-form-group usa-form-group--error"}>
                    <label htmlFor={`values[${idNum}].corporateTaxType`}>Corporate Tax ID based on:{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors[`values[${idNum}].corporateTaxType`]} name={`values[${idNum}].corporateTaxType`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />   
                    <span className="flex gap-3">      
                        <Radio id={`rb-${idNum}-ein`}
                            {...register(`values[${idNum}].corporateTaxType`, {
                                required: "You must select an option"
                            })}
                            name={`values[${idNum}].corporateTaxType`}
                            label="Employer ID Number"
                            value={1}
                            onChange={handleNumberOption}
                            checked={1 === numberOption}
                        />
                        <Radio id={`rb-${idNum}-ss4`}
                            name={`values[${idNum}].corporateTaxType`}
                            label="SS-4"
                            value={2}
                            onChange={handleNumberOption}
                            checked={2 === numberOption}
                        />
                    </span>   
                </div>
            </fieldset>
            {numberOption === 1 ? 
                <EINInput register={register} errors={errors} label={"Corporate Tax ID Number "} name={`values[${idNum}].corporateTaxNumber`} setValue={setValue}
                    value={formData?.values?.[idNum]?.corporateTaxNumber ?? ""}
                /> 
                : 
                <SSNInput register={register} errors={errors} label={"Corporate Tax ID Number "} name={`values[${idNum}].corporateTaxNumber`} setValue={setValue}
                    value={formData?.values?.[idNum]?.corporateTaxNumber ?? ""}
                />
            }

            <CredInputFiles title="W-9"
                description="Please attach your W-9 as a .pdf document"
                fileId={`values[${idNum}].w9File.name`}
                required={numberOption === 1 ? true : false}
                register={register} errors={errors} setValue={setValue}
                value={formData?.values?.[idNum]?.w9File?.name}
                onHandleUpdatedFiles={(f) => handleFileSelected(f, "12")}
                documentTypeId={12}
                documentName={`values[${idNum}].w9File.documentTypeId`}
                onFileNameChange={handleFileNameChange}
            />
            <div style={{height: "14px"}}></div>

            <fieldset>
                <div className={errors[`values[${idNum}].participateMedicaid`] && "usa-form-group usa-form-group--error"}>
                    <label>Do you participate in the Medicaid Program?:{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={`values[${idNum}].participateMedicaid`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />            
                    <Radio id={`rb-${idNum}-yes-participateMedicaid`}
                        {...register(`values[${idNum}].participateMedicaid`, {
                            required: "You must select an option"
                        })}
                        name={`values[${idNum}].participateMedicaid`}
                        label="Yes"
                        value="Yes"
                        onChange={handleParticipateMedicaid}
                        checked={"Yes" === participateMedicaid}
                    />
                    <Radio id={`rb-${idNum}-no-participateMedicaid`}
                        name={`values[${idNum}].participateMedicaid`}
                        label="No"
                        value="No"
                        onChange={handleParticipateMedicaid}
                        checked={"No" === participateMedicaid}
                    />
                    <div style={{height: "12px"}}></div>
                </div>
            </fieldset>
            {participateMedicaid === "Yes" && <>
            <fieldset>
                <div className={errors[`values[${idNum}].specialtyTypeId`] && "usa-form-group usa-form-group--error"}>
                    <label>Provider Specialty:{" "}<span className="text-red-error">*</span></label>
                    <ErrorMessage
                        errors={errors} name={`values[${idNum}].specialtyTypeId`}
                        render={({ message }) => (
                        <p className="font-bold text-red-error -my-1" role="alert">
                            {message}
                        </p>
                        )}
                    />            
                    <Radio id={`rb-${idNum}-primary-care`}
                        {...register(`values[${idNum}].specialtyTypeId`, participateMedicaid === "Yes" ? {
                            required: "You must select an option"} : { required: undefined
                        })}
                        name={`values[${idNum}].specialtyTypeId`}
                        label="Primary Care"
                        value="1"
                        onChange={handleProviderSpecialty}
                        checked={"1" === specialtyType}
                    />
                    <Radio id={`rb-${idNum}-specialty-care`}
                        name={`values[${idNum}].specialtyTypeId`}
                        label="Specialty Care"
                        value="2"
                        onChange={handleProviderSpecialty}
                        checked={"2" === specialtyType}
                    />
                    <div style={{height: "12px"}}></div>
                </div>
            </fieldset>


            <div style={{height: "10px"}}></div>

            <SpecialtyDropdown register={register} errors={errors} setValue={setValue} 
                name={`values[${idNum}].subspecialty`} label={"Subspecialty"} required={participateMedicaid === "Yes"} 
                list={list} value={getValues()?.values?.[idNum]?.subspecialty}
            />

            <TextLimitLength label={"Medicaid ID for this Location "} register={register}
                name={`values[${idNum}].medicaidIdLocation`} errors={errors} maxLength={25} 
                isRequired={participateMedicaid === "Yes"} minLength={5}
                caption="5-25 characters allowed" 
            />
            </>}

            <h3 className="font-black mt-4 mb-2">Corporate Practice Physical Address</h3>

            <AddressFields formData={formData} idNum={idNum}
                api={api} errors={errors} prefix={"addressInfo"}
                register={register } setValue={setValue}  
                clearErrors={clearErrors} setError={setError}
            />

            <h3 className="font-black mt-4 mb-2">Mailing Address</h3>
            <Checkbox 
                {...register(`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`)}
                id={`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`}
                label="Same as Physical Address"
                name={`values[${idNum}].addressInfo.isPhysicalAddressSameAsMail`}
                checked={sameAs}
                onChange={handleOnCheckboxChange}
                className="ml-4 mb-2"
            />
            {!sameAs &&
                <AddressFields formData={formData}  idNum={idNum}
                    api={api} isMail errors={errors} prefix={"addressInfo"}
                    register={register } setValue={setValue}  
                    clearErrors={clearErrors} setError={setError}
                />
            }
            <div style={{height: "20px"}}></div>

            <PhoneNumber register={register} errors={errors} 
                label={"Corporate Entity Contact Phone Number "} 
                name={`values[${idNum}].corporatePhoneNumber`} 
                setValue={setValue} 
                value={formData?.values?.[idNum]?.corporatePhoneNumber}
            />

            <h3 className="font-black mt-4 mb-2">Employer ID Physical Address</h3>

            <div style={{height: "12px"}}></div>
            <AddressFields formData={formData} idNum={idNum}
                api={api} errors={errors} prefix={"employerIDAddressInfo"}
                register={register } setValue={setValue}  
                clearErrors={clearErrors} setError={setError}
            />

            <SelectInput register={register} errors={errors} name={`values[${idNum}].entityTypeId`}
                value={formData?.values?.[idNum]?.entityTypeId} required={true} setValue={setValue}
            />

        </form>
    </>
    )
}

export default IncorporatedFields;
