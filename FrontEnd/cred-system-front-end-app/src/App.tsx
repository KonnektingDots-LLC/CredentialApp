import { Routes, Route } from "react-router-dom";
import MainLayout from "./Presentation/Layouts/mainLayout/mainLayout";
import LandingPage from "./Presentation/Pages/Landing";
import UserInformation from "./Presentation/Pages/UserInformation";
import Login from "./Presentation/Pages/Login";
import InviteDelegate from "./Presentation/Pages/ProviderDelegates/InviteDelegates";
import SearchResults from "./Presentation/Pages/SearchResults";
import DocumentsView from "./Presentation/Pages/DocumentsView";
import DelegateWelcome from "./Presentation/Pages/DelegateWelcome";
import InsuranceWelcome from "./Presentation/Pages/InsuranceWelcome";
import ProviderHome from "./Presentation/Pages/ProviderHome";
import FormSetup from "./Presentation/Pages/FormSetup";
import FormLayout from "./Presentation/Layouts/formLayout/formLayout";
import IndividualPracticeProfile from "./Presentation/Pages/CredForm/IndividualPracticeProfile";
import IncorporatedPractice from "./Presentation/Pages/CredForm/IncorporatedPractice";
import AddressesLocations from "./Presentation/Pages/CredForm/AddressesLocations";
import SpecialtiesPage from "./Presentation/Pages/CredForm/Specialties";
import PCP from "./Presentation/Pages/CredForm/PCP";
import F330 from "./Presentation/Pages/CredForm/330";
import HospitalAffiliations from "./Presentation/Pages/CredForm/HospitalAffiliations";
import Education from "./Presentation/Pages/CredForm/Education";
import CriminalRecord from "./Presentation/Pages/CredForm/CriminalRecord";
import ProfessionalLiability from "./Presentation/Pages/CredForm/ProfessionalLiability";
import ReviewForm from "./Presentation/Pages/CredForm/ReviewForm";
import { LoadingProvider } from "./Application/LoadingProvider";
import ProtectedRoute from "./Presentation/utils/ProtectedRoute";
import { ROLE } from "./Application/utils/enums";
import Glossary from "./Presentation/Pages/Glossary";
import DelegateRegistration from "./Presentation/Pages/DelegateWelcome/DelegateRegistration";
import AdminWelcome from "./Presentation/Pages/AdminWelcome";
import AdminInsurerWelcome from "./Presentation/Pages/AdminInsurerWelcome";
import InsurerRegistration from "./Presentation/Pages/InsuranceWelcome/InsurerRegistration";
import AdminInsurerRegistration from "./Presentation/Pages/AdminInsurerWelcome/AdminInsurerRegistration";
import AdminRegistration from "./Presentation/Pages/AdminWelcome/AdminRegistration";
import InsurerReview from "./Presentation/Pages/AdminInsurerWelcome/InsurerReview";
import ManageDelegates from "./Presentation/Pages/ProviderDelegates/ManageDelegates";
import ReviewSubmit from "./Presentation/Pages/CredForm/ReviewForm/ReviewSubmit";
import DelegateNofity from "./Presentation/Pages/CredForm/ReviewForm/DelegateNotify";
import ProviderReview from "./Presentation/Pages/ProviderReview";
import ProviderFormStatus from "./Presentation/Pages/ProviderHome/ProviderFormStatus";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, toast } from "react-toastify";
import { Alert } from "@trussworks/react-uswds";
import type { StatusError } from "./Infraestructure/axiosConfig";

const queryClient = new QueryClient();

