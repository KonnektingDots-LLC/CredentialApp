import Collaspsible from "../../../../Application/sharedComponents/Collaspsible";
import BackButton from "../Components/BackButton";
import PageTitle from "../../../../Application/sharedComponents/pageTitle";
import { AccordionItemProps } from "@trussworks/react-uswds/lib/components/Accordion/Accordion";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PhysicalAddressFields from "./Components/PhysicalAddressFields";
import ConditionalPhysicalAddressFields from "./Components/ConditionalPhysicalAddressFields";
import NavStepperStatus from "../Components/NavStepperStatus";
import { useNavigate } from "react-router-dom";
import { postForm } from "../../../../Infraestructure/Services/form.service";
import OfficeStatus from "./Components/OfficeStatus";
import { addressDefaultValues } from "../Components/defaultFormValues";
import { useAxiosInterceptors } from "../../../../Infraestructure/axiosConfig";
import { PAGES_NAME, ROLE } from "../../../../Application/utils/enums";
import { msalInstance } from "../../../..";
import ServiceHoursInput from "./Components/ServiceHoursInput";
import { Files } from "../../../../Application/interfaces";
import { AddressLocations, ServiceHours } from "../../../Layouts/formLayout/credInterfaces";
import { LoadingComponent } from "../IndividualPracticeProfile";
import { useGetForm } from "../../../../Infraestructure/Hooks/useGetForm";

