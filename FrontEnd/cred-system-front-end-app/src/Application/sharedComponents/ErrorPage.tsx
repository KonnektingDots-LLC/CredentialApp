import PageTitle from "./pageTitle"
import layoutImages from "../images/images"
import { msalInstance } from "../..";
import { useLocation, useNavigate } from "react-router-dom";
import { ROLE } from "../utils/enums";

const NotFoundResults = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        const role = msalInstance.getActiveAccount()?.idTokenClaims?.extension_Role as string;
        role === ROLE.Delegate ? navigate('/delegate') : navigate('/provider');
    };

    return (  <> 
        <div className=" bg-primary-blue h-5"></div>
        <div id="main-layout-wrapper" className=" bg-white">
            <header className="w-10/12 m-auto">
                <div id="top-nav" className=" flex justify-between pt-10 mb-10">
                    <div><img className="w-20" src={layoutImages.logoDeptBlack}/></div>
                </div>
            </header>
            <div className="mx-[20%]">
                <PageTitle title="An error occurred!" 
                    subtitle={`Please refresh the page and try again.`}
                />
                <img className="mx-auto mb-10" src={layoutImages.imgNotFound} />
                {/* <p className={"text-gray-50 text-base mb-7"}>Have you completed your information? It's essential for accessing the form. 
                    <br/>Please, {" "} 
                    <Link href={"/user-info"} variant="nav">click here to fill out your information.</Link>
                </p> */}
            <button className="usa-button usa-button--outline" style={{marginTop: "20px"}} onClick={handleRefresh}>Refresh</button>
            {location.pathname.includes('cred') && <button className="usa-button" style={{marginTop: "20px"}} onClick={() => navigate('/form-setup')}>Fill Form</button> }
            <button className="usa-button" style={{marginTop: "20px"}} onClick={handleGoHome}>Go Home</button>
            </div>
        </div>
    </>)
}

export default NotFoundResults;