function App() {
    return (
        <LoadingProvider>
            <ToastContainer
                containerId="main"
                autoClose={false}
                icon={false}
                closeButton={false}
                position="top-center"
                toastStyle={{padding: 0, marginBottom: "0.5rem", }}
                bodyStyle={{padding: 0 }}
            />
            <QueryClientProvider client={queryClient}>
                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<LandingPage />} />
                        <Route path="login" element={<Login />} />
                        <Route path="glossary" element={<Glossary />} />
                        <Route path="delegate-registration" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate]}><DelegateRegistration /></ProtectedRoute>} />
                        <Route path="user-info" element={<ProtectedRoute rolesAllowed={[ROLE.Provider]}><UserInformation /></ProtectedRoute>} />
                        <Route path="invite" element={<ProtectedRoute rolesAllowed={[ROLE.Provider]}><InviteDelegate /></ProtectedRoute>} />
                        <Route path="results" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate, ROLE.Insurance, ROLE.AdminInsurer, ROLE.Admin]}><SearchResults /></ProtectedRoute>} />
                        <Route path="documents" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate, ROLE.Provider, ROLE.Insurance, ROLE.AdminInsurer, ROLE.Admin]}><DocumentsView /></ProtectedRoute>} />
                        <Route path="delegate" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate]}><DelegateWelcome /></ProtectedRoute>} />
                        <Route path="insurance" element={<ProtectedRoute rolesAllowed={[ROLE.Insurance, ROLE.AdminInsurer]}><InsuranceWelcome /></ProtectedRoute>} />
                        <Route path="insr-registration" element={<ProtectedRoute rolesAllowed={[ROLE.Insurance]}><InsurerRegistration /></ProtectedRoute>} />
                        <Route path="provider" element={<ProtectedRoute rolesAllowed={[ROLE.Provider]}><ProviderHome /></ProtectedRoute>} />
                        <Route path="manage-delegates" element={<ProtectedRoute rolesAllowed={[ROLE.Provider]}><ManageDelegates /></ProtectedRoute>} />
                        <Route path="form-setup" element={<ProtectedRoute rolesAllowed={[ROLE.Provider, ROLE.Delegate]}><FormSetup /></ProtectedRoute>} />
                        <Route path="admin" element={<ProtectedRoute rolesAllowed={[ROLE.Admin]}><AdminWelcome /></ProtectedRoute>} />
                        <Route path="admin-registration" element={<ProtectedRoute rolesAllowed={[ROLE.Admin]}><AdminRegistration /></ProtectedRoute>} />
                        <Route path="admin-insurer" element={<ProtectedRoute rolesAllowed={[ROLE.AdminInsurer]}><AdminInsurerWelcome /></ProtectedRoute>} />
                        <Route path="adin-registration" element={<ProtectedRoute rolesAllowed={[ROLE.AdminInsurer]}><AdminInsurerRegistration /></ProtectedRoute>} />
                        <Route path="insurer-review" element={<ProtectedRoute rolesAllowed={[ROLE.AdminInsurer, ROLE.Insurance]}><InsurerReview/></ProtectedRoute>}/>
                        <Route path="provider-review" element={<ProtectedRoute rolesAllowed={[ROLE.Insurance, ROLE.AdminInsurer]}><ProviderReview /></ProtectedRoute>} />
                        <Route path="provider-status" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate, ROLE.Admin, ROLE.Provider]}><ProviderFormStatus /></ProtectedRoute>} />
                    </Route>
                    <Route path="/cred" element={<ProtectedRoute rolesAllowed={[ROLE.Delegate, ROLE.Provider]}><FormLayout /></ProtectedRoute>}>
                        <Route path="1" element={<IndividualPracticeProfile />} />
                        <Route path="2" element={<AddressesLocations />} />
                        <Route path="3" element={<SpecialtiesPage />} />
                        <Route path="4" element={<IncorporatedPractice />} />
                        <Route path="5" element={<PCP />} />
                        <Route path="6" element={<F330 />} />
                        <Route path="7" element={<HospitalAffiliations />} />
                        <Route path="8" element={<Education />} />
                        <Route path="9" element={<CriminalRecord />} />
                        <Route path="10" element={<ProfessionalLiability />} />
                        <Route path="review" element={<ReviewForm />} />
                        <Route path="submit" element={<ReviewSubmit />} />
                        <Route path="delegate-notify" element={<DelegateNofity />} />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </LoadingProvider>
    );
}

export const NetworkAlert = ({ variant, message }: { variant: StatusError, message?: string }) => {
    const alertType = variant === "client" ? "warning" : "error";

    const errorParagraph = [
        "We've encountered an issue with the information you've provided. Some details do not meet our required standards or are incomplete. To ensure a smooth and efficient credentialing process, we kindly ask you to review the entered information carefully. Please ensure all fields are accurately filled out and comply with the necessary requirements. Correcting this information is crucial for the continuation of your credentialing process.",
        "Thank you for your attention to this matter and for helping us maintain high-quality standards.",
    ];

    let errorMessage;
    if (!message) {
        errorMessage = errorParagraph.map((message, idx) => (
            <span key={idx} className="first:mb-2 block">
                {message}
            </span>
        ));
    } else {
        errorMessage = message;
    }

    const onClose = () => {
        toast.dismiss({ id: variant, containerId: "main" });
    };

    return (
        <Alert
            slim
            type={alertType}
            headingLevel="h4"
            cta={
                <button
                    className="w-24 h-12 border-[2px] border-primary-blue text-primary-blue font-bold rounded-md mr-3 leading-1"
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            }
        >
            {errorMessage}
        </Alert>
    );
};

export default App;
