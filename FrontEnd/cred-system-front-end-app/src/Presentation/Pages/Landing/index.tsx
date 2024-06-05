import { useEffect } from "react";
import layoutImages from "../../../Application/images/images";
import PageTitle from "../../../Application/sharedComponents/pageTitle";
import { useNavigate, useSearchParams } from "react-router-dom";
import MediaCard from "../../../Application/sharedComponents/mediaCard";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { roleRouteMap } from "../../../Application/utils/constants";
import { EMAIL_EVENTS, ROLE } from "../../../Application/utils/enums";
import IMAGES from "../../../Application/images/images";
import { postWelcomeEmail } from "../../../Infraestructure/Services/general.service";
import { useAxiosInterceptors } from "../../../Infraestructure/axiosConfig";
import { getAdminValidation } from "../../../Infraestructure/Services/admin.service";
import { getInsurerAdminValidation } from "../../../Infraestructure/Services/insurer.service";
import { getInsurerEmployeeValidation } from "../../../Infraestructure/Services/insurerEmployee.service";
import { getDelegateValidation } from "../../../Infraestructure/Services/delegate.service";

const LandingPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxiosInterceptors();

  const handleSignUp = () => {
    instance.loginRedirect();
  };

  const navigateToGlossary = () => {
    window.scrollTo({
      top: 0, 
    });
    navigate('/glossary');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adminValidation = async (email: string) => {
    const valid = await getAdminValidation(api, email);
    if (valid?.data.exists) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adminInsurerValidation = async (email: string) => {
    const valid = await getInsurerAdminValidation(api, email);
    if (valid?.data.exists) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const insurerEmployeeValidation = async (email: string) => {
    const valid = await getInsurerEmployeeValidation(api, email);
    if (valid?.data.exists) {
      return true;
    }
    return false;
  }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const delegateValidation = async (email: string) => {
      const valid = await getDelegateValidation(api, email);
      if (valid?.data) {
        return true;
      }
      return false;
    }

  useEffect(() => {
    const handleLoad = async () => {
    const event = searchParams.get("event");
    const providerId = searchParams.get("providerId");
    const email = searchParams.get("email");

    const role = instance?.getActiveAccount()?.idTokenClaims
          ?.extension_Role as string;

    //NOTE: non authorized flow is the default render
    if (inProgress === InteractionStatus.None && isAuthenticated) {
      //regular login flow
      if (!event) {
        if (instance.getActiveAccount()?.idTokenClaims?.newUser && ROLE.Provider === role) {
          const email = instance.getActiveAccount()?.username as string;
          try {
            await postWelcomeEmail(api, email);
          } catch (error) {
            console.error("Error sending welcome email:", error);
          }
        }
        navigate(roleRouteMap[role as keyof typeof roleRouteMap]);
        return;
      } else if (event === EMAIL_EVENTS.DELEGATE_INVITED_BY_PROVIDER) {
        navigate(`/delegate-registration?prov=${providerId}`);
        return;
      } else if (event === EMAIL_EVENTS.REVIEW_PROVIDER) {
        navigate(`/form-setup`);
        return;
      } else if (event === EMAIL_EVENTS.INSURER_EMPLOYEE_INVITATION) {
        navigate('/insr-registration');
        return;
      } else if (event === EMAIL_EVENTS.ADMIN_INSURER_INVITED) {
        navigate('/adin-registration');
        return;
      } else if (event === EMAIL_EVENTS.ADMIN_REGISTRATION) {
        navigate('/admin-registration');
        return;
      } else if (event === EMAIL_EVENTS.INSURER_REVIEW_DOCS) {
        navigate(`/insurer-review?prov=${providerId}`);
        return;
      }
    }
    else if (event === EMAIL_EVENTS.DELEGATE_INVITED_BY_PROVIDER) {
      if (email) {
        const validate = await delegateValidation(email);
        if (validate) {
          const providerId = searchParams.get("providerId");
          if (providerId) {
            instance.loginRedirect({
                scopes: [
                  import.meta.env.VITE_SCOPES_READ,
                  import.meta.env.VITE_SCOPES_WRITE
                ],
                authority: import.meta.env.VITE_DELG_AUTH,
                extraQueryParameters: {
                  event: event,
                  providerId: providerId,
                  from: 'b2c'
                },
              })
              .catch((error: any) => console.log(error));
          }
        }
      }
      return;
    } else if (event === EMAIL_EVENTS.REVIEW_PROVIDER) {
       instance.loginRedirect();
    } else if (event === EMAIL_EVENTS.INSURER_EMPLOYEE_INVITATION) {
      if (email) {
        const validate = await insurerEmployeeValidation(email);
        if (validate) {
          // insurer login redirect
          instance.loginRedirect({
            scopes: [
              import.meta.env.VITE_SCOPES_READ,
              import.meta.env.VITE_SCOPES_WRITE
            ],
            authority: import.meta.env.VITE_INSR_AUTH,
            extraQueryParameters: {
              event: event,
              email: email,
              from: 'b2c'
            },
          })
          .catch((error: any) => console.log(error));
        }   
      }
      return;
    } else if (event === EMAIL_EVENTS.ADMIN_INSURER_INVITED) {
      const email = searchParams.get("email");
      if (email) {
        const validate = await adminInsurerValidation(email);
        if (validate) {
          // admin insurer login redirect
          instance.loginRedirect({
            scopes: [
              import.meta.env.VITE_SCOPES_READ,
              import.meta.env.VITE_SCOPES_WRITE
            ],
            authority: import.meta.env.VITE_ADMI_INSR_AUTH,
            extraQueryParameters: {
              event: event,
              email: email,
              from: 'b2c'
            },
          })
          .catch((error: any) => console.log(error)); 
        }
      }
      return;
    } else if (event === EMAIL_EVENTS.ADMIN_REGISTRATION) {
      const email = searchParams.get("email");
      if (email) {
        const validate = await adminValidation(email);
        if (validate) {
          // admin login redirect
          instance.loginRedirect({
            scopes: [
              import.meta.env.VITE_SCOPES_READ,
              import.meta.env.VITE_SCOPES_WRITE
            ],
            authority: import.meta.env.VITE_ADMIN_AUTH,
            extraQueryParameters: {
              event: event,
              email: email,
              from: 'b2c'
            },
          })
          .catch((error: any) => console.log(error));
        }  
      }
      return;
    } else if (event === EMAIL_EVENTS.INSURER_REVIEW_DOCS) {
      const providerId = searchParams.get("providerId");
      if (providerId) {
        instance.loginRedirect({
            scopes: [
              import.meta.env.VITE_SCOPES_READ,
              import.meta.env.VITE_SCOPES_WRITE
            ],
            extraQueryParameters: {
              event: event,
              providerId: providerId,
              from: 'b2c'
            },
          })
          .catch((error: any) => console.log(error));
      }
      return;
    } 
  }
  handleLoad();

},[isAuthenticated, inProgress]);

  return (
    <div className="w-full -mt-[500px]">
      <section className="flex w-full px-0 gap-[10%] items-center mb-20">
        <div className="flex flex-col w-[40%] space-y-20">
          <div>
            <h1 className="font-black mb-2 text-white">
              Credentialing made simple.
            </h1>
            <p className="text-xl mb-3 text-white">
              The new centralized and agile credentialing process for health
              providers in Puerto Rico.
            </p>
            <button type="button" className="usa-button" onClick={handleSignUp}
              style={{ backgroundColor: "#2496EF"}}
            >
            Create your Account
          </button>
          </div>
        </div>
        <div className="-ml-4 flex items-center justify-center" style={{ 
                backgroundImage: `url(${IMAGES.circleDiagonalLines})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: "500px", width: "500px"
              }}>
          <img src={layoutImages.mobileLandingPage} />
        </div>
      </section>
      {/* ------------ row 2 ------------ */}
      <section className="flex w-full px-0 gap-[10%] my-10">
        <div className="flex w-[50%] items-center gap-5">
          <div className="text-center">
            <span className="flex justify-center">
              <img src={layoutImages.shieldLandingPage} />
            </span>
            <h1 className="font-black mb-2 text-primary-blue">
              Your Online Credentialing Application
            </h1>
            <p className="text-xl mb-2">
              Your Credentialing Single-Source-of Truth for government,
              insurance and health providers.
            </p>
          </div>
        </div>
        <div className="ml-auto -mr-36">
          <img className="m-0 p-0" src={layoutImages.landingImage1} />
        </div>
      </section>
       {/* ------------ row 3 ------------ */}
       <section className="flex w-full px-0 gap-[10%] items-center my-10">
        <div className="ml-auto">
          <img className="m-0 p-0" src={layoutImages.documentsImage} />
        </div>
        <div className="flex flex-col w-[40%] space-y-20">
          <div>
            <h1 className="font-black mb-2 text-primary-blue">
              Present all your credentialing documents in one place.
            </h1>
            <p className="text-xl mb-2">
              Maintain insurance and government agencies in sync.
            </p>
          </div>
        </div>
      </section>
      {/* ------------ row 4 ------------ */}
      <section className="flex w-full px-0 gap-[10%] my-10">
        <div className="flex w-[50%] justify-center items-center">
          <div className="text-center">
            <span className="flex justify-center">
              <img src={layoutImages.circleArrowsIcon} />
            </span>
            <h1 className="font-black mb-2 text-primary-blue">
              Single Source-of-Truth
            </h1>
            <p className="text-xl mb-2">
              Providers, Insurance company and agencies are now able 
              and accountable to use our system.
            </p>
          </div>
        </div>
        <div className="ml-auto -mr-36">
          <img className="m-0 p-0" src={layoutImages.landingImage2} />
        </div>
      </section>
      {/* ------------ row 5 ------------ */}
      <section className="bg-base-lightest flex w-[100%] px-0 items-center justify-center text-center py-36">
        <div className="flex flex-col items-center w-[620px] space-y-2">
            <h1 className="font-black mb-2 text-primary-blue">
            Get your Credentialing Application  processed faster.
            </h1>
            <p className="text-xl mb-2">
            Save, Review & Send your information to any insurance on the health ecosystem. You can also invite yor delegates.
            </p>
            <button type="button" className="usa-button" onClick={handleSignUp}
              style={{ backgroundColor: "#2496EF"}}
            >
            Get Started
          </button>
        </div>
      </section>
      {/* ------------ row 6 ------------ */}
      <section className="mt-20 flex justify-center">
        <div className="flex flex-col items-start justify-center space-y-20">
          <div className="w-full flex text-center justify-center">
            <PageTitle
              title={"Let's get started."}
              subtitle={"See your options."}
            />
          </div>
          <div id="card_wrapper" className=" flex">
            <div className=" w-3/12" onClick={handleSignUp}>
              <MediaCard
                title="Fill Credentialing Application"
                body="Get started today with your form, upload documents, save and come back to it later."
                url="" imageSrc={IMAGES.medicalSuit}
                withBackground
              />
            </div>
            <div className=" w-3/12" onClick={handleSignUp}>
              <MediaCard
                title="Assign a Delegate or CVO"
                body="Choose someone in your office or send it to a licensed CVO you choose.   "
                url="" imageSrc={IMAGES.healthProvider}
                withBackground
              />
            </div>
            <div className=" w-3/12" onClick={handleSignUp}>
              <MediaCard
                title="Incorporated Provider Profile"
                body="As an Incorporated Health provider you can add and manage as many NPI you need."
                url="" imageSrc={IMAGES.maleProvider}
                withBackground
              />
            </div>
            <div className=" w-3/12">
              <MediaCard
                title="Understand the concepts with the Glossary"
                body="If you are a Insurance Clerk in your organization trying to get started, learn more here."
                url="/glossary" imageSrc={IMAGES.femaleProvider}
                withBackground
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-20 flex justify-center gap-2">
        <a onClick={handleSignUp} className="underline text-primary-blue cursor-pointer">Create your Account</a>
        <p>or</p>
        <a onClick={navigateToGlossary} className="underline text-primary-blue cursor-pointer">Learn More</a>
      </section>
    </div>
  );
};

export default LandingPage;
