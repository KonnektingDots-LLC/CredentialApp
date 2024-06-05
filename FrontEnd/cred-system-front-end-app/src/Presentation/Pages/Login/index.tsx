import PageTitle from "../../../Application/sharedComponents/pageTitle";
import layoutImages from "../../../Application/images/images";
import GrayCircularBackground from "../../../Application/images/bgCircularBaseLightest.png"
import { useMsal } from "@azure/msal-react";

const Login = () => {
    const { instance } = useMsal();


    const handleSignIn = () => {
        instance.loginRedirect();
    }

  return (
    <>
        <PageTitle title="Hello Again." subtitle="Sign in for your streamlined Credentialing process."/>
        <div className="flex flex-row mt-[8%] gap-10">
            <div>
                <div className="pt-10 pb-8 px-8 bg-base-lightest mb-auto">
                    <PageTitle title="Sign in" subtitle="Access your account." displayLogo={false}/>

                    <div className="flex place-items-end w-80 h-28">
                        <button className="usa-button ml-3" onClick={handleSignIn}>Sign in</button>
                    </div>
                </div>
                <p className="text-center mt-4"> Do not have an account?&nbsp; 
                    <button className="usa-link cursor-pointer text-primary">Create Account</button> 
                </p>
            </div>
            <div className="ml-auto -mt-20">
                <img src={layoutImages.imgLogin} />
                <div className="flex w-4/5 mt-12">
                    <div className="my-auto" 
                        style={{height: "70px", 
                                width: "70px", 
                                backgroundImage: `url(${GrayCircularBackground})`, 
                                backgroundPosition: 'center', 
                                backgroundSize: '50px 50px', 
                                backgroundRepeat: 'no-repeat'
                                }}>
                        <img style={{height: "28px", width: "28px"}} 
                            className="mt-6 mx-auto"
                            src={layoutImages.iconMessageBubble}/>
                    </div>
                    
                    <div className="ml-8">
                        <p style={{lineHeight: "25.92px"}} className="text-bold">Collaboration and Communication</p>
                        <p style={{lineHeight: "25.92px"}}>Communicate seamlessly with credentialing organizations and institutions.</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </>
  );
};

export default Login;