const AddressesLocations = () => {
    const navigate = useNavigate();
    const api = useAxiosInterceptors();

    const { data: formData, isLoading: isFormLoading } = useGetForm(api);

    const [defaultFormValues, setDefaultFormValues] = useState<any>(undefined);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [invalidIndex, setInvalidIndex] = useState(0);

    const methods = useForm({ mode: "onChange", defaultValues: defaultFormValues});

    const [officeAddresses, setOfficeAddress] = useState<AccordionItemProps[]>([]);
    const filesDetail: Files[] = [];

    // render addresses form
    const addAddressForm = () => {
        const form: AccordionItemProps = {
            id: `form-id-${officeAddresses.length + 1}`,
            title: "Office " + (officeAddresses.length + 1),
            expanded: true,
            headingLevel: 'h2',
            content: (
                <div>
                    <OfficeStatus formData={formData}
                        idNum={officeAddresses.length}
                    />

                    <div style={{ height: "48px" }}></div>
                    <h1 className="font-black mb-2">Physical Address</h1>

                    <PhysicalAddressFields formData={formData}
                        idNum={officeAddresses.length}
                        api={api}
                    />

                    <div style={{ height: "48px" }}></div>
                    <h1 className="font-black mb-2">Mailing Address</h1>
                    <ConditionalPhysicalAddressFields idNum={officeAddresses.length}
                        formData={formData} api={api}
                    />

                    <div style={{ height: "48px" }}></div>
                    <h1 className="font-black mb-2">Service Hours</h1>
                    <label>Add your Office Schedule</label>

                    <div style={{ height: "16px" }}></div>
                    {
                        formData?.steps ?
                            <>
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={0}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={1}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={2}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={3}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={4}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={5}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                                <ServiceHoursInput setValue={methods.setValue}
                                    idNum={officeAddresses.length} dayOfWeek={6}
                                    formData={formData.steps.addressesLocations.data?.values[officeAddresses.length]?.serviceHours}
                                />
                            </>
                            : null
                    }
                    <div style={{height: "16px"}}></div>
                </div>
            ),
        };

        return form;
    }

    const handleAddAnotherAddressFields = () => {
        setError(false);
        const tempOfficeAddresses = [...officeAddresses];
        tempOfficeAddresses.push(addAddressForm());

        setOfficeAddress(tempOfficeAddresses);
    }

    const handleRemoveAddressFields = () => {
        setOfficeAddress(prevState => prevState.slice(0, -1));

        const currentValues = methods.getValues();
        if (currentValues && currentValues.values) {
            currentValues.values.pop();
        }
        methods.reset(currentValues);
    };

    const isHoursPartiallyFilled = (hours: ServiceHours): boolean => {
        if ((hours?.hourFrom?.length > 0 && hours?.hourTo?.length > 0) ||
            (hours?.hourFrom === "" && hours?.hourTo === "")) {
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        if (Object.keys(methods.getValues()).length === 0) {
            setError(true);
        } else {
            setAlert(false);
            setInvalidIndex(0);
            const isValidFrontEnd = await methods.trigger();
            let allValid = isValidFrontEnd;

            const formValues = methods.getValues() as AddressLocations;
            for (let i = 0; i < formValues?.values?.length; i++) {
                const value = formValues?.values[i];

                 // if publicId is missing and add it
                if (!value.publicId && formData?.steps) {
                    const count = formData.steps.addressesLocations.count += 1
                    formValues.values[i].publicId = count.toString();
                }

                 // if addressPrincipalTypeId is missing then add it
                 if (!value.addressPrincipalTypeId && formData?.steps) {
                    formValues.values[i].addressPrincipalTypeId = i === 0 ? "1" : "2";
                }

                if (value.serviceHours?.some(isHoursPartiallyFilled)) {
                    allValid = false;
                    setInvalidIndex(i+1);
                    setAlert(true);
                    break;
                }
            }
            if (allValid) {
                try {
                    if (!formData) return;
                    
                    formData.steps.addressesLocations.status = NavStepperStatus.Completed;
                    formData.steps.addressesLocations.data = methods.getValues() as any;
                    formData.setup.currentStep = PAGES_NAME.Specialties
        
                    await postForm(api, formData.setup.providerId, formData, filesDetail).then(res => {
                        if (res?.status === 200) {
                            navigate('/cred/3');
                            window.scrollTo({
                                top: 0, 
                                behavior: 'smooth'
                            });
                        }
                    });
                } catch (error) {
                    if (!formData) return;
                    formData.steps.addressesLocations.status = NavStepperStatus.Error;
                    formData.setup.currentStep = PAGES_NAME.Addresses
                }
            }
        }
    }

    const saveForLater = async () => {
        if (formData) {
            formData.steps.addressesLocations.data = methods.getValues();
            formData.setup.currentStep = PAGES_NAME.Addresses;
            if (!Array.isArray(formData?.steps?.addressesLocations?.data?.values)) {
                officeAddresses.push(addAddressForm());
            }
            await postForm(api, formData.setup.providerId, formData, filesDetail);

            const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
            role === ROLE.Delegate ? navigate("/delegate") : navigate("/provider");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    const goBack = async () => {
        if (!formData) return;
        navigate("/cred/1");
        return;
    };

    useEffect(() => {
        setDefaultFormValues(addressDefaultValues(formData));
   
        if (formData) {
            if (Array.isArray(formData?.steps?.addressesLocations?.data?.values)) {
                formData?.steps?.addressesLocations?.data?.values?.forEach((_: any, index: number) => {
                    if (!officeAddresses[index]?.id) {
                        officeAddresses.push(addAddressForm())
                    }
                })
            } else {
                officeAddresses.push(addAddressForm())
            }
        }

        if(formData?.steps){
            if (!formData.steps.addressesLocations.count && formData.steps.addressesLocations.data) {
                const { values } = formData.steps.addressesLocations.data as AddressLocations;
                if (values) {
                    const officeCount = values.length;     
                    values.forEach((office, index) => {
                        // Add publicId to each object if it doesn't exist
                          office.publicId = (index + 1).toString();
                      }); 
                    formData.steps.addressesLocations.count = officeCount;
                } else {
                    formData.steps.addressesLocations.count = 0;
                }
            }
        }
    }, [formData])

    useEffect(() => {
        if (formData) {
            methods.reset(defaultFormValues);
        }
    }, [defaultFormValues, formData, methods]);

    if (isFormLoading && !formData) {
        return <LoadingComponent />
    }

    return <>
        <div className="h-full w-full bg-white col-span-3 mr-auto pl-8">
            <BackButton label="Back" onClick={goBack}/>
            <PageTitle
                title="Addresses & Locations"
                subtitle={<p className="flex gap-1">Add your details to finish your <p className="font-semibold">Individual Practice Profile</p>.</p>}
            />
                <FormProvider {...methods}>
                    <Collaspsible accordionItems={officeAddresses}/>
                    <div className="flex gap-40">
                        <div className="flex flex-col">
                            <button type="button" 
                                className="usa-button usa-button--outline mt-10"
                                onClick={handleAddAnotherAddressFields}
                                >
                                Add Additional Practice Offices
                            </button>
                            {error && <p className="font-bold text-red-error mb-2 mt-1" role="alert">
                                Address & Locations required
                                </p>
                            }
                        </div>
                        {officeAddresses.length > 1 &&
                                <button type="button" 
                                    className="usa-button usa-button--outline mt-10"
                                    onClick={handleRemoveAddressFields}
                                    >
                                    Remove Additional
                                </button>
                        }
                    </div>
                </FormProvider>
                {alert &&
                    <p className="font-bold text-red-error mt-2" role="alert">
                    Services Hours in Office {invalidIndex} must be either fully filled out or completely empty.
                    </p>
                }
                <div className="flex flex-row my-16">
                    <button type="button" 
                        className="usa-button usa-button--outline"
                        onClick={saveForLater}
                    >Save for Later</button>
                    <button type="submit" className="usa-button" onClick={onSubmit}>Next</button>
                </div>
        </div>
    </>
}

export default AddressesLocations;
