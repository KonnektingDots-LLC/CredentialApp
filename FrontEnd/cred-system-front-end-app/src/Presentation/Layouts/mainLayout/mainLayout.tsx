import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TopNav from "./topNav";
import IMAGES from "../../../Application/images/images";
import FooterNav from "./footerNav";
import { Link } from "@trussworks/react-uswds";
import layoutImages from "../../../Application/images/images";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const goHome = () => {
        if (window.location.pathname.includes("user-info")) {
            return;
        }
        navigate("/");
    };

    return (
        <>
            <div className=" bg-primary-blue h-5"></div>
            <div id="main-layout-wrapper" className=" bg-white">
                {location.pathname === "/" ? (
                    <header
                        className="h-[600px]"
                        style={{
                            backgroundImage: `url(${IMAGES.bannerLandingPage})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div
                            id="top-nav"
                            className="flex justify-between pt-10 mb-20 w-10/12 mx-[5%]"
                        >
                            <div
                                id="app_name"
                                className="cursor-pointer flex gap-10"
                                onClick={() => goHome()}
                            >
                                <div>
                                    <img className="w-20" src={IMAGES.logoDeptWhite} />
                                </div>

                                <div>
                                    <p className="text-white">
                                        Individual and Incorporated Providers
                                    </p>
                                    <h2 className=" font-bold text-white">
                                        Credentialing Application
                                    </h2>
                                </div>
                            </div>
                            <nav>
                                <TopNav />
                            </nav>
                        </div>
                    </header>
                ) : (
                    <header className="w-10/12 m-auto">
                        <div id="top-nav" className=" flex justify-between mt-10 mb-20">
                            <div id="app_name" className="cursor-pointer flex gap-10" onClick={goHome}>
                                <div>
                                    <img className="w-20" src={IMAGES.logoDeptBlack} />
                                </div>

                                <div>
                                    <p>Individual and Incorporated Providers</p>
                                    <h2 className=" font-bold">Credentialing Application</h2>
                                </div>
                            </div>
                            <nav>
                                <TopNav />
                            </nav>
                        </div>
                    </header>
                )}
                <main className="w-10/12 m-auto">
                    <Outlet />
                </main>
                <footer>
                    <div className="pl-10 py-4 mt-10">
                        <Link href={"#"} variant={"nav"}>
                            Back to top
                        </Link>
                    </div>
                    <div className=" bg-base-lightest py-3 pl-10">
                        <FooterNav />
                    </div>
                    <div className="flex px-8 justify-between">
                        <div id="logo_comisionado" className=" w-4/12 flex gap-4">
                            <img src={layoutImages.logoComisionado} />
                            <p className="font-bold self-center">Gobierno de Puerto Rico</p>
                        </div>
                        <div id="contact_corner" className=" pt-5">
                            <div id="call_center" className=" text-end mt-3">
                                <p className=" font-extrabold text-sm">Contact email</p>
                                <p className=" text-sm font-normal lowercase">
                                    credenciales@ocs.pr.gov
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default MainLayout;
