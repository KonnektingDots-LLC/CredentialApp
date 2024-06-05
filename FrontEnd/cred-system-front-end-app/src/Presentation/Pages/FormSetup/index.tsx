import { useNavigate } from "react-router-dom";
import layoutImages from "../../../Application/images/images";
import InviteDelegateModal from "../../../Application/modals/inviteDelegateModal";
import { useEffect, useState } from "react";
import SetupQuestions from "./Components/SetupQuestions";
import { useForm } from "react-hook-form";
import { ExtendedFieldValues } from "../../../Application/utils/constants";
import { SetupForm } from "../../Layouts/formLayout/credInterfaces";
import { postForm } from "../../../Infraestructure/Services/form.service";
import { useMsal } from "@azure/msal-react";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { getProviderByEmail } from "../../../Infraestructure/Services/provider.service";
import { msalInstance } from "../../..";
import { PAGES_NAME, ROLE } from "../../../Application/utils/enums";
import { Button } from "@trussworks/react-uswds";
import { GoAlert } from "react-icons/go";
import { useGetForm } from "../../../Infraestructure/Hooks/useGetForm";
import { LoadingComponent } from "../CredForm/IndividualPracticeProfile";

const FormSetup = ()=> {
    const { register, setValue, formState: { errors }, handleSubmit, getValues } = useForm<ExtendedFieldValues>();
    const navigate = useNavigate();
    const api = useAxiosInterceptors();
    const {data: formData, isLoading: isLoadingForm} = useGetForm(api);
    const { instance } = useMsal();
    const [name] = useState(instance.getActiveAccount()?.idTokenClaims?.extension_LastName as string);
    const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;

    const [hasStarted, setHasStarted] = useState<boolean | null>();
    const [done, setDone] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const goHome = () => {
        role === ROLE.Provider ? navigate('/provider') : navigate('/delegate');
    }

    const onSubmit = async () => {
        setShowAlert(false);
        if (formData && !hasStarted) {
            const updatedSetup: SetupForm = {
                pcpApplies: getValues().pcpApplies === "No" ? false : true,
                insuranceApplies: getValues().insuranceApplies === "No" ? false : true,
                f330Applies: getValues().f330Applies === "No" ? false : true,
                hospitalAffiliationsApplies: getValues().hospitalAffiliationsApplies === "No" ? false : true,
                currentStep: PAGES_NAME.Individual,
                hasStarted: true,
                providerEmail: formData?.setup?.providerEmail,
                providerId: formData?.setup?.providerId
            };
        
            formData.setup = updatedSetup;
            if (formData?.setup?.providerId !== 0) {
                await postForm(api, formData.setup.providerId, formData, []);
            } else {
                setShowAlert(true);
                return;
            }
        }         
        if (formData && !showAlert) {
            switch(formData.setup.currentStep) {
                case PAGES_NAME.Incorporated:
                    navigate('/cred/4');
                    break;
                case PAGES_NAME.Addresses:
                    navigate('/cred/2');
                    break;
                case PAGES_NAME.Specialties:
                    navigate('/cred/3');
                    break;
                case PAGES_NAME.PCP:
                    navigate('/cred/5');
                    break;
                case PAGES_NAME.F330:
                    navigate('/cred/6');
                    break;
                case PAGES_NAME.Hospitals:
                    navigate('/cred/7');
                    break;
                case PAGES_NAME.Education:
                    navigate('/cred/8');
                    break;
                case PAGES_NAME.CriminalRecord:
                    navigate('/cred/9');
                    break;
                case PAGES_NAME.Insurance:
                    navigate('/cred/10');
                    break;
                case PAGES_NAME.Submit:
                    navigate('/cred/review');
                    break;
                default: 
                    navigate('/cred/1');
                    break;
            }        
            window.scrollTo({
                top: 0, 
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        const checkFormStarted = async () => {
            if (role === ROLE.Provider) {
                const email = msalInstance.getActiveAccount()?.username as string;
                const providerIdByEmail = await getProviderByEmail(api, email);

                if (!providerIdByEmail) {
                    navigate('/user-info');
                    return;
                }
                const provider = { providerId: providerIdByEmail.providerId}
                sessionStorage.setItem('provider', JSON.stringify(provider));  
            }
            const providerId = JSON.parse(sessionStorage.getItem('provider') || '{}').providerId;
            if (providerId) {
                try {
                    if (!formData) return
                    if (formData.setup.currentStep === "Notify") {
                        setDone(true);
                    } else if (!formData.setup.hasStarted) {
                        setHasStarted(false);
                    } else if (formData && formData.setup.hasStarted) {
                        setHasStarted(true);
                    }
                } catch (error) {
                    return null;
                }
            }
        };
        checkFormStarted();
    }, [formData]);

    if (isLoadingForm && !formData) {
        return <LoadingComponent />
    }

    const welcomeHeader = role === ROLE.Delegate ? `Welcome back ${name}!` : `Welcome back Dr. ${name}!`;

    return (
        <div className="h-full bg-white col-span-3 mr-auto pl-8">
            <div>
                <h1 id="lbl-greetings" className="text-bold">{welcomeHeader}</h1>
                <div id="container-verified-congratulations" style={{ marginBottom: "30px"}} className="flex flex-row">
                    <img style={{marginRight: "16px", marginTop: "6px", width: "24px", height: "24px"}} src={layoutImages.iconCongratulationCheckmark} />
                    <p style={{fontWeight: "100", fontSize: "22px", lineHeight: "35.64px", marginRight: "24%"}}>
                        { hasStarted ? 
                        "Congratulations! You may continue to complete the form." 
                        : "Congratulations. Please complete the questions to proceed."
                        }</p>
                </div>   
                <section className="flex flex-row w-full justify-between gap-5">
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    {(done && role === ROLE.Delegate) ? 
                    <>  <h3 className="ml-10 mt-10 text-2xl font-bold">Form completed!</h3>
                        <Button className="ml-8 mt-10" type="button" onClick={goHome}>Go Home</Button>
                    </> : 
                    done && role === ROLE.Provider ? <button type="submit" onClick={() => navigate('/cred/1')} className="usa-button ml-10 mt-10">Review</button> :
                    hasStarted ? 
                        <button type="submit" className="usa-button ml-10 mt-[100%]" onClick={onSubmit}>Continue</button>
                    : <>
                        <SetupQuestions register={register} errors={errors} setValue={setValue}/>
                        {showAlert &&
                         <div className="flex items-center mt-5 gap-2">
                            <GoAlert size={30} color="#B50909"/>
                            <p className="font-bold text-red-error" role="alert">
                            Error submitting your answers, provider ID not found.
                            </p>
                       </div>
                        }
                        <button type="submit" className="usa-button ml-10 mt-10">Start</button>
                    </>}
                    </form>
                    <div id="container-instructions-about-form" 
                        style={{marginRight: "10%", height: "min-content", marginTop: "50px"}} className="usa-summary-box mb-16 ml-10 max-w-md">
                        <div className="usa-summary-box__body">
                            <h3 className="usa-summary-box__heading text-bold" id="summary-box-key-information">
                                Key information
                            </h3>
                            <div className="usa-summary-box__text">
                                <ul className="usa-list list-disc">
                                    <li>
                                        It will take you approximately 20 min to fill out this form.
                                    </li>
                                    <li>
                                        You will need to have your documents in pdf format.
                                    </li>
                                    {role !== ROLE.Delegate && <li>
                                        In case you have a delegated assistant or CVO,  you can&nbsp; 
                                        <a className="usa-summary-box__link underline cursor-pointer" onClick={openModal}>invite here</a>.
                                    </li>}
                                    <li>
                                        Your information is secured, encrypted and confidential.
                                    </li>
                                    <li>
                                        You can always Save for Later and come back to finish the form.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                {isModalOpen && <InviteDelegateModal closeModal={closeModal} />}
            </div>
        </div>
    )
}

export default FormSetup;
